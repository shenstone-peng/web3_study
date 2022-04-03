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
        gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),
        value: ethers.utils.parseEther('80.0'),
        chainId: 31337    
    };


    let m_user = await ethers.getContractAt(treasuryGov_ContractName,
        m_treasuryGov.address,
        user);


    let m_deploy = await ethers.getContractAt(treasuryGov_ContractName,
        m_treasuryGov.address,
        deployer);


    let value = await m_user.isOwner(deployer.address);
    console.log("Is deployer owner:",value);

    value = await m_user.isOwner(user.address);
    console.log("Is user owner:",value);

/*
    struct WithdrawTX {
        address treasury;
        address to;
        uint value;
        string data;
        bool executed;
        uint numConfirmations;
    }
    WithdrawTX[] public transactions;
*/
    value = await m_user.transactions(0);
    console.log("numConfirmations:",value.numConfirmations.toNumber( ) );

    await m_user.confirmTransaction(0);
    value = await m_user.transactions(0);
    console.log("after user confirm ,numConfirmations:",value.numConfirmations.toNumber( ) );


    await m_deploy.confirmTransaction(0);
    value = await m_user.transactions(0);
    console.log("after deployer confirm , numConfirmations:",value.numConfirmations.toNumber( ) );

    //await m_user.executeTransaction(0);
    let address=m_treasury.address;
    let balance = await ethers.provider.getBalance(address);

        // 余额是 BigNumber (in wei); 格式化为 ether 字符串
    //let etherString = ethers.utils.formatEther(balance);
    
    console.log("Balance: " + balance);


    //await m_user_2.withdraw(user.address,ethers.utils.parseEther('20.0'));
    await m_user.executeTransaction(0);

    balance = await ethers.provider.getBalance(address);

        // 余额是 BigNumber (in wei); 格式化为 ether 字符串
    //let etherString = ethers.utils.formatEther(balance);
    
    console.log("final Balance: " + balance);
    
  
}





main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 