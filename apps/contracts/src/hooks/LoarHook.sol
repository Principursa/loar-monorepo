// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


//import {ILoarLpLocker} from "../interfaces/IClankerLpLocker.sol";
//import {ILoarMevModule} from "../interfaces/IClankerMevModule.sol";
import {GovernanceERC20} from "../GovernanceERC20.sol";
import {IUniverseManager} from "../interfaces/IUniverseManager.sol";
import {IPermit2} from "@uniswap/permit2/src/interfaces/IPermit2.sol";
import {Hooks, IHooks} from "@uniswap/v4-core/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {IPositionManager} from "@uniswap/v4-periphery/src/interfaces/IPositionManager.sol";

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";

import {IUnlockCallback} from "@uniswap/v4-core/interfaces/callback/IUnlockCallback.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/libraries/LPFeeLibrary.sol";
import {TickMath} from "@uniswap/v4-core/libraries/TickMath.sol";
import {BalanceDeltaLibrary} from "@uniswap/v4-core/types/BalanceDelta.sol";
import {BalanceDelta} from "@uniswap/v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "@uniswap/v4-core/types/BeforeSwapDelta.sol";
import {
    BeforeSwapDelta, BeforeSwapDeltaLibrary
} from "@uniswap/v4-core/types/BeforeSwapDelta.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/types/PoolId.sol";
import {Actions} from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import {LiquidityAmounts} from "@uniswap/v4-periphery/src/libraries/LiquidityAmounts.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {ILoarHook} from "../interfaces/ILoarHook.sol";

abstract contract LoarHook is BaseHook, Ownable, ILoarHook {
  using TickMath for int24;
  using BeforeSwapDeltaLibrary for BeforeSwapDelta;

  uint24 public constant MAX_LP_FEE = 300_000; // LP fee capped at 30%
  uint256 public constant PROTOCOL_FEE_NUMERATOR = 200_000; // 20% of the imposed LP fee
  int128 public constant FEE_DENOMINATOR = 1_000_000; // Uniswap 100% fee

  uint24 public protocolFee;

  address public immutable factory;
  address public immutable weth;

  mapping(PoolId => bool) internal loarIsToken0;
  mapping(PoolId => address) internal locker;

}

