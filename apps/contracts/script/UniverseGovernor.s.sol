// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {UniverseGovernor} from "../src/UniverseGovernor.sol";
import {ERC20} from "@openzeppelin/token/ERC20/ERC20.sol";

contract UniverseGovernorScript is Script {
    UniverseGovernor public governor;
    ERC20 public token;

    function setUp() public {}

    function getChainId() public view returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        console.log("Deployer address: ", deployerAddress);
        console.log("Deployer balance: ", deployerAddress.balance);
        console.log("BlockNumber: ", block.number);
        console.log("ChainId: ", getChainId());
        console.log("Deploying");
        vm.startBroadcast(deployerPrivateKey);
        token = new ERC20("NewToken","TKN");

        governor = new UniverseGovernor(token);
        console.log(address(governor));

        vm.stopBroadcast();
    }
}
