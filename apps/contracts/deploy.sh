forge script script/Timeline.s.sol --rpc-url  $RPC_11155111 --broadcast -vvvv --chain sepolia  --private-key $PRIVATE_KEY --etherscan-api-key $VERIFICATION_KEY_1  --verify


forge script script/TimelineGovernance.s.sol --rpc-url  $RPC_11155111 --broadcast -vvvv --chain sepolia  --private-key $PRIVATE_KEY --etherscan-api-key $VERIFICATION_KEY_1  --verify

forge script script/DeployProtocol.s.sol --rpc-url $RPC_11155111 --broadcast --chain sepolia --private-key $PRIVATE_KEY --etherscan-api-key $VERIFICATION_KEY_1 --verify -vvvv
forge script script/DeployProtocol.s.sol --rpc-url sepolia --broadcast --verify -vvvv
