# w4-1
## 1 部署自己的 ERC20 合约 MyToken  
link here: [mytoken_code](./project/contract/shenstone.sol)  
## 2 编写合约 MyTokenMarket 实现： 
link here: [MyTokenMarket_Code](./project/contract/MyTokenMarket.sol)  


## 3 整体流程
### 3.1 部署uniswapFactory合约  
![uni_factory](./images/uni_factory.png)   
link here: [01_deploy_factory](./uniswap/v2-core/scripts/01_deploy_factory.js)    

### 3.2 部署weth合约以及uniswapRouter合约  
![uni_router](./images/uni_router.png)  
link here: [02_deploy_weth_router](./uniswap/v2-periphery/scripts/01_deploy_router.js)   
### 3.3 部署mytoken以及mint  
![mytoken](./images/mytoken.png)  

### 3.4 添加mytoken和eth的流动性，以及用eth购买token
![add_buy](./images/add_buy.png)    
link here: [部署合约脚本](./project/scripts/deploy_mytokenmarket.js)    


## W4_2作业
### 1. 部署sushitoken，masterchef和add lptoken(mycoin,weth)  
![sushi](./images/sushi.png)  

### 2. 完成代币兑换后，直接质押 MasterChef  
link here: [质押和提取合约代码]](./project/contract/MyTokenMarket_sushi.sol)
link here: [部署脚本](./project/scripts/deploy_mytokenSushiMarket.js)
