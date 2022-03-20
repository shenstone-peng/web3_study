# web3\_study

## week\_1

### W1-1作业：

*   安装 Metamask、并创建好账号

*   执行一次转账

*   使用 Remix 创建任意一个合约

*   VSCode IDE 开发环境配置

*   使用 Truffle 部署 Counter 合约 到 test 网络（goerli）（提交交易 hash）

*   编写一个测试用例

*   [link](https://github.com/shenstone-peng/web3_study/blob/main/w1_build/w1.md)

### W1-2作业：

*   使用Hardhat部署修改后的Counter   [link](https://github.com/shenstone-peng/web3_study/blob/main/w1_build/hardhat_project/contracts/Counter.sol)

*   使用Hardhat测试Counter        [link](https://github.com/shenstone-peng/web3_study/tree/main/w1_build/hardhat_project/test)

*   写一个脚本调用count()

## week\_2

### W2-1作业：
* 编写⼀个Bank合约：
* 通过 Metamask 向Bank合约转账ETH
* 在Bank合约记录每个地址转账⾦额
* 编写 Bank合约withdraw(), 实现提取出所有的 ETH
*   [**[code link](https://github.com/shenstone-peng/web3_study/blob/main/w2_build/w2-1/bankless.sol)**]
*   [**[process link](https://github.com/shenstone-peng/web3_study/blob/main/w2_build/w2-1/w2.md)**]

### W2-2作业
* 编写合约Score，⽤于记录学⽣（地址）分数：
   * 仅有⽼师（⽤modifier权限控制）可以添加和修改学⽣分数
   * 分数不可以⼤于 100； 
* 编写合约 Teacher 作为⽼师，通过 IScore 接⼝调⽤修改学⽣分数。
* [**[code link](https://github.com/shenstone-peng/web3_study/tree/main/w2_build/w2-2/contracts)**]
* [**[process link](https://github.com/shenstone-peng/web3_study/blob/main/w2_build/w2-2/w2-2.md)**]

### W3_1作业 [HERE](./w3_build/w3-1/README.md)
* 发⾏⼀个 ERC20 Token： 
  * 可动态增发（起始发⾏量是 0） 
  * 通过 ethers.js. 调⽤合约进⾏转账
* 编写⼀个Vault 合约：
  * 编写deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额 ， ⽤从前端调⽤（Approve，transferFrom） 
  * 编写 withdraw ⽅法，提取⽤户⾃⼰的存款 （前端调⽤）
  * 前端显示⽤户存款⾦额

### W3_2作业 [HERE](./w3_build/w3-2/README.md)
* 发行一个 ERC721 Token
   * 使用 ether.js 解析 ERC721 转账事件(加分项：记录到数据库中，可方便查询用户持有的所有NFT)
   * (或)使用 TheGraph 解析 ERC721 转账事件




## W4_1作业
* 部署自己的 ERC20 合约 MyToken
* 编写合约 MyTokenMarket 实现：
   * AddLiquidity():函数内部调用 UniswapV2Router 添加 MyToken 与 ETH 的流动性
   * buyToken()：用户可调用该函数实现购买 MyToken

## W4_2作业
* 在上一次作业的基础上：
   * 完成代币兑换后，直接质押 MasterChef
   * withdraw():从 MasterChef 提取 Token 方法