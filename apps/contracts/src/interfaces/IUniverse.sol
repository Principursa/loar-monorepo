// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {NodeCreationOptions, NodeVisibilityOptions} from "../libraries/NodeOptions.sol";

interface IUniverse {
    error NodeDoesNotExist();
    error TokenDoesNotExist();
    error CanonNotSet();
    error CallerNotManager();
    error CallerNotAdmin(address caller);

    event NodeCanonized(uint id, address canonizer);
    event NodeCreated(uint id, uint previous, address creator);
    event NodeVisibilityOptionUpdated(NodeVisibilityOptions option);
    event NodeCreationOptionUpdated(NodeCreationOptions option);
    event MediaUpdated(address updater, string link);
    function setAdmin(address newAdmin) external;
    function setToken(address) external;
    function getAdmin() external returns (address);
    function getToken() external returns (address);
}
