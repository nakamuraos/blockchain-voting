require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('hardhat-contract-sizer');
require("dotenv").config();


const ACCOUNT = process.env.ACCOUNT
const API_KEY = process.env.API_KEY_ETH;

module.exports = {
  defaultNetwork: "localhost",
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: false,
  },

  networks: {
    hardhat: {
      gas: 'auto',
      allowUnlimitedContractSize: true,
    },
    // testnet
    baobab: {
      url: `https://klaytn-baobab.blockpi.network/v1/rpc/public`,
      accounts: [ACCOUNT],
      timeout: 20000,
    },
     // testnet
    goerli: {
      url: `https://ethereum-goerli.publicnode.com`,
      accounts: [ACCOUNT],
      timeout: 20000,
    },
    //mainnet
    klay: {
      url: `https://1rpc.io/klay`,
      accounts: [ACCOUNT],
      timeout: 20000,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: API_KEY,
  }
};

