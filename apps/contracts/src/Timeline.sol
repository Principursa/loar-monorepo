// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/*  ==========  ORIGINAL STRUCTS  ========== */
struct Clip {
    string videoLink; // ipfs://…  or  https://…
    string audioLink;
    string timestamp; // any string you want
}

struct Video {
    Clip[] clips;
    string backgroundAudioCID; // optional
}

struct Character {
    string baseDescription;
    bytes state; // arbitrary encoded state
    uint256 lastUpdate; // block.timestamp
}

struct PlotPoint {
    uint256 characterId; // external id (will be ERC-721 tokenId later)
    bytes stateDelta;
    address proposer;
    uint256 voteFor;
    bool canon;
    uint256 officialVideoId; // nodeId in the timeline
}

struct Plot {
    string title;
    uint256[] pointIds; // indexes inside plotPoints[]
    uint256 canonThreshold; // votes needed (set to 0 for now)
}

/*  ==========================================================
    FULL TIMELINE  (nodes carry Video + link to PlotPoint)
    ========================================================== */
contract FullTimeline is Ownable {
    /*  ----  state  ---- */
    // nodeId => Node
    struct Node {
        uint256 id;
        string mediaLink; // quick access url
        Video video; // full structure
        uint256 plotPointId; // 0 if none
        uint256 previous;
        uint256[] next;
        bool canon;
    }
    mapping(uint256 => Node) public nodes;
    uint256 public latestNodeId;

    // plotPointId => PlotPoint
    mapping(uint256 => PlotPoint) public plotPoints;
    uint256 public nextPlotPointId = 1;

    // plotId => Plot
    mapping(uint256 => Plot) public plots;
    uint256 public nextPlotId = 1;

    // characterId => Character (optional mirror storage)
    mapping(uint256 => Character) public characters;

    /*  ----  events  ---- */
    event NodeCreated(uint256 indexed id, uint256 indexed previous);
    event NodeCanonized(uint256 indexed id);
    event PlotPointCreated(uint256 indexed id, uint256 indexed characterId);
    event PlotCreated(uint256 indexed id, string title);

    /*  ----  auth stub  ---- */
    // replace with your NFT check later
    modifier onlyAuth(uint256 characterId) {
        _; // stub – add your own require()
    }

    /*  ----  init  ---- */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /*  ==========================================================
        NODE MANAGEMENT
        ========================================================== */
    function createNode(
        string calldata mediaLink,
        Video calldata video,
        uint256 _previous, // 0 for root
        uint256 plotPointId // 0 if not tied to a plot-point
    ) external returns (uint256 newId) {
        latestNodeId++;
        newId = latestNodeId;

        Node storage n = nodes[newId];
        n.id = newId;
        n.mediaLink = mediaLink;
        n.previous = _previous;
        n.plotPointId = plotPointId;

        // copy Video calldata into storage
        uint256 clipLen = video.clips.length;
        for (uint256 i; i < clipLen; ++i) {
            n.video.clips.push(video.clips[i]);
        }
        n.video.backgroundAudioCID = video.backgroundAudioCID;

        // root is auto-canon
        if (_previous == 0) n.canon = true;

        // link parent→child
        if (_previous != 0) {
            nodes[_previous].next.push(newId);
        }

        emit NodeCreated(newId, _previous);
    }

    /*  ==========================================================
        PLOT & PLOT-POINT MANAGEMENT
        ========================================================== */
    function createPlot(
        string calldata title,
        uint256 canonThreshold
    ) external returns (uint256 plotId) {
        plotId = nextPlotId++;
        plots[plotId].title = title;
        plots[plotId].canonThreshold = canonThreshold;
        emit PlotCreated(plotId, title);
    }

    function proposePlotPoint(
        uint256 characterId,
        bytes calldata stateDelta,
        uint256 plotId
    ) external onlyAuth(characterId) returns (uint256 ppId) {
        ppId = nextPlotPointId++;
        plotPoints[ppId] = PlotPoint({
            characterId: characterId,
            stateDelta: stateDelta,
            proposer: msg.sender,
            voteFor: 0,
            canon: false,
            officialVideoId: 0
        });

        plots[plotId].pointIds.push(ppId);
        emit PlotPointCreated(ppId, characterId);
    }

    /*  ----  optional: mirror character storage  ---- */
    function registerCharacter(
        uint256 characterId,
        string calldata description,
        bytes calldata initialState
    ) external {
        // auth check here if you want
        characters[characterId] = Character({
            baseDescription: description,
            state: initialState,
            lastUpdate: block.timestamp
        });
    }

    function updateCharacterState(
        uint256 characterId,
        bytes calldata newState
    ) external onlyAuth(characterId) {
        characters[characterId].state = newState;
        characters[characterId].lastUpdate = block.timestamp;
    }

    /*  ==========================================================
        CANONISATION (governance stub)
        ========================================================== */
    function setCanonNode(uint256 id) external onlyOwner {
        require(nodes[id].id != 0, "No node");
        // un-canon every node
        for (uint256 i = 1; i <= latestNodeId; ++i) nodes[i].canon = false;
        nodes[id].canon = true;
        emit NodeCanonized(id);
    }

    /*  ==========================================================
        VIEW HELPERS
        ========================================================== */
    function getNode(uint256 id)
        external
        view
        returns (
            uint256,
            string memory,
            Video memory,
            uint256,
            uint256,
            uint256[] memory,
            bool
        )
    {
        Node storage n = nodes[id];
        return (
            n.id,
            n.mediaLink,
            n.video,
            n.plotPointId,
            n.previous,
            n.next,
            n.canon
        );
    }

    function getTimeline(uint256 fromId)
        external
        view
        returns (uint256[] memory chain)
    {
        uint256 count;
        uint256 cursor = fromId;
        while (cursor != 0) {
            count++;
            cursor = nodes[cursor].previous;
        }
        chain = new uint256[](count);
        cursor = fromId;
        for (uint256 i; i < count; ++i) {
            chain[i] = cursor;
            cursor = nodes[cursor].previous;
        }
        // leaf → root order
    }

    function getCanonChain() external view returns (uint256[] memory) {
        uint256 canon;
        for (uint256 i = 1; i <= latestNodeId; ++i)
            if (nodes[i].canon) {
                canon = i;
                break;
            }
        require(canon != 0, "No canon");
        return this.getTimeline(canon);
    }

    function getLeaves() external view returns (uint256[] memory) {
        uint256[] memory temp = new uint256[](latestNodeId);
        uint256 count;
        for (uint256 i = 1; i <= latestNodeId; ++i)
            if (nodes[i].id != 0 && nodes[i].next.length == 0)
                temp[count++] = i;

        uint256[] memory leaves = new uint256[](count);
        for (uint256 j; j < count; ++j) leaves[j] = temp[j];
        return leaves;
    }
}