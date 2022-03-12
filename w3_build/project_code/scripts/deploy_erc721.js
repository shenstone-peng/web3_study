const hre = require("hardhat");
const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
async function main() {
  // await hre.run('compile');

  const MyERC721 = await hre.ethers.getContractFactory("jiangwei");
  const token = await MyERC721.deploy();

  await token.deployed();

  console.log("jiangwei deployed to:", token.address,network.name);
  let artifactScore = await artifacts.readArtifact("jiangwei");
  await writeAbiAddr(artifactScore, token.address, "jiangwei", network.name);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });