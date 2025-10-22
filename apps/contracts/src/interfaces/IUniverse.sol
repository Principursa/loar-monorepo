// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

interface IUniverse {


  error NodeDoesNotExist();

  event NodeCanonized(uint id,address canonizer);
  event NodeCreated(uint id, uint previous, address creator);

}
