> 1. How would you call a function on a third party contract B, on behalf of the sender, through your contract A, guaranteeing no reverts?  

> 2. What’s the main difference between a transparent proxy and a universal proxy?

> 3. How could you destroy the implementation of, and effectively brick, a universal proxy?
Assumptions:
* You re not the owner of the proxy
* No one owns the implementation
* The implementation uses delegatecall to guarantee that the next implementation is not sterile
> 4. What’s the danger of using tx.origin for user authentication in a smart contract?

> 5. What kind of proxy would you use to update an indefinite amount of instances with a single implementation upgrade? And how would it work?

> 6. Whats the deal with external vs public? When should you use external? When not? Why is it cheaper than public?

> 7. 3rd party contract B with function b() writes to state in ways outside of your control. How would you simulate a call to b() from your contract A, observe the side effects, and then undo them entirely without reverting the main execution thread?

> 8. Dynamically sized types in function signatures may be preceded by the keywords “memory”, “storage”, or “calldata”. When is it optimal to use each of them?

> 9. Why do contract sizes decrease so much when you wrap the code of a modifier in an internal function?

> 10. Is there a way to revert with dynamic error messages?  I.e. “Error: Price must be > 1 ETH”, where 1 is a value held in a state variable in your contract.

> 11. Can you read a private variable of another contract from your contract? If so, how?

> 12. Bob calls contract A, which delegate calls contract B, which delegate calls contract C, which calls contract D, which delegate calls contract E, which delegate calls contract A.Who is msg.sender when the execution reaches back contract A?

> 13. You use your smart account (a wallet contract you control) in L1 to deposit tokens in an L1 to L2 bridge. You eagerly wait for the tx to be relayed. It gets relayed. Ok 👍 But holy sheitz!! Your funds are lost. What happened?!

> 14. When you compile a Solidity contract, you get "bytecode" and "deployedBytecode". They are almost identical. What's the difference? Where is the difference? And why is there a difference?

> 15. Can you use creation bytecode to bundle a bunch of txs together in a single tx, instead of deploying a contract?

> 16. A contract's runtime byte code is: 0x363d3d37363df3   What does it do?

> 17. Can you guarantee that your complex smart contract system, which continuously evolves, will have the exact same contract addresses in all evm compatible networks it is deployed into, forever?If so, how?

> 18. A Universal proxy moves its upgradeability management code from the proxy to the implementation. This makes them simpler and more gas efficient. However an upgrade could contain damaged upgradability code and “brick” the proxy. How could this be avoided?

> 19. Smart contract A’s view function a() needs to call a third party contract B’s b() function, which is also supposed to be view. Can it guarantee that it will really be read only too by just calling it, or does it need to take any additional precautions?

> 20. If a factory contract manufactures instances at the bytecode level, and their bytecode does not adhere to any known standard, how could you verify these instances in Etherscan?

> 21. A random number oracle provides a number between 0 and 2^256. How would you manipulate this number in Solidity to represent a random number between zero and 500?

> 22. You launch an NFT collection. As an artist / dev, you know which tokenId’s will be rare. Every time someone mints, you pick one at random and upload it to IPFS. How do you guarantee transparency / fairness in this process?

> 23. Solidity has a non-frequently used keyword "anonymous" that can be used in events. When would you use it and what for?

> 24. You make a transaction. It reverts. What, if any, state changes occurs?

> 25. How would you demonstrate that two different sets of transactions alter the state of a chain in the exact same way, without knowing the contracts they interact with?

> 26. if another function is called inside an unchecked block, does that turn off overflow checks inside other functions scope?

> 27. You make a delegate call to a third party contract whose interface you know. It may revert with custom errors ErrorA() or ErrorB(). Given that it reverted, what code would you use to know which error it reverted with?

> 28. Does adding or changing comments on a contract affect its resulting runtime bytecode?

> 29. To index or not to index, that is the question. Does using indexed in events increase runtime gas costs? How about bytecode size?

> 30. What’s the “data” and “to” of a transaction that creates a contract whose runtime byte code is 0x?

> 31. Are Solidity's new custom errors part of a contract's interface?

> 32. A contract contains an array of one million addresses, and a view function that simply returns this array. Will this function run out of gas when:
* Called by a contract?
* Called externally by an EOA?

> 33. Is it possible to implement `hasDuplicates(uint[] memory values) public pure returns (bool)`

with < O(n^2) complexity?

> 34. You have a public view function in a contract. Can it know whether it's been called as part of a transaction that mutates the root hash of the chain, as opposed to just a simple read call?

> 35. You have a contract with 4 public functions. You add a 5th, and all of sudden calling function 4 costs less gas.

> 36. Can you write a contract in Solidity with no abi (just a fallback) that returns “world” if the calldata is “hello”?
