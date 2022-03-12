
## token可动态增发
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
## 通过ether.js转账
转账event日志
![transferEvent](./images/transfer.png)
---
## deposit 存款
approve记录
![approve](./images/approve.png)
---
deposit event日志
![deposit](./images/depositEvent.png)
---

## withdraw 取款
取款前，vault账户5sp
![before](./images/withBefore.png)
---
取款中，取4个sp
![ing](./images/4.png)
---
取款后，vault账户1sp
![after](./images/withAfter.png)
---
## 前端显示存款
![vault](./images/vault.png)

