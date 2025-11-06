// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;
import {IUniverse} from "../interfaces/IUniverse.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import "@openzeppelin/governance/IGovernor.sol";
import {IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {ILoarLpLocker} from "../interfaces/ILoarLpLocker.sol";

struct UniverseData {
  IUniverse universe;
  IERC20 token;
  IGovernor universeGovernor;
  IHooks hook;
  ILoarLpLocker locker;

}
