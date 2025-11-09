## Loar.Fun Protocol Contracts 
Built from Turborepo compatible template with personally preferred defaults for foundry

Loar.fun is a launchpad for AI generated cinematic universes.

## Contracts 
### UniverseManager
Manager entrypoint for protocol

Creating Universes
```solidity
function createUniverse(
    string memory name,
    string memory imageUrl,
    string memory description,
    NodeCreationOptions nodeCreationsOptions,
    NodeVisibilityOptions nodeVisibilityOptions,
    address initialOwner
) public returns (uint256 _id, address)
```
creates a Universe.sol contract

Deploying tokens
```solidity
function deployUniverseToken(DeploymentConfig memory deploymentConfig,uint id) returns (address tokenAddress)
```
calls UniverseTokenDeployer.sol and sets hook, fee and LP locker used

### Universe
At it's core the universe contract is a directed acyclic graph in which any user can contribute to a universe by calling createNode.
```solidity
    function createNode(
        string memory _link,
        string memory _plot,
        uint _previous
    ) public returns (uint) {
```
A given node is then given the status of 'canon', all previous nodes from that 'canon' node are thus considered 'canon'.
There are plans to have the creation and visibility options be subject to user discretion (WIP).
When it's deployed the contract is owned by a single user, who then has the choice whether to democratize his universe and launch a token.
At this point a UniverseGovernor is given ownership of the Universe contract and the deployed token represents votes for the governor.
### LoarHookStaticFee
At the moment there's only one hook which places a static fee on top of every trade through the protocol.
There are plans to research into more hooks which have rather interesting features like anti-MEV mechanics, BidWalls and so on.


## Scripts
DeployProtocol.s.sol deploys the entire protocol given a poolmanager address.  
DeployUniverse.s.sol deploys a universe given universeManager, name, description, hook and lp locker.  
DeployHook.s.sol deploys new hook.  
DeployHook.s.sol deploys new LPLocker.  
 
