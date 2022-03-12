
## 1. token可动态增发 
[contract_code](../project_code/contracts/shenstone.sol)  
调用mint函数，增发给owner  
---
调用前  
![before](./images/before.png)
---
调用后  
![after](./images/after.png)
---
交易event日志   
![mintEvent](./images/mintEvent.png)
---
## 2. 通过ether.js转账  
[transfer_code](../project_code/scripts/transfer.js)  
转账event日志  
![transferEvent](./images/transfer.png)
---
## 3. deposit 存款    
[contract_code](../project_code/contracts/vault.sol)  
approve记录  
![approve](./images/approve.png)
---
deposit event日志  
![deposit](./images/depositEvent.png)
---

## 4. withdraw 取款 
取款前，vault账户5sp  
![before](./images/withBefore.png)
---
取款中，取4个sp  
![ing](./images/4.png)
---
取款后，vault账户1sp  
![after](./images/withAfter.png)
---
## 5. 前端显示存款  
[front-end_code](../project_code/vue_project/components/erc20.vue)
![vault](./images/vault.png)

