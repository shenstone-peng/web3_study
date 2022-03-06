# 基础:solidity->bytecode(字节码)->opcode(操作码)

在我们开始前，这篇文章假定读者具备solidity的基础知识，以及了解它是如何部署在以太坊网络的。本文将简要地讨论这部分知识，如果你想对这些知识进行系统复习，请看这篇[文章](https://medium.com/@eiki1212/explaining-ethereum-contract-abi-evm-bytecode-6afa6e917c3b)
众所周知，solidity代码在部署到以太坊网络之前需要被编译成字节码。这个字节码对应的是evm所解析的一系列操作码指令。
本系列文章主要分析编译后的字节码特定部分，并阐明它们的工作原理。在阅读完每篇文章后，你应该对每个组件的功能有一个更清晰的了解。在这一过程中，你会学到很多与evm相关的基础概念。
我们先来看一个基本的solidity合约，以及它部分字节码/操作码，以展示evm是如何选择函数的。
由solidity合约创建的运行态(runtime)字节码是整个合约的内容总结（reoresentation)。在合约中，你可能写有多个函数，一旦部署在链上，就可以被调用。
学习evm和合约的一个常见问题是，EVM是如何知道根据合同的哪个函数被调用来执行哪一块字节码？这个问题是我们用来帮助理解evm的底层机制以及如何处理这种特殊情况的第一个问题。

## 1\_Storage.sol 解析

在我们的演示中，我们将使用1\_Storage.sol合约，它是在线solidity IDE [Remix](https://remix.ethereum.org/)的默认合约之一。

```solidity
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {

    uint256 number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }
}
```

该合约有2个函数*store(uint 256)和*retrieve()，当有函数调用时，evm将需要在两个函数之间做出选择。下面是整个合同的编译后的运行态(runtime)字节码。

    608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100d9565b60405180910390f35b610073600480360381019061006e919061009d565b61007e565b005b60008054905090565b8060008190555050565b60008135905061009781610103565b92915050565b6000602082840312156100b3576100b26100fe565b5b60006100c184828501610088565b91505092915050565b6100d3816100f4565b82525050565b60006020820190506100ee60008301846100ca565b92915050565b6000819050919050565b600080fd5b61010c816100f4565b811461011757600080fd5b5056fea2646970667358221220404e37f487a89a932dca5e77faaf6ca2de3b991f93d230604b1b8daaef64766264736f6c63430008070033 

我们将专注于下面的字节码片段，这个片段说明了函数选择器的逻辑。标记该片段，并执行“ctrl f”来验证它是否在上述字节码中。

    60003560e01c80632e64cec11461003b5780636057361d1461005957

上述字节码对应的是一组evm操作码以及其对应的入参。你可以在[这里](https://www.ethervm.io/)查看evm操作码的列表。
操作码(opcode)的长度为一个字节，理论上有256(2^8)种不同的操作码，evm目前只使用140个独特的操作码。
下面显示了被分解成相应操作码命令的字节码片段。这些都是由evm在调用堆栈上按顺序运行的。你可以访问上面的链接来验证No.60操作码是否为PUSH1等。在文章的最后，你应该对这些操作码的作用有一个全面的了解。

    60 00                       =   PUSH1 0x00 
    35                          =   CALLDATALOAD
    60 e0                       =   PUSH1 0xe0
    1c                          =   SHR
    80                          =   DUP1  
    63 2e64cec1                 =   PUSH4 0x2e64cec1
    14                          =   EQ
    61 003b                     =   PUSH2 0x003b
    57                          =   JUMPI
    80                          =   DUP1 
    63 6057361d                 =   PUSH4 0x6057361d     
    14                          =   EQ
    61 0059                     =   PUSH2 0x0059
    57                          =   JUMPI  

## 智能合约函数调用&调用数据(Smart Contract Function Calls & Calldata)

在深入研究操作码之前，我们需要快速了解下如何调用一个合约函数。
当我们调用一个合约函数时，我们需要calldata，这些calldata指定了我们要调用的函数签名和任何需要传递的参数（入参）。
在solidity中，通过以下方式完成。

```solididy
event FunctionCalldata(bytes);//事件，相当于定义特殊的日志函数

bytes memory functionCallfata = abi.encodeWithSignature("store(uint256)",10);//将函数签名和入参（10）进行编码

emit FunctionCalldata(functionCalldata);//打印上述编码结果

address(storageContract).call(functionCalldata);//指定storage合约地址，并调用该合约账户的store函数
```

在这里，我们用参数10对store函数进行合约调用。我们使用\*abi.encodeWithSignature()\*来获取所需格式的calldata。emit记录了我们的calldata，用于测试。

    0x6057361d000000000000000000000000000000000000000000000000000000000000000a

以上字节码就是\*abi.encodeWithSignature("store(uint256)",10)\*的返回结果。
之前本文提到了函数签名，现在我们来弄清啥时函数签名呢？

> 函数签名被定义为Keccak哈希的前4个字节，Keccak哈希算法是一个经典函数签名算法

函数签名的标准表示法是函数名称和函数参数类型，比如这里的"store(uint256)"和"retrieve()"。自己尝试对"store(uint256)"进行函数签名计算，并在这个[工具链接](https://emn178.github.io/online-tools/keccak_256.html)进行验证。

    keccak256("store(uint256)")-> 前4个字节 = 6057361d

    keccak256("retrieve()") -> 前4个字节 = 2e64cec1

注意上面的calldata，我们可以得知calldata为36字节，而其中前4个字节对应于我们刚刚为store(uin256)函数通过keccak256函数签名算法计算得到的函数选择器。
calldata剩下32个字节则对应我们的入参(uint256)。我们有一个十六进制的值"a"，在十进制中等于10。

    6057361d = function signature (4 bytes)

    000000000000000000000000000000000000000000000000000000000000000a = uint256 input (32 bytes)

"ctrl f"搜索函数签名，看是否可以在运行态字节码中找到它。

## 操作码&调用栈

有了上述知识基础，我们可以开始深入研究函数选择过程在EVM层面发生了什么。
我们将通过执行每个操作码命令来理解它们的作用以及它们是如何影响调用堆栈的。
如果你对栈这个数据结构不熟悉，先看这个[视频](https://www.youtube.com/watch?v=FNZ5o9S9prU)作为入门。
我们从PUSH1开始，它告诉EVM将下一个1字节的数据（0x00）推到调用栈里。接下来的操作码将解释我们为什么这样做。
**译者注**：为方便解释stack和storage变化，这里将用\[]表示栈，{}表示storage。

    PUSH1 0x00                        [0]

接下来，CALLDATALOAD操作码会弹出栈上第一个值（0）作为输入。
这个操作码使用"0"作为偏移量(msg.data\[0:0+32])，将calldata加载到栈中。栈里每层空间为32字节，但我们的calldata为36字节。所以传入栈的值实际为msg.data\[i:i+32]，这里的i就是输入（本例中i即为0）。这确保了只有32个字节的数据被传入栈区，但使我们可以访问calldata的任何部分。
在本例中，偏移量i为0，所以我们把calldata的前32个字节传入了栈区。
还记得之前用一个事件(event)来记录我么的calldata(0x6057361d000000000000000000000000000000000000000000000000000a)。
这意味这后面的4个字节数据("0000000a")会丢失。如果我们需要访问这个uint256的入参，可以使i为4，则访问了完整的入参，但前4个字节即函数签名会被忽略。

    CALLDATALOAD                      [0x6057361d0...00]

接着是下一个PUSH1，入参为(0xe0,十进制为224)。请记住函数签名是4个字节/32位。我们加载的calldata是32字节长，即256位。256 - 32 = 224，你可以猜到这次push是为了什么。

    PUSH1 0xe0                        [224， 0x6057361d0...00]

接下来的操作码为SHR，它的作用是右移。它弹出stack区的第一个变量（224）作为输入，说明要右移多少。stack区的第二个变量(0x6057361d0...00)代表需要右移的数据，右移之后会将数据传入stack。我们可以看到在这个操作之后，我们在stack上有了4字节的函数选择器。
如果你对比特移位不熟悉可以看这个[视频介绍](https://www.youtube.com/watch?t=176\&v=fDKUq38H2jk\&feature=youtu.be)

    SHR                               [0x6057361d]

接下来是DUP1操作码，一个十分简单的操作码，作用为将stack区最前面的一个数据复制，并再次传入stack。

    DUP1                              [0x6057361d, 0x6057361d]

PUSH4望文生义即是将4字节数据传入stack，这里是将retrieve()的4字节函数签名(0x2e64cec1)传入stack上。
如果你好奇它是怎么知道这个值的，请记住这是从solidity代码中编译出的字节码。因此，编译器肯定会有关于代码中所有函数名称和参数类型的信息。

    PUSH4 0x2e64cec1                  [0x2e64cec1， 0x6057361d, 0x6057361d]

EQ操作码从stack区弹出2个变量，在本例中即为0x2e64cec1和0x6057361d，并检查它们是否相等。如果相等则会传入1到stack区，否则传入0。

    EQ                                [0, 0x6057361d]

PUSH2将2个字节的数据(这里为0x003b，十进制为59)传入stack.
stack区有一个叫做程序计数器的东西，它规定了下一个执行命令在字节码中的位置。这里我们设置59，因为那是retrieve()字节码的起始位置。（注意下面EVM Playground部分会帮助理解这一点）
你可以把程序计数器指明的位置类比为你在solidity代码中找代码的行数。就好像函数如果被定义在59行，你可以用行号来告诉机器在哪里找到该函数的代码。

    PUSH2 0x003b                      [59, 0, 0x6057361d]

JUMPI代表"如果...，则跳转至..."，它从stack中弹出2个值作为输入，第一个（59）是跳转位置，第二个（0）是是否应该执行这个跳转的bool值。其中1 = 真，0 = 假。
如果条件为真，程序计数器将被更新至59，在我们的例子中，第2参数为0，程序计数器不会被改变，执行继续正常执行。

    JUMPI                             [0x6057361d]

再次调用DUP1

    DUP1                              [0x6057361d, 0x6057361d]

PUSH4将4字节store(uint256)函数签名传入到stack。

    PUSH4 0x6057361d                  [0x6057361d 0x6057361d, 0x6057361d]

再次调用EQ来做判断，这次为真，因为函数签名相等。

    EQ                                [1, 0x6057361d]

PUSH2，把store(uint256)函数位置(0x0059,十进制为89)传入到stack。

    PUSH2 0x0059                      [89, 1, 0x6057361d]

JUMPI，这次bool检测通过，执行跳转动作。更新程序计数器到89，将会改变下一步执行操作码的位置到89。
在这个位置，将有一个JUMPDEST操作码，如果在目的地没有这个操作码，JUMPI会失败。

    JUMPI                             [0x6057361d]

到这里，在这个操作码执行后，你将被带到store(uint256)的位置，然后函数的执行将继续正常执行。
虽然这个合约只有两个函数，但该原则同样也使用于有20+函数的合约。
你现在知道EVM是如何根据合约中的函数调用来确定它需要执行的函数字节码的位置了。实际上，这只是一组简单的“if语句”，用于合约中的每个函数以及它们的跳转位置。

## EVM Playground

我强烈推荐你访问这个[链接](https://www.evm.codes/playground?unit=Wei&callData=0x6057361d000000000000000000000000000000000000000000000000000000000000000a&codeType=Mnemonic&code=%27!0~0KCALLDATALOAD~2z2qw!E0~3KSHR~5z2qwDUP1~6(X4_2E64CEC1~7KEQ~12z5qwX2_3B~13(*I~16z3qwDUP1~17KX4_6057361D~18KEQ~23z5qwX2_59~24K*I~27z3qwkY%20wX30_0~28KwZGV59z31q!1~60%20%7BG%7DW%7DKwkYwX26_0~62z2qKZstore%7Buint256V89z27q!0%20ZContinueW.KK%27~%20ZOffset%20z%20%7Bprevious%20instruFoccupies%20w%5Cnq)s%7DwkZThes-ar-just%20paddingNenabl-usNgetN_%200xZ%2F%2F%20Yprogram%20counter%2059%20%26%2089XPUSHW%20funFexecution...V%7D)codew*DEST~N%20to(wwGretrieve%7BFction%20-e%20*JUMP)%20byte(%20K!X1_%01!()*-FGKNVWXYZ_kqwz~_)
，这是一个evm操练场，我在这里设置了我们刚刚运行的字节码，你可以互动看到stack的变化，我还包括了JUMPDEST，所以你可以看到在最后的JUMPI之后发生了什么。>
EVM操练场也将有助于你对程序计数器的理解，在代码中，你会看到每个命令旁边的注释，其偏移量代表其程序计数器的位置。
你还会看到运行按钮左边的calldata输入，试着把它改成retrieve()的调用数据0x2e64cec1，看看执行情况如何变化。只要点击运行，然后点击右上方的“步进”按钮，就可以逐步调试每个操作码。
