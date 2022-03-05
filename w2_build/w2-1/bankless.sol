// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract bank {
    mapping (address=>uint256) database;
    address payable public owner;
    constructor() payable{
        owner = payable(msg.sender);
    }
    function transfer(address payable _to, uint256 amount) internal returns(bool){
        (bool ret,) = _to.call{value : amount}("");
        return ret;
    }
    function save() payable public {
        database[msg.sender] = database[msg.sender] + msg.value;       
    }
    function rekt() payable public returns(bool){
        require(msg.sender == owner);
        uint256 amount = address(this).balance;
        bool ret = transfer(owner, amount);
        require(ret, "rekt failed");
        return ret;
    }
    function withdraw() public returns(bool ){
        require(database[msg.sender] > 0,"u don't have money in our bank");
        uint256 amount = database[msg.sender];
        database[msg.sender] = 0;
        bool ret = transfer(payable(msg.sender), amount);
        require(ret, "withdraw failed");
        return ret;
    }
}