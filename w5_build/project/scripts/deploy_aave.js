const { network, ethers } = require("hardhat");
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  const [deployer, user] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  let FactoryV2 = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  let FactoryV3 = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
  let SwapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  let V3SwapRouter2 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
  let V3SwapRouter ="0xE592427A0AEce92De3Edee1F18E0157C05861564";
  let v2router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  let univ2pair = "0x2DCA6B03dc0a85a64018B5c4b07E2e32E4338C05";
  let SP = "0x1DF5a9A849eAa1D343f8A373b05B824FA8cEEDC6";
  let JW = "0x217BcdF4db049114f3F85d096154DEAc702b42Cf";
  let aave_provider = "0xA55125A90d75a95EC00130E8E8C197dB5641Eb19";
  const My_aave = await hre.ethers.getContractFactory("aaveFlashLoan");
  const m_aave = await My_aave.deploy(aave_provider);
  /*
    IUniswapV2Factory immutable FactoryV2;
    IUniswapV3Factory immutable FactoryV3;
    ISwapRouter immutable SwapRouter;
  */
  await m_aave.deployed();
  console.log("m_flashSwap deployed to :", m_aave.address, network.name);
  await writeAddr(m_aave.address, "aaveFlashLoan", network.name);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });