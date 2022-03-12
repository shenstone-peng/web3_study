//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract jiangwei is ERC721{
    address public owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    constructor() ERC721("JIANGWEI","jiang"){
        owner = msg.sender;
        awardItem(address(owner));
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "only owner can call! ");
        _;
    }
    function awardItem(address player) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        return newItemId;
 }
}