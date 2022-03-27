// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
import "./interfaces/IPool.sol";
import "./interfaces/IPoolAddressesProvider.sol";
import './interfaces/IV3SwapRouter.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV3Factory.sol';
import './interfaces/IUniswapV2Factory.sol';
import './interfaces/IUniswapV2Pair.sol';
import './libraries/TransferHelper.sol';
import './libraries/UniswapV2Library.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
contract aaveFlashLoan{
    IPoolAddressesProvider public ADDRESSES_PROVIDER;
    IPool public POOL;
    address v2Router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address v2Factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address v3Router = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;

    constructor(IPoolAddressesProvider provider) {
        ADDRESSES_PROVIDER = provider;
        POOL = IPool(provider.getPool());
    }
    //address receiverAddress, 
    //address asset,
    //uint256 amount,
    //bytes calldata params,
    //uint16 referralCode
    function callFlashLoan (address tokenA, address tokenB, uint _amount) external {
        //1.approve tokenA to pool
        //2.call flashLoanSimple
        bytes memory data = abi.encode(msg.sender,tokenB);
        POOL.flashLoanSimple(address(this), tokenA, _amount, data,1);

    }
    function executeOperation(
    address asset,
    uint256 amount,
    uint256 ,
    address ,
    bytes calldata params
    ) external returns (bool){
        //background :asset :token A . amount :x 
        //buy tokenB with amount(x) of tokenA on uniswapV2
        //buy more tokenA (x + deltax) with tokenB on uniswapV3
        //payback amount(x) of tokenA to aavePOOL 
        //transfer amount(deltax) to user
        //start code
        //0.decode params
        (address user, address swapToken) = abi.decode(
            params,
            (address, address)
        );
        //1.approve tokenA & tokenB to v2router & v3 router   (tokenA:10; tokenB:0)
        TransferHelper.safeApprove(asset, v2Router, type(uint).max);
        TransferHelper.safeApprove(swapToken, v2Router, type(uint).max);
        TransferHelper.safeApprove(asset, v3Router, type(uint).max);
        TransferHelper.safeApprove(swapToken, v3Router, type(uint).max);
        //2.transfer from tokenA to tokenB on uniswapV2       (tokenA:0; tokenB:20)
        //2.1 check whether pair is existed 
        address tokenPairAddr = IUniswapV2Factory(v2Factory).getPair(
            asset,
            swapToken
        );
        require(tokenPairAddr != address(0), "null pair on uniV2");
        //2.2 start swap 
        address[] memory V2path = new address[](2);
        V2path[0] = asset;
        V2path[1] = swapToken;
        uint[] memory amountOut= IUniswapV2Router02(v2Router).swapExactTokensForTokens(amount, 0, V2path, address(this), block.timestamp);
        
        //3.transfer from tokenB to tokenA on unisapV3        (tokenA:12; tokenB:0)
        uint24 poolFee = 3000;
        uint256 amountAOut = 
            IV3SwapRouter(v3Router).exactInputSingle(
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: swapToken,
                    tokenOut: asset,
                    fee: poolFee,
                    recipient: address(this),
                    amountIn: amountOut[1],
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                    })
            );

        //4.transfer 10 tokenA to aave POOL               (tokenA:2; tokenB:0)
        require(amountAOut > amount,"don't have enough asset to pay back, call flashloan failed");
        TransferHelper.safeTransfer(asset, address(POOL), amount);
        //5.transfer 2 tokenA to user
        TransferHelper.safeTransfer(asset, user, amountAOut - amount);
        return true;
    }
}