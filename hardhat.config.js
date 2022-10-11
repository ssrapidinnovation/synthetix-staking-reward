require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require('solidity-coverage');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  settings: {
    evmVersion: "constantinople",
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  // defaultNetwork: "ropsten",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gas: 2100000,
      gasPrice: 8000000000,
    },
    // ropsten: {
    //   url: process.env.DEPLOY_KEY_RINKEBY,
    //   chainId: 3,
    //   gasPrice: 2500000000,
    //   accounts: [process.env.DEPLOY_ACC_RINKEBY],
    // },
  },
  etherscan: {
    apiKey: {
      ropsten: process.env.DEPLOY_API_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
