// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {PoolId} from "@uniswap/v4-core/src/types/PoolId.sol";
import {NodeCreationOptions, NodeVisibilityOptions} from "../libraries/NodeOptions.sol";

interface IUniverseManager {
    struct UniverseConfig {
        NodeCreationOptions nodeCreationOption;
        NodeVisibilityOptions nodeVisibilityOption;
        address universeAdmin;
        string name;
        string ImageURL;
        string description;
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
        int24 tickIfToken0IsLoar; //Not sure why the protocol name is in here
        int24 tickSpacing;
        bytes poolData;
    }

    struct DeploymentConfig {
        TokenConfig tokenConfig;
        PoolConfig poolConfig;
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
    //event TokenCreated(
    //    address msgSender,
    //    address indexed tokenAddress,
    //    address indexed tokenAdmin,
    //    string tokenImage,
    //    string tokenName,
    //    string tokenSymbol,
    //    string tokenMetadata,
    //    string tokenContext,
    //    int24 startingTick,
    //    address poolHook,
    //    PoolId poolId,
    //    address pairedToken
    //);
    event TokenCreated();

    error Deprecated();
    error TeamFeeRecipientNotSet();
    error HookNotEnabled();

    function createUniverse(
        string memory name,
        string memory imageURL,
        string memory description,
        NodeCreationOptions nodeCreationOptions,
        NodeVisibilityOptions nodeVisibilityOptions,
        address initialOwner
    ) external returns (uint _id);

    function deployUniverseToken(
        DeploymentConfig memory deploymentConfig
    ) external payable returns (address tokenAddress);
}
