// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

interface IUniverseManager {
  enum NodeCreationOptions {PUBLIC, PRIVATE, WHITELISTED}
  enum NodeVisibilityOptions {ALL, HOLDERS, PRIVATE, WHITELISTED}

  struct UniverseConfig {
    NodeCreationOptions nodeCreationOption;
    NodeVisibilityOptions nodeVisibilityOption;
  }
  struct TokenConfig {
    address tokenAdmin;
    string name;
    string symbol;

  }

  event UniverseCreated(address creator, address universe,address token, address governance);
  event TokenCreated();
  event TokenDeployed();
  event TokenGraduation();
  event SetTeamFeeRecipient();

  error Deprecated();


  function createUniverse(string memory name, string memory imageURL, string memory description) external;

  function createUniverseToken(string memory symbol, uint amount) external;
   
  function deployUniverseToken() external;

}
