// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {GovernanceERC20} from "./GovernanceERC20.sol";
import {UniverseGovernor} from "./UniverseGovernor.sol";
import {Universe} from "./Universe.sol";
import {IUniverse} from "./interfaces/IUniverse.sol";
import {IUniverseManager} from "./interfaces/IUniverseManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

contract UniverseManager is IUniverseManager{
  Universe[] public universes;
  uint public teamFee;
  address teamFeeRecipient;

  mapping(PoolId id => Pool.State) internal _pools;

  function createUniverse(string memory name, string memory imageURL, string memory description ) public {


  }
  function createUniverseToken() public {

  }

  function deployUniverseToken() public{

  }

  function setTeamFeeRecipient() public {

  }
  function claimTeamFee() public {

  }
  function _initializePool() internal {

  }
  function _initializeLiquidity() internal {

  }

}
