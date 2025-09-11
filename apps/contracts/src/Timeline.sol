// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";

contract Timeline is Ownable {
    struct VideoNode {
        string link;
        uint id;
        string plot;
        uint previous;
        uint[] next;
        bool canon;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    mapping(uint => VideoNode) public nodes;
    uint public latestNodeId;

    event NodeCanonized(uint id);
    event NodeCreated(uint id, uint previous);

    function createNode(
        string memory _link,
        string memory _plot,
        uint _previous // id of previous node, 0 if root should do input validation on this later
    ) public returns (uint) {
        latestNodeId++;
        uint newId = latestNodeId;

        // create node
        nodes[newId].id = newId;
        nodes[newId].link = _link;
        nodes[newId].plot = _plot;
        nodes[newId].previous = _previous;

        if (_previous == 0) {
            nodes[newId].canon = true;
        }

        // link it as "next" from its parent
        if (_previous != 0) {
            nodes[_previous].next.push(newId);
        }

        emit NodeCreated(newId, _previous);
        return newId;
    }

    // Utility: get a node's full data
    function getNode(
        uint id
    )
        public
        view
        returns (uint, string memory, string memory, uint, uint[] memory, bool)
    {
        VideoNode storage n = nodes[id];
        return (n.id, n.link, n.plot, n.previous, n.next, n.canon);
    }

    function getTimeline(uint fromId) public view returns (uint[] memory) {
        uint count = 0;
        uint cursor = fromId;

        // Count length first
        while (cursor != 0) {
            count++;
            cursor = nodes[cursor].previous;
        }

        uint[] memory chain = new uint[](count);
        cursor = fromId;
        for (uint i = 0; i < count; i++) {
            chain[i] = cursor;
            cursor = nodes[cursor].previous;
        }

        return chain; // from leaf → root order
    }

    // Get all leaf nodes (no "next")
    function getLeaves() public view returns (uint[] memory) {
        uint[] memory temp = new uint[](latestNodeId);
        uint count = 0;

        for (uint i = 1; i <= latestNodeId; i++) {
            if (nodes[i].id != 0 && nodes[i].next.length == 0) {
                temp[count] = i;
                count++;
            }
        }

        // resize to count
        uint[] memory leaves = new uint[](count);
        for (uint j = 0; j < count; j++) {
            leaves[j] = temp[j];
        }
        return leaves;
    }

    function getMedia(uint id) public view returns (string memory) {
        return nodes[id].link;
    }

    function setMedia(uint id, string memory _link) public {
        //change ownership w gov later
        nodes[id].link = _link;
    }

    function getFullGraph()
        public
        view
        returns (
            uint[] memory ids,
            string[] memory links,
            string[] memory plots,
            uint[] memory previousIds,
            uint[][] memory nextIds,
            bool[] memory canonFlags
        )
    {
        uint total = latestNodeId;

        ids = new uint[](total);
        links = new string[](total);
        plots = new string[](total);
        previousIds = new uint[](total);
        nextIds = new uint[][](total);
        canonFlags = new bool[](total);

        for (uint i = 1; i <= total; i++) {
            VideoNode storage n = nodes[i];

            ids[i - 1] = n.id;
            links[i - 1] = n.link;
            plots[i - 1] = n.plot;
            previousIds[i - 1] = n.previous;
            canonFlags[i - 1] = n.canon;

            // Copy next IDs
            uint len = n.next.length;
            uint[] memory tmpNext = new uint[](len);
            for (uint j = 0; j < len; j++) {
                tmpNext[j] = n.next[j];
            }
            nextIds[i - 1] = tmpNext;
        }

        return (ids, links, plots, previousIds, nextIds, canonFlags);
    }

    //Handle voting later

    // ---- Canon ----

    function setCanon(uint id) public onlyOwner {
        //governance will handle this
        require(nodes[id].id != 0, "Node does not exist");

        // Clear old canon (at most one canon at a time)
        for (uint i = 1; i <= latestNodeId; i++) {
            if (nodes[i].canon) {
                nodes[i].canon = false;
            }
        }

        nodes[id].canon = true;
        emit NodeCanonized(id);
    }

    // Get the canon chain (canon + all its ancestors)
    function getCanonChain() public view returns (uint[] memory) {
        uint canonId = 0;
        for (uint i = 1; i <= latestNodeId; i++) {
            if (nodes[i].canon) {
                canonId = i;
                break;
            }
        }
        require(canonId != 0, "No canon set");
        return getTimeline(canonId);
    }
}
