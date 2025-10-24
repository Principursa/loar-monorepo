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
import {Ownable} from "@openzeppelin/access/Ownable.sol";

contract UniverseManager is IUniverseManager, ReentrancyGuard, Ownable {
    uint public teamFee;
    address teamFeeRecipient;
    uint256 public constant TOKEN_SUPPLY = 100_000_000_000e18; // 100b with 18 decimals
    uint256 public constant BPS = 10_000;
    struct UniverseSystem {
        address universe;
        address universeGovernor;
        address universeToken;
    }

    //mapping(PoolId id => Pool.State) internal _pools;
    mapping(uint id => UniverseSystem) universeSystems;
    uint latestId; //See if EnumerableSetLib fixes this

    function createUniverse(
        string memory name,
        string memory imageURL,
        string memory description,
        NodeCreationOptions nodeCreationOptions,
        NodeVisibilityOptions nodeVisibilityOptions,
        address initialOwner
    ) public nonReentrant {
        UniverseConfig memory config = UniverseConfig(
            nodeCreationOptions,
            nodeVisibilityOptions,
            initialOwner
        );
        Universe universe = new Universe(config);
        UniverseSystem memory system = UniverseSystem(
            address(universe),
            address(0),
            address(0)
        );
    }

    function createUniverseToken() public {}

    function deployUniverseToken(
        DeploymentConfig memory deploymentConfig
    ) public payable nonReentrant returns (address tokenAddress) {
        tokenAddress = LoarDeployer.deployToken(
            deploymentConfig.tokenConfig,
            TOKEN_SUPPLY
        );
        //insert into universesystem array

        PoolKey memory poolkey = _initializePool();
    }

    function deployGovernance() internal returns (address) {}

    function setTeamFeeRecipient() public onlyOwner {}

    function claimTeamFee() external onlyOwner {}

    function _initializePool(
        PoolConfig memory poolConfig,
        address newToken
    ) internal {}

    function _initializeLiquidity() internal {}

    function getUniverse() public {}
}
