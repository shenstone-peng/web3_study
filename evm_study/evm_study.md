# Ethereum Architecture(以太坊架构)
We'll start with the image below. Do not be intimated, by the end of this article you'll understand exactly how this all fits togther. This represents the Ethereum architecture and the data contained within the Ethereum chian.
我们将从下面的图片开始说起。不用详细了解该知识，你将通过这篇文章理解它们是如何联系的。这张图代表了以太坊架构和以太坊链包含的数据。
[!image_0_Ethereum_architecture]()  
Rather than look at the diagram as a whole we'll analyse it piece by piece. For now, let's focus on the 'Block N Header' and the fileds it contains.
我们将一点一点分析图片里的信息。现在，我们先聚焦在“区块N的区块头”以及它包含的内容。
# Block Header(区块头)
The Block Header contains the key information about an Ethereum block. Below is the 'Block N Header' snippet along with its data fields.Take a look at this block 14698834 on etherscan and see if you can see some of the fields in the diagram.
区块头包含关于以太坊区块的关键信息。下面是关于“区块N的区块头”的部分信息。在etherscan上你能对照着下图所示的区块14698834的相关信息、
The block header contains the following fields:
- Prev Hash - Keccak hash of the parent block
- Nonce - Used in proof of work computation
- Timestamp - Scale value for uncled blocks
- Benficiary - Benficiary address, mining fee recipient
- Logs Bloom - Bloom filter of two fields, log address & log topic in the receipts
- Difficult - Scalar value of the difficulty of the previous block
- Extra Data - 32 byte data relevant to this block
- Block Num - Scalar value of the number of ancestor blocks
- Gas Limit - Scalar value of current limit of gas usage per block
- Gas Used - Scalar value of the total gas spent on transactions in this block
- Mix Hash - 256-bit vaalue used with nonce to prove proof of work computation
- State Root - Keccak Hash of the root node of state trie(post-execution)
- Transaction Root - Keccak Hash of the root node of transaction trie
- Receipt Root - Keccak Hash of the root node of receipt trie

Let's see how these fields map to what is in the Geth client codebase. We'll look at the 'Header' struct definede in block.go which represents a block header.

We can see the values stated within the codebase match our conceptual diagram. Our goal is to get from the block header down to the storage of an individual contract.

To do so we need to focus on the "State Root" field of the block header highlightede in red.

# State Root
The 'State Root' acts like a merkle root in that it is a hash that is dependent on all the pieces of data that lie underneath it. If any piece of data changes the root will also change.

The data structure underneath the 'State Root' is a Merkle Patricia Trie which stores a key-value pair for every Ethereum account on the network, where the key is an ethereum address and the value is the Ethereum account object.  
In actuality the key is the hash of the Ethereum address and the value is the RLP encoded Ethereum account however we can ignore this for now.  
Below is the section of the 'Ethereum Architecture' diagram that represents thar Merkel Patricia Trie for the 'State Root'  
The Merkle Patricia Trie is a non trival data structure so we won't deep dive into it in this article. Instad we can instead keep the key value mapping model of address to Ethereum account.  
If you are interestede in the Merkle Patrcia Trie I recooment checking out this excellent introductory article. 
Next let's inspect the Ethereum account value that the Ethereum addresses are mapping to.  


