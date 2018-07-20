This project is a bet generator with all the logic being stored into smart contracts written in Solidity programming language and running on the Ethereum testnet (Rinkeby network). Role of the master contract is to keep track of all bets that that will be created by the application users. Each bet takes the form of a new contract sent and executed on the blockchain. Players are free to participate in betting by giving their prognostics. The amount to be paid for participating to a bet is 0.01 ether. Only the creator of the contract (bet) can close a bet and ask the contract to reward the winner(s).

## Betgame contracts

- The contracts contained in the [Betgame.sol](https://github.com/DGalinec/betgame/blob/master/ethereum/contracts/Betgame.sol) file are written in the Solidity programming language. 

- The contracts have been pre-compiled and pre-tested on the [Remix](http://remix.ethereum.org/#optimize=false&version=soljson-v0.4.24+commit.e67f0147.js) Solidity IDE.

- The contracts have been compiled using the [solc](https://github.com/ethereum/solc-js) Solidity compiler. The script is named [compile.js](https://github.com/DGalinec/betgame/blob/master/ethereum/compile.js). It generates in the [build](https://github.com/DGalinec/betgame/tree/master/ethereum/build) directory two separate JSON files containing the Application Binary Interface of each contract.

- The [Mocha](https://mochajs.org/) JavaScript test framework paired with the [Ganache](https://github.com/trufflesuite/ganache) personnal blockchain for Ethereum development were used to test the behaviour of the different contract functions on the blockchain. The JavaScript file containing the different tests is named [Betgame.test.js](https://github.com/DGalinec/betgame/blob/master/test/Betgame.test.js).

- An instance of the Master contract or contract generator has been deployed on the [Rinkeby](https://www.rinkeby.io/#stats) network (Ethereum testnet) at address [0x20C1cC8064838291c4D936b17Ac7937F515A9EFE](https://rinkeby.etherscan.io/address/0x20C1cC8064838291c4D936b17Ac7937F515A9EFE) using [truffle hdwallet provider](https://github.com/trufflesuite/truffle-hdwallet-provider).

## User interface

- This project is was bootstrapped with [Next.JS](https://github.com/zeit/next.js/), a framework for server-rendered React applications.

- JavaScript source code of the user interface with calls to the Ethreum blockchain is splitted in a number of functionnal  and class-based components. The main **BetgameIndex** component is stored in the [index.js](https://github.com/DGalinec/betgame/blob/master/pages/index.js) file.

```
pages/
  betgames/
    bets/
      index.js   _display details of a bet (sub-contract) with player list and prognostics_
    finish.js    _finalize a bet (sub-contract)_
    new.js       _create a new bet (sub-contract)_
    show.js      _show details of a bet (sub-contract)_
  index.js       _start page of the application displaying the list of all exisitng bets (sub-contracts)_

components/
  BetForm.js     _player makes a prognostic on a bet_
  Header.js      _page header_
  Layout.js      _page layout_
  RequestRow.js  _render a player prognostic table row_
```

- Connection between the user interface and the Master contract running on the Ethereum blockchain is made via [factory.js](https://github.com/DGalinec/betgame/blob/master/ethereum/factory.js) file. It reads the JSON Application Binary Interface (ABI) from the **build** directory and contains the contract address on the Rinkeby network.

- Connection between the user interface and the sub-contracts created by users and running on the Ethereum blockchain is made via [betgame.js](https://github.com/DGalinec/betgame/blob/master/ethereum/betgame.js) file. It reads the JSON Application Binary Interface (ABI) from the **build** directory and receives the sub-contract address on the Rinkeby network from the Master contract.

- Contract requires [MetaMask](https://metamask.io/) plugin to be installed in your Chrome or FireFox browser and be settled on the Rinkeby network in order to pay for transactions.

- To run the user interface type `$ npm run dev`. Application will start on `localhost: 3000` in your browser. 

## Folder structure

After creation, your project should look like this:

```
betgame/
  components/
    BetForm.js
    Header.js
    Layout.js
    RequestRow.js
  ethereum/
    betgame.js
    build/
      Betgame.json
      BetgameFactory.json
    compile.js
    contracts/
      Betgame.sol
    deploy.js
    factory.js
    web3.js
  node_modules/
  package.json
  pages/
    betgames/
      bets/
        index.js
      finish.js
      new.js
      show.js
    index.js
  README.md
  routes.js
  server.js
  test/
    Betgame.test.js
```