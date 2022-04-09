> 1. How would you call a function on a third party contract B, on behalf of the sender, through your contract A, guaranteeing no reverts?   
题目意思就是如何通过合约A代表发送者调用合约B的函数，答案很简单咯，就是[delegatecall](https://solidity-by-example.org/delegatecall/)。
```javascript
contract B{
    uint value;
    function test(){
        value = 10;
    }
}

contract A{
    function _delegate(address _B){
        (bool suc,) = _B.delegatecall(abi.encodeWithSignature("test"));
        require(suc, "delegate call failed");
    }
}


```
> 2. What’s the main difference between a transparent proxy and a universal proxy?   
题目意思是透明合约和代理合约的主要区别是啥？社区里这篇[文章](https://learnblockchain.cn/article/1933#%E4%BB%A3%E7%90%86%E5%AD%98%E5%82%A8%E5%86%B2%E7%AA%81%E5%92%8C%E9%9D%9E%E7%BB%93%E6%9E%84%E5%8C%96%E5%AD%98%E5%82%A8)很详细的介绍了这俩代理模式的。可以瞅一瞅。
```js
contract TransparentProxy{
    uint public value;
    address public implementation;
    address public owner;
    constructor(address _v1){
        implementation = _v1;
        owner = msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "only owner");
        _;
    }
    function _upgrade(address _newImplementation) public onlyOwner{
        implementation = _newImplementation;
    }

    function _delegatecall() public {
        (bool suc,) = implementation.delegatecall(msg.data);
        require(suc, "delegatecall failed");
    }
}


contract BoxV1{
    uint public value;
    function set(uint _value) public{
        value = _value;
    }
}
```

```js
contract UniversalProxy{
    uint public value;
    address public implementation;
    constructor(address _v1){
        implementation = _v1;
        
    }   
    function _delegatecall() public {
        (bool suc,) = implementation.delegatecall(msg.data);
        require(suc, "delegatecall failed");
    }
}

abstract contract Box{
    uint public value;
    address public implementation;
    address public owner ;
    modifier onlyOwner(){
        require(msg.sender == owner, "only owner");
        _;
    }
    function _upgrade(address _newimplementation) public onlyOwner {
        implementation = _newimplementation;
    }
}
contract BoxV1 is Box{
    function set(uint _value) public {
        value = _value;
    }
}
```
通用代理优势：通过在实现合约上定义所有函数，它可以依靠Solidity编译器检查任何函数选择器冲突。此外，通用代理的大小要小得多，从而使部署更便宜。在每次调用中，从存储中需要读取的内容更少，降低了开销。  
通用代理劣势：如果一次合约忘记写upgrade函数，将会永远无法升级了。
> 3. How could you destroy the implementation of, and effectively brick, a universal proxy?
Assumptions:
* You re not the owner of the proxy
* No one owns the implementation
* The implementation uses delegatecall to guarantee that the next implementation is not sterile  
题目大概意思是，如何毁掉一个通用代理下的实现合约？条件如下：  
- 你不是代理合约的owner
- 没人是implementation合约的owner
- implementation合约使用了delegatecall去保证每个implementation合约总是可升级的（可以看上面的通用代理劣势）

答案：因为implementation合约里有调用delegatecall，去调用别的合约，那只要在该合约中加一个selfdestruct函数，即可完成对通用代理的毁灭。所以在implementation合约里最好不要使用selfdestruct和delegatecall函数。详细可以查看这篇[文档](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#potentially-unsafe-operations)

> 4. What’s the danger of using tx.origin for user authentication in a smart contract?


参考答案：tx.origin是最开始调用合约的EOA账户（外部账户），如果你的合约A用了tx.origin来判断身份的话，最好就别执行了陌生的合约了，因为可能该合约会调用合约A，来转走你的钱。 如果你没看懂我在说啥的话，这里提供个[案例](https://solidity-by-example.org/hacks/phishing-with-tx-origin/)去参考下。

> 5. What kind of proxy would you use to update an indefinite amount of instances with a single implementation upgrade? And how would it work?  

题目大概意思是：什么样的代理可以让你只要升级一次实现，完成多个实例代理呢？  
参考答案：使用信标代理，信标代理特征，再加一层合约，其保存着implementation，代理合约存着信标合约地址。示例如下：  
```js
contract Proxy {
    address immutable beacon = 0xaaaaaaaaaaaaaaaaaaaaa;
    fallback() external payable{
        address implementation = beacon.implementation();
        return implementation.delegatecall(msg.data);
    }
}

contract Beacon{
    address public implementation;
    function upgrade(address _newImplementation) public onlyOwner{
        implementation = _newImplementation;
    }
}

```


> 6. Whats the deal with external vs public? When should you use external? When not? Why is it cheaper than public?  
**参考答案：**
External函数一般是外部合约或者EOA账户调用，如果是合约内部其他函数调用，需要使用方法*this.xxx()*，Public函数外部内部都可以调用。  
External函数更便宜是因为它的参数可以直接从calldata里取出，而Public函数则需要先把他们加载到Memory里，这会消耗更多的gas。  
另外注意使用*this.xxx()*时，会改变msg.sender，具体如下：  
You can only call external functions with this using *this.xxx()*. External uses params directly from calldata, without uploading them to memory.
```js
//EOA address: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4  call A.callFunc()
contract A{
    address immutable caller = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    function callFunc() public{
        testPublic();
        this.testExternal();
    }

    function testPublic() public{
        require(caller == msg.sender, "when u use Public, the msg.sender is still the caller before");
    }

    function testExternal() external{
        require(address(this) == msg.sender, "when u use Exteranl, the msg.sender is the contract self");
    }
}
```

> 7. 3rd party contract B with function b() writes to state in ways outside of your control. How would you simulate a call to b() from your contract A, observe the side effects, and then undo them entirely without reverting the main execution thread?  
题目大概意思是：如何调用第三方合约的函数b()，并保证不会干扰你的主要执行线程。  
参考答案：使用try...catch...，下面举个例子，安全转账ERC20。  
```js

contract B is ERC20{
    function transferFrom(address _sender, address _to, uint _amount) public returns (bool){
        //...
    }
}


contract A{
    function interactWithToken(uint _amount){
        IERC20 token = IERC20(tokenAddress);
        bool success;

        try token.transferFrom(msg.sender, address(this), sendAmount)returns(bool _success){
            success = _success;
        } catch Error(string memory) {
            success = false;
        } catch (bytes memory) {
            sucess = false;
        }

        if(success) {
            // handle success case
        } else {
            // handle failutre case without reverting
        }
    }
}
```
> 8. Dynamically sized types in function signatures may be preceded by the keywords “memory”, “storage”, or “calldata”. When is it optimal to use each of them?  
题目大概意思是函数参数中的动态类型对象可以注明关键词"memory","storage","calldata"，分别什么情况下使用。
参考答案：calldata基本是为external函数服务的。它跟memory很像，只是是不可更改的，memory是可更改的。storage类型只能在internal函数中传递，并作为引用传送，这样才能写入。
ans: calldata is purely for external functions. It's similar to memory in most aspects but is immutable memory data is mutable. Storage types can only be passed within internal functions and are sent as reference to enable writing into them.

> 9. Why do contract sizes decrease so much when you wrap the code of a modifier in an internal function?

> 10. Is there a way to revert with dynamic error messages?  I.e. “Error: Price must be > 1 ETH”, where 1 is a value held in a state variable in your contract.
ans:
```js
contract example{
    function test() public{
        uint8  value = 1;
        string memory tmp = string(abi.encodePacked("Error:Price must be", value, " ETH"));
        require(false, tmp);

    }
}
```
> 11. Can you read a private variable of another contract from your contract? If so, how?
ans: no

> 12. Bob calls contract A, which delegate calls contract B, which delegate calls contract C, which calls contract D, which delegate calls contract E, which delegate calls contract A.Who is msg.sender when the execution reaches back contract A?
```
when Bob call A, sender is EOA
when A dcall B,  sender is EOA
when B dcall C,  sender is EOA
when C call D,   sender is C now 
when D dcall E,  sender is C 
when E dcall A,  sender is C
The ans is C.
```

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
