const {network, ethers} = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require("./artifact_log.js");
const contract_name = "treasuryGov";
async function main(){
    const [deployer, user, third] = await ethers.getSigners();

    const MyContractFactory = await hre.ethers.getContractFactory(contract_name);
    //constructor(address[] memory _owners, uint _numConfirmationsRequired)
    //let owners = ethers.utils.solidityPack([ 'address', 'address' ], [deployer.address, user.address]);
    let owners = [deployer.address, user.address, third.address];
    const m_contract = await MyContractFactory.deploy(owners, 2);
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