// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

interface IUniverseManager {
  enum NodeCreationOptions {PUBLIC, WHITELISTED}
  enum NodeVisibilityOptions {PUBLIC, HOLDERS, WHITELISTED}

  struct UniverseConfig {
    NodeCreationOptions nodeCreationOption;
    NodeVisibilityOptions nodeVisibilityOption;
    address universeAdmin;
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
