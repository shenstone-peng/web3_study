//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import './IUniswapV2Router01.sol';
import './IUniswapV2Factory.sol';
import './IMasterChef.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenSuShiMarket{
    using SafeERC20 for IERC20;
    address public coin;
    address public UniswapV2Router;
    address WETH;
    address public SushiChef;
    address public UniswapFactory;
    mapping (address=>mapping(address=>uint256)) deposit_vault;
    

    constructor(
          address _coin
        , address _UniswapV2Router
        , address _UniswapV2Factory
        , address _WETH
        , address _SushiChef){
        coin = _coin;
        UniswapV2Router = _UniswapV2Router;
        UniswapFactory = _UniswapV2Factory;
        WETH = _WETH;
        SushiChef = _SushiChef;
    }
    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'MyTokenMarket: EXPIRED');
        _;
    }

    function transfer(address payable _to, uint256 amount) internal returns(bool){
        (bool ret,) = _to.call{value : amount}("");
        return ret;
    }

    function AddLiquidity(
        uint amountMytokenDesired
    )  external  payable returns (uint amountA, uint amountETH, uint liquidity, address lptoken){
        //从用户账户中转出amountMytokenDesired数量的coin到本合约，并授权给UniswapV2Router
        IERC20(coin).safeTransferFrom(msg.sender, address(this), amountMytokenDesired);
        IERC20(coin).safeApprove(UniswapV2Router, amountMytokenDesired);

        //调用uniswapRouter添加[coin, weth]的流动性，最终添加了amountA数量的coin和amountETH数量的weth，获得liquidity数量的lpToken
        (amountA, amountETH, liquidity) = IUniswapV2Router01(UniswapV2Router).addLiquidityETH{value:msg.value}(coin, amountMytokenDesired,  0, 0, address(this), block.timestamp);
        //获取lptoken的地址，并存入本合约账户
        lptoken = IUniswapV2Factory(UniswapFactory).getPair(address(coin), address(WETH));
        deposit_vault[msg.sender][lptoken] = liquidity;

        //退还多余的eth和token
        if (msg.value > amountETH) {
            bool ret = transfer(payable(msg.sender), msg.value - amountETH);
            require(ret, "withdraw failed");
        }
        if (amountMytokenDesired > amountA){
            IERC20(coin).safeTransferFrom(address(this), msg.sender, amountMytokenDesired - amountA);
        }

        //deposit to sushi pool
        IERC20(lptoken).safeApprove(SushiChef, ~uint256(0));
        IMasterChef(SushiChef).deposit(0, liquidity);
    }
    //function explain: buy amount
    function BuymyTokenWithExactETH(
        uint amountOutMin
    )external payable  returns(uint[] memory amounts){
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = coin;
        amounts = IUniswapV2Router01(UniswapV2Router).swapExactETHForTokens{value: msg.value}(amountOutMin, path, msg.sender, block.timestamp);

    }


    function BuyExactTokenWithETH(
        uint amountOut
    )external payable returns(uint[] memory amounts){
        address[] memory path = new address[](2);
        path[0] = coin;
        path[1] = WETH;
        amounts = IUniswapV2Router01(UniswapV2Router).swapETHForExactTokens{value: msg.value}(amountOut, path, msg.sender, block.timestamp);
    }

    function withdrawLiquidity(address _lptoken)external{
        uint256 amount = deposit_vault[msg.sender][_lptoken];
        require(amount > 0, "u don't have lptoken");
        IMasterChef(SushiChef).withdraw(0, amount);
        IERC20(_lptoken).safeTransferFrom(address(this), msg.sender, amount);
    }
}