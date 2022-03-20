const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const ERC20Addr = require(`../deployments/dev/shenstone.json`)
const factoryAddr = require(`../uniswap/v2-core/deployments/dev/UniswapV2Factory.json`);
const routerAddr = require(`../uniswap/v2-periphery/deployments/dev/Router.json`);
const wethAddr = require(`WETH.json`);
const { ethers } = require("hardhat");

async function main() {
  // await hre.run('compile');
  let [owner, second] = await ethers.getSigners();
  const MytokenMarket = await hre.ethers.getContractFactory("MyTokenMarket");
  let weth = wethAddr.address;
  let router = routerAddr.address;
  console.log("ERC20Addr:%s\nrouter.address:%s\nweth.address:%s\nuniFactory.address", ERC20Addr.address, router, weth, factoryAddr.address);
  const m_MytokenMarket = await MytokenMarket.deploy(ERC20Addr.address, router, weth);

  await m_MytokenMarket.deployed();

  console.log("m_MytokenMarket deployed to:", m_MytokenMarket.address, network.name);
  await writeAddr(m_MytokenMarket.address, "MyTokenMarket", network.name);
  
  // 实例一个用户
  let myerc20 = await ethers.getContractAt("shenstone",
        ERC20Addr.address,
        owner);
  await myerc20.approve(m_MytokenMarket.address, ethers.constants.MaxUint256);
  let aAmount = ethers.utils.parseUnits("100000", 18);
  let ethAmount = ethers.utils.parseUnits("100", 18);
  let ans = await m_MytokenMarket.AddLiquidity(aAmount, { value: ethAmount })
  
  console.log("添加流动性");
  let b = await myerc20.balanceOf(owner.address);
  console.log("持有token:" + ethers.utils.formatUnits(b, 18));
/*
  let myFactory = await ethers.getContractAt("UniswapV2Factory", 
        factoryAddr.address,
        owner);
  let lp = await myFactory.getPair(ERC20Addr.address);
  console.log("lp : %s", lp);
  
*/

  let buyEthAmount = ethers.utils.parseUnits("10", 18);
  out = await m_MytokenMarket.BuymyTokenWithExactETH("0", { value: buyEthAmount })

  b = await myerc20.balanceOf(owner.address);
  console.log("购买到:" + ethers.utils.formatUnits(b, 18));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });