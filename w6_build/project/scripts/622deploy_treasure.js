const {network, ethers} = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require("./artifact_log.js");
const contract_name = "treasury";
const ContractName = "treasuryGov";
const m_treasuryGov = require(`../deployments/${network.name}/${ContractName}.json`);

async function main(){
    const [deployer, user] = await ethers.getSigners();

    const MyContractFactory = await hre.ethers.getContractFactory(contract_name);
    //constructor(address _gov) payable {
    //let owners = [deployer.address, user.address];
    let overrides = {

        // The maximum units of gas for the transaction to use
        //gasLimit: 23000,
    
        // The price (in wei) per unit of gas
        //gasPrice: ethers.utils.parseUnits('30.0', 'gwei'),
    
        // The nonce to use in the transaction
        //nonce: 123,
    
        // The amount to send with the transaction (i.e. msg.value)
        value: ethers.utils.parseEther('1.0'),
    
        // The chain ID (or network ID) to use
        //chainId: 31337
    
    };
    const m_contract = await MyContractFactory.deploy(m_treasuryGov.address, overrides);
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