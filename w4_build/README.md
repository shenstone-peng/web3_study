# w4-1
## 1 部署自己的 ERC20 合约 MyToken
## 2 编写合约 MyTokenMarket 实现：
### 2.1 AddLiquidity():函数内部调用 UniswapV2Router 添加 MyToken 与 ETH 的流动性
```
function AddLiquidity(
        uint amountMytokenDesired
    )  external  payable returns (uint amountA, uint amountETH, uint liquidity){
        //从用户账户中转出amountMytokenDesired数量的coin到本合约，并授权给UniswapV2Router
        IERC20(coin).safeTransferFrom(msg.sender, address(this), amountMytokenDesired);
        IERC20(coin).safeApprove(UniswapV2Router, amountMytokenDesired);

        //调用uniswapRouter添加[coin, weth]的流动性，最终添加了amountA数量的coin和amountETH数量的weth，获得liquidity数量的lpToken
        (amountA, amountETH, liquidity) = IUniswapV2Router01(UniswapV2Router).addLiquidityETH{value:msg.value}(coin, amountMytokenDesired,  0, 0, msg.sender, block.timestamp);

        

        //退还多余的eth和token
        if (msg.value > amountETH) {
            bool ret = transfer(payable(msg.sender), msg.value - amountETH);
            require(ret, "withdraw failed");
        }
        if (amountMytokenDesired > amountA){
            IERC20(coin).safeTransferFrom(address(this), msg.sender, amountMytokenDesired - amountA);
        }
    }
```
### 2.2 buyToken()：用户可调用该函数实现购买 MyToken

```
function BuymyTokenWithExactETH(
        uint amountOutMin
    )external payable  returns(uint[] memory amounts){
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = coin;
        amounts = IUniswapV2Router01(UniswapV2Router).swapExactETHForTokens{value: msg.value}(amountOutMin, path, msg.sender, block.timestamp);

    }
```

## 3 整体流程
### 3.1 部署uniswapFactory合约  
![uni_factory](./images/uni_factory.png)  

### 3.2 部署weth合约以及uniswapRouter合约
![uni_router](./images/uni_router.png)

### 3.3 部署mytoken以及mint  
![mytoken](./images/mytoken.png)  

### 3.4 添加mytoken和eth的流动性，以及用eth购买token
![add_buy](./images/add_buy.png)




W4_2作业
* 在上一次作业的基础上：
   * 完成代币兑换后，直接质押 MasterChef
   * withdraw():从 MasterChef 提取 Token 方法