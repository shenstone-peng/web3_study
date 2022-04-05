const { ethers, network } = require("hardhat");
// const delay = require('./delay');

const ERC20Addr = require(`../deployments/dev/shenstone.json`)


async function main() {

    let [owner] = await ethers.getSigners();
    //const shenstone = await ethers.getContractFactory("shenstone");
    let myerc20 = await ethers.getContractAt("shenstone",
        ERC20Addr.address,
        owner);

    await myerc20.mint(10000000);
    console.log("totalSupply:", myerc20.totalSupply());
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