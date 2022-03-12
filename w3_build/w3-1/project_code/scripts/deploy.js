const hre = require("hardhat");
const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
  // await hre.run('compile');

  const MyERC20 = await hre.ethers.getContractFactory("shenstone");
  const token = await MyERC20.deploy();

  await token.deployed();

  console.log("shenstone deployed to:", token.address,network.name);
  let artifactScore = await artifacts.readArtifact("shenstone");
  await writeAbiAddr(artifactScore, token.address, "mytoken", network.name);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });