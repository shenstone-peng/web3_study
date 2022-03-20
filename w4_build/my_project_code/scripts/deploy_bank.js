const hre = require("hardhat");
const { artifacts,network } = require('hardhat');
const { writeAbiAddr } = require('./artifact_saver.js')
const ERC20Addr = require(`../deployments/dev/dev-shenstone.json`)
async function main() {
  // await hre.run('compile');

  const MyVaultC = await hre.ethers.getContractFactory("vault");
  const MyVault = await MyVaultC.deploy(ERC20Addr.address);

  await MyVault.deployed();

  console.log("vault deployed to:%s on %s", MyVault.address,network.name);
  let artifactScore = await artifacts.readArtifact("vault");
  await writeAbiAddr(artifactScore, MyVault.address, "vault", network.name);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });