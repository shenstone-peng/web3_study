const {network, ethers} = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require("./artifact_log.js");


const treasury_ContractName = "treasury";
const treasuryGov_ContractName = "treasuryGov";

const m_treasury =  require(`../deployments/${network.name}/${treasury_ContractName}.json`);
const m_treasuryGov = require(`../deployments/${network.name}/${treasuryGov_ContractName}.json`);

async function main(){
    const [deployer, user] = await ethers.getSigners();

    
    //constructor(address _gov) payable {
    //let owners = [deployer.address, user.address];
    let overrides = {
        gasPrice: ethers.utils.parseUnits('30.0', 'gwei'),
        value: ethers.utils.parseEther('0.8'),
        //chainId: 31337    
    };


    let m_user = await ethers.getContractAt(treasuryGov_ContractName,
        m_treasuryGov.address,
        user);


    let value = await m_user.isOwner(deployer.address);
    console.log("Is deployer owner:",value);

    value = await m_user.isOwner(user.address);
    console.log("Is user owner:",value);


    /*function submitTransaction(
        address _treasury,
        address _to,
        uint _value,
        string memory _data
    )*/
    let text = "Hello World";
    let reciever = "0xD708c8f3b86a8c264678898658D99e85bF304832";
    //let bytes = utils.toUtf8Bytes(text);
    await m_user.submitTransaction(
        m_treasury.address,
        reciever,
        ethers.utils.parseEther('0.8'),
        text);

    //console.log("value", m_user.balance);


}





main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 