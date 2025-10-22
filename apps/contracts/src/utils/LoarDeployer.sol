// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {GovernanceERC20} from "../GovernanceERC20.sol";
import {IUniverseManager} from "../interfaces/IUniverseManager.sol";

/// @notice Loar Token Launcher
library LoarDeployer {
    function deployToken(
        IUniverseManager.TokenConfig memory tokenConfig,
        uint256 supply
    ) external returns (address tokenAddress) {
        GovernanceERC20 token = new GovernanceERC20(
            tokenConfig.name,
            tokenConfig.symbol,
            supply,
            tokenConfig.tokenAdmin,
            tokenConfig.imageURL,
            tokenConfig.metadata,
            tokenConfig.context
        );
        tokenAddress = address(token);
    }
}
