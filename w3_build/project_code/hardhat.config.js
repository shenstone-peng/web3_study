require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
const chainIds = {
  arbitrumOne: 42161,
  avalanche: 43114,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  optimism: 10,
  polygon: 137,
  rinkeby: 4,
  ropsten: 3,
};
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
console.log(mnemonic);


task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

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
  solidity: "0.8.4",

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  networks: {
    dev: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/e00be31566f4406d9bbbd23b259e54d3`,
      accounts: {mnemonic},
      gas: 8000000,
      gasPrice:100000000000,
      chainId: chainIds.ropsten
    }
  }
};
