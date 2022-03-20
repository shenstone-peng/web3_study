console.log("here2");
module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()
  console.log("account1:%s\n account2:%s", deployer, dev);
  const m_masterChef = await ethers.getContract("MasterChef", dev);
  let lp_address ="0xe1CEEC851EFAFd2dcc0D24295A18F33908f6C5dc";
  //add("100", this.lp.address, true)
  console.log("add lp in sushi pool");
  await m_masterChef.add("100", lp_address, true);
  pool = await m_masterChef.poolInfo(0);
  console.log("pool:%s", pool.lpToken);
}

module.exports.tags = ["MasterChef"]
console.log("need Mocks")
//module.exports.dependencies = ["test","UniswapV2Factory", "UniswapV2Router02", "SushiToken"]
module.exports.dependencies =["SushiToken"]
