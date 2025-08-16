// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
contract Timeline {
  struct VideoNode {
    string link;
    uint id;
    string plot;
    string[] characters;

    uint previous;
    uint[] next;
  }

  mapping(uint => VideoNode) public nodes;
  uint public latestNodeId;

  event NodeCreated(uint id, uint previous);

    function createNode(
        string memory _link,
        string memory _plot,
        string[] memory _characters,
        uint _previous // id of previous node, 0 if root
    ) public returns (uint) {
        latestNodeId++;
        uint newId = latestNodeId;

        // create node
        nodes[newId].id = newId;
        nodes[newId].link = _link;
        nodes[newId].plot = _plot;
        nodes[newId].characters = _characters;
        nodes[newId].previous = _previous;

        // link it as "next" from its parent
        if (_previous != 0) {
            nodes[_previous].next.push(newId);
        }

        emit NodeCreated(newId, _previous);
        return newId;
    }

    // Utility: get a node's full data
    function getNode(uint id) 
        public 
        view 
        returns (
            uint,
            string memory,
            string memory,
            string[] memory,
            uint,
            uint[] memory
        ) 
    {
        VideoNode storage n = nodes[id];
        return (
            n.id,
            n.link,
            n.plot,
            n.characters,
            n.previous,
            n.next
        );
    }


}
