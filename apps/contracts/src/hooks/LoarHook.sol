// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

//import {ILoarLpLocker} from "../interfaces/ILoarLpLocker.sol";
//import {ILoarMevModule} from "../interfaces/ILoarMevModule.sol";
import {ILoarHook} from "../interfaces/ILoarHook.sol";
import {GovernanceERC20} from "../GovernanceERC20.sol";
import {IUniverseManager} from "../interfaces/IUniverseManager.sol";
import {IPermit2} from "permit2/src/interfaces/IPermit2.sol";
import {Hooks, IHooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {IPositionManager} from "@uniswap/v4-periphery/src/interfaces/IPositionManager.sol";
import {ILoarLpLocker} from "../interfaces/ILoarLpLocker.sol";

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/access/Ownable.sol";

import {IUnlockCallback} from "@uniswap/v4-core/src/interfaces/callback/IUnlockCallback.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/src/libraries/LPFeeLibrary.sol";
import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";
import {BalanceDeltaLibrary} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Actions} from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import {LiquidityAmounts} from "@uniswap/v4-periphery/src/libraries/LiquidityAmounts.sol";
import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {ModifyLiquidityParams, SwapParams} from "@uniswap/v4-core/src/types/PoolOperation.sol";

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
    mapping(PoolId => uint256) public poolCreationTimestamp;

    modifier onlyFactory() {
        if (msg.sender != factory) {
            revert OnlyFactory();
        }
        _;
    }

    constructor(
        address _poolManager,
        address _factory,
        address _weth
    ) BaseHook(IPoolManager(_poolManager)) Ownable(msg.sender) {
        factory = _factory;
        weth = _weth;
    }

    function _setFee(
        PoolKey calldata poolKey,
        SwapParams calldata swapParams
    ) internal virtual {
        return;
    }

    // function to set the protocol fee to 20% of the lp fee
    function _setProtocolFee(uint24 lpFee) internal {
        protocolFee = uint24(
            (uint256(lpFee) * PROTOCOL_FEE_NUMERATOR) / uint128(FEE_DENOMINATOR)
        );
    }

    // function for inheriting hooks to set process data in during initialization flow
    function _initializePoolData(
        PoolKey memory poolKey,
        bytes memory poolData
    ) internal virtual {
        return;
    }

    function initializePool(
        address loar,
        address pairedToken,
        int24 tickIfToken0IsLoar,
        int24 tickSpacing,
        address _locker,
        bytes calldata poolData
    ) public onlyFactory returns (PoolKey memory) {
        // initialize the pool
        PoolKey memory poolKey = _initializePool(
            loar,
            pairedToken,
            tickIfToken0IsLoar,
            tickSpacing,
            poolData
        );

        locker[poolKey.toId()] = _locker;


        emit PoolCreatedFactory({
            pairedToken: pairedToken,
            loar: loar,
            poolId: poolKey.toId(),
            tickIfToken0IsLoar: tickIfToken0IsLoar,
            tickSpacing: tickSpacing,
            locker: _locker
        });

        return poolKey;
    }

    // common actions for initializing a pool
    function _initializePool(
        address loar,
        address pairedToken,
        int24 tickIfToken0IsLoar,
        int24 tickSpacing,
        bytes calldata poolData
    ) internal virtual returns (PoolKey memory) {
        // ensure that the pool is not an ETH pool
        if (pairedToken == address(0) || loar == address(0)) {
            revert ETHPoolNotAllowed();
        }

        // determine if Loar is token0
        bool token0IsLoar = loar < pairedToken;

        // create the pool key
        PoolKey memory _poolKey = PoolKey({
            currency0: Currency.wrap(token0IsLoar ? loar : pairedToken),
            currency1: Currency.wrap(token0IsLoar ? pairedToken : loar),
            fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,
            tickSpacing: tickSpacing,
            hooks: IHooks(address(this))
        });

        // Set the storage helpers
        loarIsToken0[_poolKey.toId()] = token0IsLoar;

        // initialize the pool
        int24 startingTick = token0IsLoar
            ? tickIfToken0IsLoar
            : -tickIfToken0IsLoar;
        uint160 initialPrice = startingTick.getSqrtPriceAtTick();
        poolManager.initialize(_poolKey, initialPrice);

        // set the pool creation timestamp
        poolCreationTimestamp[_poolKey.toId()] = block.timestamp;

        // initialize other pool data
        _initializePoolData(_poolKey, poolData);

        return _poolKey;
    }

    function _beforeSwap(
        address,
        PoolKey calldata poolKey,
        SwapParams calldata swapParams
    )
        internal
        virtual
        returns (bytes4, BeforeSwapDelta delta, uint24)
    {
        // set the fee for this swap
        _setFee(poolKey, swapParams);

        // trigger hook fee claim
        _hookFeeClaim(poolKey);

        _lpLockerFeeClaim(poolKey);

        // variables to determine how to collect protocol fee
        bool token0IsLoar = loarIsToken0[poolKey.toId()];
        bool swappingForLoar = swapParams.zeroForOne != token0IsLoar;
        bool isExactInput = swapParams.amountSpecified < 0;

        // case: specified amount paired in, unspecified amount loar out
        // want to: keep amountIn the same, take fee on amountIn
        // how: we modulate the specified amount being swapped DOWN, and
        // transfer the difference into the hook's account before making the swap
        if (isExactInput && swappingForLoar) {
            // since we're taking the protocol fee before the LP swap, we want to
            // take a slightly smaller amount to keep the taken LP/protocol fee at the 20% ratio,
            // this also helps us match the ExactOutput swappingForLoar scenario
            uint128 scaledProtocolFee = (uint128(protocolFee) * 1e18) /
                (1_000_000 + protocolFee);
            int128 fee = int128(
                (swapParams.amountSpecified * -int128(scaledProtocolFee)) / 1e18
            );

            delta = toBeforeSwapDelta(fee, 0);
            poolManager.mint(
                address(this),
                token0IsLoar
                    ? poolKey.currency1.toId()
                    : poolKey.currency0.toId(),
                uint256(int256(fee))
            );
        }

        // case: specified amount paired out, unspecified amount loar in
        // want to: increase amountOut by fee and take it
        // how: we modulate the specified amount out UP, and transfer it
        // into the hook's account
        if (!isExactInput && !swappingForLoar) {
            // we increase the protocol fee here because we want to better match
            // the ExactOutput !swappingForLoar scenario
            uint128 scaledProtocolFee = (uint128(protocolFee) * 1e18) /
                (1_000_000 - protocolFee);
            int128 fee = int128(
                (swapParams.amountSpecified * int128(scaledProtocolFee)) / 1e18
            );
            delta = toBeforeSwapDelta(fee, 0);

            poolManager.mint(
                address(this),
                token0IsLoar
                    ? poolKey.currency1.toId()
                    : poolKey.currency0.toId(),
                uint256(int256(fee))
            );
        }

        return (BaseHook.beforeSwap.selector, delta, 0);
    }

    function _afterSwap(
        address,
        PoolKey calldata poolKey,
        SwapParams calldata swapParams,
        BalanceDelta delta
    ) internal returns (bytes4, int128 unspecifiedDelta) {
        // variables to determine how to collect protocol fee
        bool token0IsLoar = loarIsToken0[poolKey.toId()];
        bool swappingForLoar = swapParams.zeroForOne != token0IsLoar;
        bool isExactInput = swapParams.amountSpecified < 0;

        // case: specified amount loar in, unspecified amount paired out
        // want to: take fee on amount out
        // how: the change in unspecified delta is debited to the swaps account post swap,
        // in this case the amount out given to the swapper is decreased
        if (isExactInput && !swappingForLoar) {
            // grab non-loar amount out
            int128 amountOut = token0IsLoar ? delta.amount1() : delta.amount0();
            // take fee from it
            unspecifiedDelta =
                (amountOut * int24(protocolFee)) /
                FEE_DENOMINATOR;
            poolManager.mint(
                address(this),
                token0IsLoar
                    ? poolKey.currency1.toId()
                    : poolKey.currency0.toId(),
                uint256(int256(unspecifiedDelta))
            );
        }

        // case: specified amount loar out, unspecified amount paired in
        // want to: take fee on amount in
        // how: the change in unspecified delta is debited to the swapper's account post swap,
        // in this case the amount taken from the swapper's account is increased
        if (!isExactInput && swappingForLoar) {
            // grab non-loar amount in
            int128 amountIn = token0IsLoar ? delta.amount1() : delta.amount0();
            // take fee from amount int
            unspecifiedDelta =
                (amountIn * -int24(protocolFee)) /
                FEE_DENOMINATOR;
            poolManager.mint(
                address(this),
                token0IsLoar
                    ? poolKey.currency1.toId()
                    : poolKey.currency0.toId(),
                uint256(int256(unspecifiedDelta))
            );
        }

        return (BaseHook.afterSwap.selector, unspecifiedDelta);
    }

    function _beforeInitialize(
        address,
        PoolKey calldata,
        uint160
    ) internal virtual override returns (bytes4) {
        revert UnsupportedInitializePath();
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure returns (bool) {
        return interfaceId == type(ILoarHook).interfaceId;
    }

    function _beforeAddLiquidity(
        address,
        PoolKey calldata poolKey,
        ModifyLiquidityParams calldata,
        bytes calldata
    ) internal virtual override returns (bytes4) {
        return BaseHook.beforeAddLiquidity.selector;
    }

    function _lpLockerFeeClaim(PoolKey calldata poolKey) internal {
        // if this wasn't initialized to claim fees, skip the claim
        if (locker[poolKey.toId()] == address(0)) {
            return;
        }

        // Skip fee claims if pool is new (less than 1 hour old)
        // This prevents issues on first swaps when there are no fees to collect yet
        if (block.timestamp < poolCreationTimestamp[poolKey.toId()] + 1 hours) {
            return;
        }

        // determine the token
        address token = loarIsToken0[poolKey.toId()]
            ? Currency.unwrap(poolKey.currency0)
            : Currency.unwrap(poolKey.currency1);

        // trigger the fee claim with try-catch to prevent reverts from blocking swaps
        // This is needed on Sepolia where PositionManager reverts when collecting 0 fees
        try ILoarLpLocker(locker[poolKey.toId()]).collectRewardsWithoutUnlock(token) {
            // Success - fees collected
        } catch {
            // Failed to collect fees, but don't block the swap
            // This can happen if there are no fees to collect yet or during quote simulations
        }
    }


    function _hookFeeClaim(PoolKey calldata poolKey) internal {
        // determine the fee token
        Currency feeCurrency = loarIsToken0[poolKey.toId()]
            ? poolKey.currency1
            : poolKey.currency0;

        // get the fees stored from the previous swap in the pool manager
        uint256 fee = poolManager.balanceOf(address(this), feeCurrency.toId());

        if (fee == 0) {
            return;
        }

        // burn the fee
        poolManager.burn(address(this), feeCurrency.toId(), fee);

        // take the fee
        poolManager.take(feeCurrency, factory, fee);

        emit ClaimProtocolFees(Currency.unwrap(feeCurrency), fee);
    }

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: true,
                afterInitialize: false,
                beforeAddLiquidity: true,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: true,
                afterSwap: true,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: true,
                afterSwapReturnDelta: true,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }
}
