// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Universe} from "./Universe.sol";
import {UniverseGovernor} from "./UniverseGovernor.sol";
import {IUniverse} from "./interfaces/IUniverse.sol";
import {IUniverseManager} from "./interfaces/IUniverseManager.sol";
import {LoarDeployer} from "./utils/LoarDeployer.sol";
import {ReentrancyGuard} from "solady/src/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {ILoarHook} from "./interfaces/ILoarHook.sol";
import {IGovernor} from "@openzeppelin/governance/IGovernor.sol";
import {IOwnable} from "./interfaces/IOwnable.sol";
import {ILoarLpLocker} from "./interfaces/ILoarLpLocker.sol";
import {IVotes} from "@openzeppelin/governance/utils/IVotes.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import "./libraries/NodeOptions.sol";
import "./types/UniverseData.sol";

contract UniverseManager is IUniverseManager, ReentrancyGuard, Ownable {
    uint public teamFee;
    address teamFeeRecipient;
    uint256 public constant TOKEN_SUPPLY = 100_000_000_000e18; // 100b with 18 decimals
    uint256 public constant BPS = 10_000;
    mapping(uint id => UniverseData) universeDatas;
    mapping(address hook => bool enabled) enabledHooks;
    mapping(address locker => mapping(address hook => bool enabled)) public enabledLockers;
    uint latestId;
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
            IHooks(address(0)),
            ILoarLpLocker(address(0))
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

        uint256 poolSupply = TOKEN_SUPPLY;

        PoolKey memory poolkey = _initializePool(
            deploymentConfig.poolConfig,
            deploymentConfig.lockerConfig.locker,
            tokenAddress
        );
        
        _initializeLiquidity(
            deploymentConfig.lockerConfig,
            deploymentConfig.poolConfig,
            poolkey,
            poolSupply,
            tokenAddress
        );

        universeDatas[id].token = IERC20(tokenAddress);
        universeDatas[id].universeGovernor = IGovernor(
            _deployGovernance(tokenAddress)
        );
        universeDatas[id].hook = poolkey.hooks;
        universeDatas[id].locker = ILoarLpLocker(deploymentConfig.lockerConfig.locker);
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
            deploymentConfig.poolConfig.pairedToken,
            deploymentConfig.lockerConfig.locker
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
        address locker,
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
            locker,
            poolConfig.poolData
        );
    }

    function _initializeLiquidity(
        LockerConfig memory lockerConfig,
        IUniverseManager.PoolConfig memory poolConfig,
        PoolKey memory poolKey,
        uint256 poolSupply,
        address token
    ) internal {
        // check that the locker is enabled
        if (!enabledLockers[lockerConfig.locker][poolConfig.hook]) {
            revert LockerNotEnabled();
        }

        // approve the liquidity locker to take the pool's token supply
        IERC20(token).approve(address(lockerConfig.locker), poolSupply);

        // have the locker mint liquidity
        ILoarLpLocker(lockerConfig.locker).placeLiquidity(
            lockerConfig, poolConfig, poolKey, poolSupply, token
        );

    }

    function setDeprecated(bool deprecated_) external onlyOwner {
        deprecated = deprecated_;
        emit SetDeprecated(deprecated_);
    }

    function setHook(address hook, bool enabled) external onlyOwner {
        // check that the hook supports the ILoarHook interface
        if (!ILoarHook(hook).supportsInterface(type(ILoarHook).interfaceId)) {
            revert InvalidHook();
        }

        enabledHooks[hook] = enabled;

        emit SetHook(hook, enabled);
    }

    function setLocker(address locker, address hook, bool enabled) external onlyOwner {
        // check that the locker supports the ILoarLpLocker interface
        if (!ILoarLpLocker(locker).supportsInterface(type(ILoarLpLocker).interfaceId)) {
            revert InvalidLocker();
        }

        enabledLockers[locker][hook] = enabled;

        emit SetLocker(locker, hook, enabled);
    }

    function getUniverseData(uint id) public view returns (UniverseData memory system) {
        return universeDatas[id];
    }
}
