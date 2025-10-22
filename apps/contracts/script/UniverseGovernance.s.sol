// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Timeline} from "../src/Timeline.sol";
import {UniverseGovernor} from "../src/UniverseGovernor.sol";
import {ERC20} from "@openzeppelin/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/utils/Nonces.sol";
import {GovernanceERC20} from "../src/GovernanceERC20.sol";

contract TimelineGovernanceScript is Script {
    Timeline public timeline;
    UniverseGovernor public governor;
    GovernanceERC20 public token;

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

        token = new GovernanceERC20("MyToken","MTKN");
        governor = new UniverseGovernor(token);
        timeline = new Timeline(address(governor));//In backend this will be deployed w governance

        console.log("Governor deployed at:", address(governor));
        console.log("Token deployed at:", address(token));
        console.log("Timeline deployed at:", address(timeline));

        vm.stopBroadcast();
    }
}
