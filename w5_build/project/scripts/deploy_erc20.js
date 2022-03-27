const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  // await hre.run('compile');
  let contractName = "MyTokenB"
  const MyERC20 = await hre.ethers.getContractFactory(contractName);
  const token = await MyERC20.deploy();

  await token.deployed();

  console.log("%s deployed to:", contractName,token.address,network.name);
  await writeAddr(token.address, contractName, network.name)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });