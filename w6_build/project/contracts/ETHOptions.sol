// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UniOptV1ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import './libraries/TransferHelper.sol';

contract ETHOptions is UniOptV1ERC20{
    using SafeMath for uint;
    address constant dai =0x2Ec4c6fCdBF5F9beECeB1b51848fc2DB1f3a26af;
    address public releaser;
    address public Factory; //TODO
    uint256 public deadline;
    uint256 public assetPrice;
    constructor(){
        Factory = msg.sender;
    }
    function initialize(address _caller, uint256 _deadline, uint256 _price) payable public{
        require(msg.sender == Factory);
        require(_deadline > block.timestamp,"DLS");//DEADLINE is too Small
        releaser = _caller;
        deadline = _deadline;
        assetPrice = _price;  //unit: dai/ether
        name = string(abi.encodePacked("ETH_PRICE", Strings.toString(_price),"usd", "_UNIX", Strings.toString(uint256(_deadline))) );
        symbol = string(abi.encodePacked("OPT", Strings.toString(_price)));
        _releaseOPT(uint(msg.value));
    }

    function _releaseOPT(uint amount)  internal{
        _mint(releaser, amount);  //1ETH = 10*10^18
    }
    
    function takeETH() public{
        require(block.timestamp > deadline);
        uint amount = this.balanceOf(address(msg.sender));
        _burn(msg.sender, amount);
        uint needPay = amount.mul(assetPrice);//needpay = x*10^18 * y dai
        TransferHelper.safeTransferFrom(dai, msg.sender, releaser, needPay);
        TransferHelper.safeTransferETH(msg.sender, amount);//unit: wei
        
    }

    function burnAll()  public{
        require(msg.sender == releaser,"only Releaser");
        require(block.timestamp >= deadline + 1 days,"not now");
        selfdestruct(payable(msg.sender));
    }


}