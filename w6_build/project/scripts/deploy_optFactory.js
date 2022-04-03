const {network, ethers} = require("hardhat");
const { writeAddr } = require("./artifact_log.js");
const hre = require("hardhat");
const contract_name = "UnioptV1Factory";
async function main(){
    const [deployer, user] = await ethers.getSigners();

    const MyContractFactory = await hre.ethers.getContractFactory(contract_name);
    const m_contract = await MyContractFactory.deploy(deployer.address);
    console.log("contract is deploying...");
    await m_contract.deployed();
    console.log("%s is deployed to [%s] on network [%s]", contract_name, m_contract.address, network.name);

    await writeAddr(m_contract.address, contract_name, network.name);

}





main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });