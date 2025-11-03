// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {GovernanceERC20} from "./GovernanceERC20.sol";
import {UniverseGovernor} from "./UniverseGovernor.sol";
import {Universe} from "./Universe.sol";
import {IUniverse} from "./interfaces/IUniverse.sol";
import {IUniverseManager} from "./interfaces/IUniverseManager.sol";
import {EnumerableSetLib} from "solady/src/utils/EnumerableSetLib.sol";
import {LoarDeployer} from "./utils/LoarDeployer.sol";
import {ReentrancyGuard} from "solady/src/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {ILoarHook} from "./interfaces/ILoarHook.sol";
import {UniverseGovernor} from "./UniverseGovernor.sol";
import {IGovernor} from "@openzeppelin/governance/IGovernor.sol";
import {IOwnable} from "./interfaces/IOwnable.sol";

import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary, toBeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {Hooks, IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {SafeCast} from "@uniswap/v4-core/src/libraries/SafeCast.sol";
import {StateLibrary} from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import {IVotes} from "@openzeppelin/governance/utils/IVotes.sol";
import "./libraries/NodeOptions.sol";
import "./types/UniverseData.sol";

contract UniverseManager is IUniverseManager, ReentrancyGuard, Ownable {
    uint public teamFee;
    address teamFeeRecipient;
    uint256 public constant TOKEN_SUPPLY = 100_000_000_000e18; // 100b with 18 decimals
    uint256 public constant BPS = 10_000;
    mapping(uint id => UniverseData) universeDatas;
    mapping(address hook => bool enabled) enabledHooks;
    uint latestId; //See if EnumerableSetLib fixes this
    bool public deprecated;

    constructor(address _teamFeeRecipient) Ownable(msg.sender) {
        teamFeeRecipient = _teamFeeRecipient;
    }

    function createUniverse(
        string memory name,
        string memory imageURL,
        string memory description,
        NodeCreationOptions nodeCreationOptions,
        NodeVisibilityOptions nodeVisibilityOptions,
        address initialOwner
    ) public nonReentrant returns (uint256 _id, address) {
        UniverseConfig memory config = UniverseConfig(
            nodeCreationOptions,
            nodeVisibilityOptions,
            initialOwner,
            name,
            imageURL,
            description,
            address(this)
        );
        Universe universe = new Universe(config);
        UniverseData memory data = UniverseData(
            IUniverse(universe),
            IERC20(address(0)),
            IGovernor(address(0)),
            IHooks(address(0))
        );
        universeDatas[latestId] = data;
        uint current_id = latestId;
        latestId++;
        return (current_id, address(universe));
    }

    function deployUniverseToken(
        DeploymentConfig memory deploymentConfig,
        uint id
    ) public payable nonReentrant returns (address tokenAddress) {
        IUniverse universe = universeDatas[id].universe;
        if (IOwnable(address(universe)).owner() != msg.sender) {
            revert DeployerIsNotOwner();
        }
        tokenAddress = LoarDeployer.deployToken(
            deploymentConfig.tokenConfig,
            TOKEN_SUPPLY
        );

        PoolKey memory poolkey = _initializePool(
            deploymentConfig.poolConfig,
            tokenAddress
        );
        universeDatas[id].token = IERC20(tokenAddress);
        universeDatas[id].universeGovernor = IGovernor(
            _deployGovernance(tokenAddress)
        );
        universeDatas[id].hook = poolkey.hooks;
        universe.setToken(tokenAddress);
        emit TokenCreated(
            msg.sender,
            tokenAddress,
            deploymentConfig.tokenConfig.tokenAdmin,
            deploymentConfig.tokenConfig.imageURL,
            deploymentConfig.tokenConfig.name,
            deploymentConfig.tokenConfig.symbol,
            deploymentConfig.tokenConfig.metadata,
            deploymentConfig.tokenConfig.context,
            deploymentConfig.poolConfig.tickIfToken0IsLoar,
            deploymentConfig.poolConfig.hook,
            poolkey.toId(),
            deploymentConfig.poolConfig.pairedToken
        );
    }

    function _deployGovernance(
        address tokenAddress
    ) internal returns (IGovernor) {
        UniverseGovernor governor = new UniverseGovernor(IVotes(tokenAddress));
        return IGovernor(governor);
    }

    function setTeamFeeRecipient(address _teamFeeRecipient) public onlyOwner {
        address oldTeamFeeRecipient = teamFeeRecipient;
        teamFeeRecipient = _teamFeeRecipient;
        emit SetTeamFeeRecipient(oldTeamFeeRecipient, teamFeeRecipient);
    }

    function claimTeamFee(address token) external onlyOwner {
        if (teamFeeRecipient == address(0)) revert TeamFeeRecipientNotSet();

        uint256 balance = IERC20(token).balanceOf(address(this));
        SafeERC20.safeTransfer(IERC20(token), teamFeeRecipient, balance);
        emit ClaimTeamFees(token, teamFeeRecipient, balance);
    }

    function _initializePool(
        PoolConfig memory poolConfig,
        address newToken
    ) internal returns (PoolKey memory poolKey) {
        if (!enabledHooks[poolConfig.hook]) {
            revert HookNotEnabled();
        }

        poolKey = ILoarHook(poolConfig.hook).initializePool(
            newToken,
            poolConfig.pairedToken,
            poolConfig.tickIfToken0IsLoar,
            poolConfig.tickSpacing,
            poolConfig.poolData
        );
    }

    //function _initializeLiquidity(
    //    IUniverseManager.PoolConfig memory poolConfig,
    //   PoolKey memory poolKey,
    //    uint256 poolSupply,
    //    address token
    //) internal {}

    function setDeprecated(bool deprecated_) external onlyOwner {
        deprecated = deprecated_;
        emit SetDeprecated(deprecated_);
    }

    function getUniverse(uint id) public returns (UniverseData memory system) {
        return universeDatas[id];
    }
}
