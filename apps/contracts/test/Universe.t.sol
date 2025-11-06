// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Universe} from "../src/Universe.sol";
import {IUniverseManager} from "../src/interfaces/IUniverseManager.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../src/libraries/NodeOptions.sol";

contract UniverseTest is Test {
    Universe public universe;

    function setUp() public {
        NodeCreationOptions creationOption = NodeCreationOptions.PUBLIC;
        NodeVisibilityOptions visibilityOption = NodeVisibilityOptions.PUBLIC;

        IUniverseManager.UniverseConfig memory config = IUniverseManager
            .UniverseConfig({
                nodeCreationOption: creationOption,
                nodeVisibilityOption: visibilityOption,
                universeAdmin: msg.sender,
                name: "Universe Name",
                imageURL: "Universeimage.com",
                description: "test universe",
                universeManager: msg.sender
            });
        universe = new Universe(config);
    }

    function test_createNode() public {
        uint id = createNode();
        (
            uint nid,
            string memory link,
            string memory plot,
            uint prev,
            uint[] memory next,
            bool canon,
            address creator
        ) = universe.getNode(id);
        console.log(plot);
        assertNotEq(plot, "");
    }

    function test_getTimeline() public {}

    function test_setMedia() public {}

    function test_setCanon() public {}

    function createNode() internal returns (uint) {
        uint id = universe.createNode("testlink.org", "test plot", 0);
        return id;
    }
}
