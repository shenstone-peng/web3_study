//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
contract shenstone is ERC20Permit{
    address public owner;
    constructor() ERC20("SHENSTONE","SP") ERC20Permit("SHENSTONE"){
        owner = msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "only owner can call! ");
        _;
    }
    function mint(uint256 amount) public onlyOwner{
        _mint(msg.sender, amount * 10 ** 18);
    }
}