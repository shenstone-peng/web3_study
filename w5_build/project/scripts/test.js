const hre = require("hardhat");
//import { BigNumber, bigNumberify, defaultAbiCoder, formatEther } from 'ethers/utils';
async function main() {
    let [owner] = await ethers.getSigners();
    console.log(owner.address);
    let balance = 20;
    console.log(ethers.utils.defaultAbiCoder.encode(['uint256'], [balance]));
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });