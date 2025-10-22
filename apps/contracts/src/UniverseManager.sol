// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {GovernanceERC20} from "./GovernanceERC20.sol";
import {UniverseGovernor} from "./UniverseGovernor.sol";
import {Universe} from "./Universe.sol";
import {IUniverse} from "./interfaces/IUniverse.sol";
import {IUniverseManager} from "./interfaces/IUniverseManager.sol";
import {PoolKey} from "../dependencies/uniswap-v4-core-4/src/types/PoolKey.sol"; //WIP: figure out why uniswap import is bugging out
import {EnumerableSetLib} from "solady/src/utils/EnumerableSetLib.sol";
import {LoarDeployer} from "./utils/LoarDeployer.sol";
import {ReentrancyGuard} from "solady/src/utils/ReentrancyGuard.sol";

contract UniverseManager is IUniverseManager, ReentrancyGuard {
    uint public teamFee;
    address teamFeeRecipient;
    uint256 public constant TOKEN_SUPPLY = 100_000_000_000e18; // 100b with 18 decimals
    uint256 public constant BPS = 10_000;

    //mapping(PoolId id => Pool.State) internal _pools;
    mapping(uint id => Universe) universes;

    function createUniverse(
        string memory name,
        string memory imageURL,
        string memory description,
        NodeCreationOptions nodeCreationOptions,
        NodeVisibilityOptions nodeVisibilityOptions
    ) public {}

    function createUniverseToken() public {}

    function deployUniverseToken(
        DeploymentConfig memory deploymentConfig
    ) public payable nonReentrant returns (address tokenAddress) {
        tokenAddress = LoarDeployer.deployToken(
            deploymentConfig.tokenConfig,
            TOKEN_SUPPLY
        );
        //deployGovernance as well
    }

    function setTeamFeeRecipient() public {}

    function claimTeamFee() public {}

    function _initializePool() internal {}

    function _initializeLiquidity() internal {}
}
