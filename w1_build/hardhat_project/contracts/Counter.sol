// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Counter{
    uint public n;
    function set_n() public {
        n = n + 1;
    }
    function count() public view returns(uint) {
        return n;
    }
}