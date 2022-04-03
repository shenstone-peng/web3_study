const { Contract } = require("ethers");
const { network, ethers } = require("hardhat");
const hre = require("hardhat");
const ContractName = "UnioptV1Factory";
const m_Uniopt = require(`../deployments/${network.name}/${ContractName}.json`);



async function main() {

    const [user] = await ethers.getSigners();
    console.log("user.address:",user.address);
    console.log(m_Uniopt.address);
    let FactoryV1 = m_Uniopt.address;
    let m_user = await ethers.getContractAt(ContractName,
        FactoryV1,
        user);
    //createETHOptions(uint _deadline, uint _price, address _owner)
    let _deadline = 1;
    let _price = 5200;
    let _owner = user.address;
    let ethAmount = ethers.utils.parseUnits("0.2", 18);
    const tx = await m_user.createETHOptions(
        _deadline,
        _price,
        _owner,{ value: ethAmount }
    ) 
    console.log("waiting for creat opt...")
    await tx.wait();
    console.log("create sucess!");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });