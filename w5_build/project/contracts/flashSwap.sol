//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.4;
pragma abicoder v2;
import './interfaces/IV3SwapRouter.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV3Factory.sol';
import './interfaces/IUniswapV2Factory.sol';
import './interfaces/IUniswapV2Pair.sol';
import './libraries/TransferHelper.sol';
import './libraries/UniswapV2Library.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
contract FlashSwap {
    using SafeERC20 for IERC20;
    IUniswapV2Factory immutable FactoryV2;
    IUniswapV3Factory immutable FactoryV3;
    IV3SwapRouter immutable SwapRouter;
    IUniswapV2Router02 immutable RouterV2;
    address AtokenAddress = 0x15ADb0477A7b1a2fADfcAA5c5F9e1c9BcfF21A4f;
    address BtokenAddress = 0xd48140E8c248563ab47ce1465B9cceA602fD2f91;
    address public tokenPairAddr;
    
    
    constructor(IUniswapV2Factory _factoryV2, IUniswapV3Factory _factoryV3, IV3SwapRouter _routerV3, IUniswapV2Router02 _routerV2){
        FactoryV2 = _factoryV2;
        FactoryV3 = _factoryV3;
        SwapRouter = _routerV3;
        RouterV2 = _routerV2;
    }

    function flashswap(uint _amount) external{
        tokenPairAddr = IUniswapV2Factory(FactoryV2).getPair(
            AtokenAddress,
            BtokenAddress
        );
        require(tokenPairAddr != address(0), "null token");
        address token0 = IUniswapV2Pair(tokenPairAddr).token0();
        address token1 = IUniswapV2Pair(tokenPairAddr).token1();
        uint256 amount0Out = AtokenAddress == token0 ? _amount : 0;
        uint256 amount1Out = AtokenAddress == token1 ? _amount : 0;
        //借款数据
        bytes memory data = abi.encode(_amount);
        IUniswapV2Pair(tokenPairAddr).swap(
            amount0Out,
            amount1Out,
            address(this),
            data
        );
    }
    //sender who call swap in uniswapV2
    //sender.call(uniswap.swap(amount0out,amout1out,to,data))
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external {
        //bytes memory path =new bytes(43) ;
        address token0 = IUniswapV2Pair(msg.sender).token0();
        require(IERC20(token0).balanceOf(address(this))>=amount0,"wtf");
        require(amount0 > 0,"wtff");
        address token1 = IUniswapV2Pair(msg.sender).token1();
        TransferHelper.safeApprove(token0, address(SwapRouter), type(uint).max);
        TransferHelper.safeApprove(token0, address(RouterV2), type(uint).max);
        TransferHelper.safeApprove(token1, address(SwapRouter), type(uint).max);
        TransferHelper.safeApprove(token1, address(RouterV2), type(uint).max);
        
        require(amount1 == 0, "only transfer from token0 to token1"); // this strategy is unidirectional
        //path = abi.encodePacked(token0, poolFee, token1);
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;
        /*
        uint256 amountOut = 
            SwapRouter.exactInputSingle(
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: token0,
                    tokenOut: token1,
                    fee: poolFee,
                    recipient: address(this),
                    amountIn: amount0,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                    })
            );
        */
        uint256 amountOut = IV3SwapRouter(SwapRouter).exactInput{
            value: 0
        }(
            IV3SwapRouter.ExactInputParams({
                path: abi.encodePacked(
                    token0,
                    uint24(3000),
                    token1
                ),
                recipient: address(this),
                deadline: block.timestamp + 2000,
                amountIn: amount0,
                amountOutMinimum: 0
            })
        );
        TransferHelper.safeApprove(token0, address(RouterV2), type(uint).max);
        uint256[] memory amounts1 = IUniswapV2Router02(RouterV2).getAmountsOut(
            amount0,
            path
        );
        
        require(amountOut > amounts1[1],"flash swap failed");
        TransferHelper.safeTransfer(token1, msg.sender, amountOut-2e18);
        TransferHelper.safeTransfer(token1, sender, 2e18);
    }
}