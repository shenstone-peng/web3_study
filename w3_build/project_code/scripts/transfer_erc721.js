const { ethers, network } = require("hardhat");
// const delay = require('./delay');

const ERC721Addr = require(`../deployments/dev/dev-jiangwei.json`)


async function main() {

    let [owner, second] = await ethers.getSigners();

    let myerc721 = await ethers.getContractAt("jiangwei",
        ERC721Addr.address,
        owner);
    console.log("a: %s b:%s",owner.address, second.address);
    await myerc721.transferFrom(owner.address, second.address, 1);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


  // duration = 60;
  // await delay.advanceTime(ethers.provider, duration); 
  // await delay.advanceBlock(ethers.provider);