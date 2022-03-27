const { network, ethers } = require("hardhat");
const hre = require("hardhat");

const myFlashSwap = require(`../deployments/kovan/FlashSwap.json`)
async function main() {


    const [deployer, user] = await ethers.getSigners();

    console.log(
      "run contracts with the account:",
      user.address
    );
  
    let FactoryV2 = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    let FactoryV3 = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    let V3SwapRouter2 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
    let V3SwapRouter ="0xE592427A0AEce92De3Edee1F18E0157C05861564";
    let univ2pair = "0xBc071686c143095EE5Cedf60cF46db9ca39db79C";
    let univ3pool = "0x1A668299D5c1dAd9741D25F38549Cfe3420D97D5";
    let SP = "0x15ADb0477A7b1a2fADfcAA5c5F9e1c9BcfF21A4f";
    let JW = "0xd48140E8c248563ab47ce1465B9cceA602fD2f91";
   
    let m_univ2pair = await ethers.getContractAt("IUniswapV2Pair",
        univ2pair,
        user);

    //await myerc20.approve(m_MytokenMarket.address, ethers.constants.MaxUint256);
    let tmp =0;
    let aAmount = ethers.utils.parseUnits("300", 18);
    let bAmount = ethers.utils.parseUnits("0", 18);
    await m_univ2pair.swap(
      aAmount, 
      bAmount, 
      myFlashSwap.address, 
      ethers.utils.defaultAbiCoder.encode(['uint256'], [tmp]),
    );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });