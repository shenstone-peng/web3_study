// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import './ETHOptions.sol';

contract UnioptV1Factory  {
    using SafeMath for uint;
    address public feeTo;
    address public feeToSetter;

    event OptionsCreated( address indexed owner, uint indexed deadline, address options, uint prices);

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
        feeTo = msg.sender;
    }
    

    function CodeHash() external pure returns (bytes32) {
        return keccak256(type(ETHOptions).creationCode);
    }

    function createETHOptions(uint _deadline, uint _price, address _owner) payable external  returns (address options) {
        uint deadline = uint(block.timestamp).add(_deadline.mul(24).mul(60).mul(60));
        bytes memory bytecode = type(ETHOptions).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_deadline, _price));
        assembly {
            options := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        //(address _caller, uint256 _deadline, uint256 _price)
        uint amount = uint(msg.value).mul(997) / 1000;
        ETHOptions(options).initialize{value:amount}(_owner, deadline, _price);
        
        emit OptionsCreated(_owner, _deadline, options, _price);
    }

    function setFeeTo(address _feeTo) external  {
        require(msg.sender == feeToSetter, 'Uniopt: FORBIDDEN');
        feeTo = _feeTo;
    }


    function setFeeToSetter(address _feeToSetter) external  {
        require(msg.sender == feeToSetter, 'Uniopt: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }

    function takeFee() public{        
        (bool success, ) = feeTo.call{value: address(this).balance}(new bytes(0));
        require(success, 'STE');
    }
}
