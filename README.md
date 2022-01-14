Dex Aggregator
A Dex Aggregator is a smart contract that talks to decentralized exchanges (DEX) and determine which exchange has the best rate for a given swap, then executes the swap. In this project, we are building a simple dex aggregator that talks to Uniswap and Sushiswap, and executes swaps between WETH and USDC. We are forking the mainnet with ganahce-cli to test and interface with our smart contract.

Tech:

Solidity
Javascript
Web3.js
Truffle 
Ganache-cli (For Local Blockchain)

node.js and truffle needs to be install

https://nodejs.dev/
https://trufflesuite.com/


Step:

1. In empty directory, clone this repository:

$ git clone https://github.com/nolanjannotta/dex-aggregator

2. Install Dependencies:
$ npm install 

Fork mainnet:
to find an address to unlock, look through etherscan to find an EOA(not a contract)
https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#balances

$ ganache-cli --fork API_KEY -u ULOCKED_ADDRESS

$ ganache-cli --fork https://eth-mainnet.alchemyapi.io/v2/KEY -u https://etherscan.io/address/0x6555e1cc97d3cba6eaddebbcd7ca51d75771e0b8
this address has plenty of WETH, feel free to use it


In a new terminal:

4. Migrate Smart Contracts
$ truffle migrate --reset

5. run the fundAccount script
$ truffle exec scripts/fundAccount.js


6. Frontend
In a new terminal:
$ cd frontend
$ yarn start

Video walk through:
https://www.youtube.com/watch?v=XnHKma0KI00

project diagram @ 2:36
