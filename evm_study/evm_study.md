# Ethereum Architecture(以太坊架构)
我们将从下面的图片开始。不要被吓倒，在本文结束时，你会明白这一切到底是如何结合在一起的。这代表了以太坊的架构和以太坊链中包含的数据。 
[!image_0_Ethereum_architecture](./images/01_eth_arch.png)  
与其将图表作为一个整体来看，我们不如逐块分析。现在，让我们把重点放在 "区块头N"和它包含的字段上。 

---

# Block Header(区块头)
区块头包含了一个以太坊区块的关键信息。下面是 "区块头N "片段，以及它的数据字段。看一下etherscan上的这个区块[14698834](https://etherscan.io/block/14698834)，看看你是否能看到图中的一些字段。  
[!blockN_header](./images/02_blockN_header.png)  

该区块头包含以下字段。
- Prev Hash - 父区块的Keccak哈希值
- Nonce - 用于工作证明的计算
- Timestamp - 时间戳
- Uncles Hash - 叔块的Keccak哈希值
- Benficiary - 受益人地址，矿工地址
- Logs Bloom - 事件地址和事件topic的布隆滤波器
- Difficult - 前一个区块的难度
- Extra Data - 与该区块相关的32字节数据
- Block Num - 祖先块数
- Gas Limit -当前每个区块的气体使用限制值
- Gas Used - 该区块中用于交易的gas消耗值
- Mix Hash - 与nonce一起用来证明工作证明计算的256位值
- State Root - 状态树的根哈希值
- Transaction Root - 交易树的根哈希值
- Receipt Root - 收据树的根哈希值

让我们看看这些字段如何与 Geth 客户端代码库中的内容相对应。我们来看看[block.go](https://github.com/ethereum/go-ethereum/blob/d4d288e3f1cebb183fce9137829a76ddf7c6d12a/core/types/block.go#L70)中定义的 "Header "结构，它表示一个块的头。  
[!go-ethereum_blockHeaderStruct](./images/03_goblockhead.png)  
我们可以看到，代码库中所述的值与我们的概念图相匹配。我们的目标是要如何从区块头找到我们合约的storage存储的位置。

要做到这一点，我们需要关注块头的 "State Root"字段，该字段以红色标示。


# State Root
"State Root"的作用类似于merkle root，因为它是一个依赖于它中间所有数据的哈希值。如果任何数据发生变化，根哈希值也会发生变化。 
在 "State Root"下面的数据结构是一个Merkle Patric Trie(MPT)，它为网络上的每个以太坊账户存储一个键值对，其中键是一个以太坊地址，值是以太坊账户对象。 
实际上，键是以太坊地址的哈希值，值是RLP编码的以太坊账户，但是我们现在可以忽略这一点。
下面是 "以太坊架构 "图的一部分，表示State Root下的MPT。 
[!mpt](./images/04_mpt_underneath_stateroot.png)  

Merkle Patricia Trie是一个非三态的数据结构，所以我们不会在这篇文章中深入研究它。我们可以继续抽象化地址到以太坊账户的键值映射模型。

如果你对Merkle Patricia Trie感兴趣，我建议你看看这篇优秀的介绍性[文章](https://medium.com/shyft-network-media/understanding-trie-databases-in-ethereum-9f03d2c3325d)。

接下来让我们细究一下以太坊地址所映射到的以太坊账户值。 
# Ethereum Account
The Ethereum account is the consensus representation for an Ethereum address. It is made up of 4 items.
- Nonce - Number of transactions made by the account
- Balance - Balance of the account in Wei
- Code Hash - Hash of the bytecode stored in the contract/account
- Storage Root - Keccak Hash of the root node of storage trie (post-execution)

We see these in this snippet from the original Ethereum architecture image.
Again we can jump into the Geth codebase and find the corresponding file state account.go and the struct that defines an "Ethereum account" referred to as a StateAccount.  
Again we can see the values stated within the codebase match our conceptual diagram.  
Next we neede to zoom in on the "Storage Root" field within the Ethereum account.

# Storage Root
The storage root is much like the state root in that underneath it is another Merkle Patricia trie.

The difference is that this time the keys are the storage slots and the values are the data in each slot.  
 
*Again in actuality there is RLP encoding of the values & hashing of the the keys that goes on as part of this process.*

Below is the section of the "Ethereum Architecture" diagram that represents that Merkel Patricia Trie for the "Storage Root"

As before the "Storage Root" is a merkle root hash that will be impacted if any of the underlying data changes.

Any change in contract storage will impact the "Storage Root" which in turn will impact the "State Root" which in turn will impact the "Block Header"

At this stage of the article we've achieved our goal of taking you from an ethereum block down to an individual contract's storage.

The next part of the article is a deep dive into the Geth codebase. We will look briefly at how the contract storage is initialised and what happens when the SSTORE & SLOAD opcodes are called.

This will help you make the mental connections from what we've discussed so far back to your solidity code and the underlying storage opcodes.
A *warning*, the next section is heavy on the *code* side and assumes the ability to read code.

# StateDB -> stateObject -> StateAccount
To get us started we need a brand new contract. A brand new contract means a brand new StateAccount.
Before we start there are 3 structures we're going to be interfacing with:
- StateAccount
 - StateAccount is the Ethereum consensus representation of "Ethereum accounts"
- stateObject
 - stateObject represents an "Ethereum account" that is being modified.
- StateDB
 - StateDB structs within the Ethereum protocol are used to store anything within the merkle trie. It's the general query interface to retrieve:Contracts & Ethereum Accounts
 Let's look at how these 3 items are interconnected and how they relate back to what we have been discussing.
 1.StateDB struct, we can see it has a stateObjects field which is a mapping of address to stateObjects(Remember the "State Root" Merkle Patricia Trie was a mapping of Ethereum addresses to Ethereum accounts and that a stateObject is an Ethereum account that is being modified)
 2.stateObject struct, we can see it has a data field which is of type StateAccount(Remember that earlier in the article we mapped an Ethereum account to StateAccount in Geth)
 3.StateAccount struct, we have seen this struct already, it represents an Ethereum account and the Root field represents the "Storage Root" we discussed earlier.
 At this stage some pieces of the puzzleare starting to fit together. Now we have the context to see how a new "Ethereum account" is initialised.



