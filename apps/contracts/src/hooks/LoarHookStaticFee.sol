// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {LoarHook} from "./LoarHook.sol";
import {ILoarHookStaticFee} from "../interfaces/ILoarHookStaticFee.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";

import {ModifyLiquidityParams, SwapParams} from "@uniswap/v4-core/src/types/PoolOperation.sol";
import {PoolId} from "@uniswap/v4-core/src/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

contract LoarHookStaticFee is LoarHook, ILoarHookStaticFee {
    mapping(PoolId => uint24) public loarFee;
    mapping(PoolId => uint24) public pairedFee;

    constructor(
        address _poolManager,
        address _factory,
        address _weth
    ) LoarHook(_poolManager, _factory, _weth) {}

    function _initializePoolData(
        PoolKey memory poolKey,
        bytes memory poolData
    ) internal override {
        PoolStaticConfigVars memory _poolConfigVars = abi.decode(
            poolData,
            (PoolStaticConfigVars)
        );

        if (_poolConfigVars.loarFee > MAX_LP_FEE) {
            revert LoarFeeTooHigh();
        }

        if (_poolConfigVars.pairedFee > MAX_LP_FEE) {
            revert PairedFeeTooHigh();
        }

        loarFee[poolKey.toId()] = _poolConfigVars.loarFee;
        pairedFee[poolKey.toId()] = _poolConfigVars.pairedFee;

        emit PoolInitialized(
            poolKey.toId(),
            _poolConfigVars.loarFee,
            _poolConfigVars.pairedFee
        );
    }

    // set the LP fee according to the loar/paired fee configuration
    function _setFee(
        PoolKey calldata poolKey,
        SwapParams calldata swapParams
    ) internal override {
        uint24 fee = swapParams.zeroForOne != loarIsToken0[poolKey.toId()]
            ? pairedFee[poolKey.toId()]
            : loarFee[poolKey.toId()];

        _setProtocolFee(fee);
        IPoolManager(poolManager).updateDynamicLPFee(poolKey, fee);
    }
}
