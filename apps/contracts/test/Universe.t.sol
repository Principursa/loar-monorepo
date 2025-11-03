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
}
