// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {PoolId} from "@uniswap/v4-core/src/types/PoolId.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../libraries/NodeOptions.sol";
import {IUniverse} from "./IUniverse.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {IGovernor} from "@openzeppelin/governance/IGovernor.sol";
import {IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {ILoarLpLocker} from "./ILoarLpLocker.sol";

interface IUniverseManager {
    struct UniverseConfig {
        NodeCreationOptions nodeCreationOption;
        NodeVisibilityOptions nodeVisibilityOption;
        address universeAdmin;
        string name;
        string imageURL;
        string description;
        address universeManager;
    }
    struct TokenConfig {
        address tokenAdmin;
        string name;
        string symbol;
        string imageURL;
        string metadata;
        string context;
    }

    struct PoolConfig {
        address hook;
        address pairedToken;
        int24 tickIfToken0IsLoar;
        int24 tickSpacing;
        bytes poolData;
    }

    struct DeploymentConfig {
        TokenConfig tokenConfig;
        PoolConfig poolConfig;
        LockerConfig lockerConfig;
    }

    struct LockerConfig {
        address locker;
        // reward info
        address[] rewardAdmins;
        address[] rewardRecipients;
        uint16[] rewardBps;
        // liquidity placement info
        int24[] tickLower;
        int24[] tickUpper;
        uint16[] positionBps;
        bytes lockerData;
    }

    event UniverseCreated(
        address creator,
        address universe,
        address token,
        address governance
    );
    event TokenDeployed();
    event TokenGraduation();
    event SetTeamFeeRecipient(
        address oldTeamFeeRecipient,
        address newTeamFeeRecipient
    );
    event ClaimTeamFees(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );
    event TokenCreated(
        address msgSender,
        address indexed tokenAddress,
        address indexed tokenAdmin,
        string tokenImage,
        string tokenName,
        string tokenSymbol,
        string tokenMetadata,
        string tokenContext,
        int24 startingTick,
        address poolHook,
        PoolId poolId,
        address pairedToken,
        address locker
    );
    event SetLocker(address locker, address hook, bool enabled);
    event SetDeprecated(bool deprecated);
    event SetHook(address hook, bool enabled);
    error Deprecated();
    error TeamFeeRecipientNotSet();
    error DeployerIsNotOwner();
    error HookNotEnabled();
    error InvalidHook();
    error InvalidLocker();
    error LockerNotEnabled();

    function createUniverse(
        string memory name,
        string memory imageURL,
        string memory description,
        NodeCreationOptions nodeCreationOptions,
        NodeVisibilityOptions nodeVisibilityOptions,
        address initialOwner
    ) external returns (uint _id, address);

    function deployUniverseToken(
        DeploymentConfig memory deploymentConfig,
        uint id
    ) external payable returns (address tokenAddress);

    function enabledHooks(address hook) external view returns (bool);

    function enabledLockers(address locker, address hook) external view returns (bool);

    function getUniverseData(uint id) external view returns (
        IUniverse universe,
        IERC20 token,
        IGovernor universeGovernor,
        IHooks hook,
        ILoarLpLocker locker
    );
}
