// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {LoarDeployer} from "./utils/LoarDeployer.sol";
import {UniverseGovernor} from "./UniverseGovernor.sol";
import {IUniverse} from "./interfaces/IUniverse.sol";
import {IUniverseManager} from "./interfaces/IUniverseManager.sol";
import {ReentrancyGuard} from "solady/src/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {ILoarHook} from "./interfaces/ILoarHook.sol";
import {IGovernor} from "@openzeppelin/governance/IGovernor.sol";
import {IOwnable} from "./interfaces/IOwnable.sol";
import {ILoarLpLocker} from "./interfaces/ILoarLpLocker.sol";
import {IVotes} from "@openzeppelin/governance/utils/IVotes.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

interface IUniverseManagerCallback {
    function initializePoolForToken(
        address hook,
        address token,
        address pairedToken,
        int24 tickIfToken0IsLoar,
        int24 tickSpacing,
        address locker,
        bytes memory poolData
    ) external returns (PoolKey memory poolKey);
}

/**
 * @title UniverseTokenDeployer
 * @notice Handles the heavy lifting of deploying universe tokens, initializing pools, and locking liquidity
 * @dev This contract is separated from UniverseManager to keep both contracts under the 24KB size limit
 */
contract UniverseTokenDeployer is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IUniverseManager public immutable universeManager;
    uint256 public constant TOKEN_SUPPLY = 100_000_000_000e18; // 100b with 18 decimals

    error DeployerIsNotOwner();
    error HookNotEnabled();
    error LockerNotEnabled();

    event TokenDeployed(
        uint256 indexed universeId,
        address indexed tokenAddress,
        address indexed hook,
        address locker
    );

    constructor(address _universeManager) {
        universeManager = IUniverseManager(_universeManager);
    }

    /**
     * @notice Deploy a token and governance for a universe
     * @dev Pool initialization and liquidity locking must be done by UniverseManager (the factory)
     * @param deploymentConfig Configuration for token
     * @param universeId ID of the universe to deploy token for
     * @return tokenAddress Address of the deployed token
     * @return governor Address of the deployed governor
     */
    function deployTokenAndGovernance(
        IUniverseManager.DeploymentConfig memory deploymentConfig,
        uint256 universeId
    ) external nonReentrant returns (
        address tokenAddress,
        address governor
    ) {
        require(msg.sender == address(universeManager), "Only UniverseManager can call");

        tokenAddress = LoarDeployer.deployToken(
            deploymentConfig.tokenConfig,
            TOKEN_SUPPLY
        );

        IERC20(tokenAddress).transfer(address(universeManager), TOKEN_SUPPLY);

        governor = address(_deployGovernance(tokenAddress));

        emit TokenDeployed(universeId, tokenAddress, deploymentConfig.poolConfig.hook, deploymentConfig.lockerConfig.locker);

        return (tokenAddress, governor);
    }

    function _deployGovernance(
        address tokenAddress
    ) internal returns (IGovernor) {
        UniverseGovernor governor = new UniverseGovernor(IVotes(tokenAddress));
        return IGovernor(governor);
    }
}
