// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {Universe} from "./Universe.sol";
import {IUniverse} from "./interfaces/IUniverse.sol";
import {IUniverseManager} from "./interfaces/IUniverseManager.sol";
import {ReentrancyGuard} from "solady/src/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";
import {IOwnable} from "./interfaces/IOwnable.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {ILoarHook} from "./interfaces/ILoarHook.sol";
import {IGovernor} from "@openzeppelin/governance/IGovernor.sol";
import {ILoarLpLocker} from "./interfaces/ILoarLpLocker.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import "./libraries/NodeOptions.sol";
import "./types/UniverseData.sol";

interface IUniverseTokenDeployer {
    function deployTokenAndGovernance(
        IUniverseManager.DeploymentConfig memory deploymentConfig,
        uint256 universeId
    ) external returns (
        address tokenAddress,
        address governor
    );
}

contract UniverseManager is IUniverseManager, ReentrancyGuard, Ownable {
    uint public teamFee;
    address public teamFeeRecipient;
    address public tokenDeployer;
    uint256 public constant TOKEN_SUPPLY = 100_000_000_000e18; // 100b with 18 decimals
    uint256 public constant BPS = 10_000;
    mapping(uint id => UniverseData) universeDatas;
    mapping(address hook => bool enabled) public enabledHooks;
    mapping(address locker => mapping(address hook => bool enabled)) public enabledLockers;
    uint latestId;
    bool public deprecated;

    event SetTokenDeployer(address oldTokenDeployer, address newTokenDeployer);

    constructor(address _teamFeeRecipient) Ownable(msg.sender) {
        teamFeeRecipient = _teamFeeRecipient;
    }

    function setTokenDeployer(address _tokenDeployer) external onlyOwner {
        address oldTokenDeployer = tokenDeployer;
        tokenDeployer = _tokenDeployer;
        emit SetTokenDeployer(oldTokenDeployer, _tokenDeployer);
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
        //add universe created event
        emit UniverseCreated(address(universe),msg.sender);
        uint current_id = latestId;
        latestId++;
        return (current_id, address(universe));
    }

    function deployUniverseToken(
        DeploymentConfig memory deploymentConfig,
        uint id
    ) public payable nonReentrant returns (address tokenAddress) {
        IUniverse universe = universeDatas[id].universe;
        require(IOwnable(address(universe)).owner() == msg.sender, "Not universe owner");

        if (!enabledHooks[deploymentConfig.poolConfig.hook]) {
            revert HookNotEnabled();
        }

        if (!enabledLockers[deploymentConfig.lockerConfig.locker][deploymentConfig.poolConfig.hook]) {
            revert LockerNotEnabled();
        }

        (address _tokenAddress, address governor) =
            IUniverseTokenDeployer(tokenDeployer).deployTokenAndGovernance(
                deploymentConfig,
                id
            );

        tokenAddress = _tokenAddress;

        PoolKey memory poolkey = ILoarHook(deploymentConfig.poolConfig.hook).initializePool(
            tokenAddress,
            deploymentConfig.poolConfig.pairedToken,
            deploymentConfig.poolConfig.tickIfToken0IsLoar,
            deploymentConfig.poolConfig.tickSpacing,
            deploymentConfig.lockerConfig.locker,
            deploymentConfig.poolConfig.poolData
        );

        uint256 poolSupply = TOKEN_SUPPLY;
        IERC20(tokenAddress).approve(address(deploymentConfig.lockerConfig.locker), poolSupply);
        ILoarLpLocker(deploymentConfig.lockerConfig.locker).placeLiquidity(
            deploymentConfig.lockerConfig,
            deploymentConfig.poolConfig,
            poolkey,
            poolSupply,
            tokenAddress
        );

        universeDatas[id].token = IERC20(tokenAddress);
        universeDatas[id].universeGovernor = IGovernor(governor);
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

    function getUniverseData(uint id) public view returns (
        IUniverse universe,
        IERC20 token,
        IGovernor universeGovernor,
        IHooks hook,
        ILoarLpLocker locker
    ) {
        UniverseData memory data = universeDatas[id];
        return (data.universe, data.token, data.universeGovernor, data.hook, data.locker);
    }
}
