// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Timeline} from "../src/Timeline.sol";

contract CounterTest is Test {
    Timeline public timeline;

    function setUp() public {
        timeline = new Timeline(msg.sender);
    }
}
