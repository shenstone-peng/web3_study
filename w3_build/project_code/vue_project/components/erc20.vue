<script>
import { ethers } from 'ethers'

import erc20Addr from '../../../deployments/dev/dev-shenstone.json'
import erc20Abi from '../../../deployments/abi/shenstone.json'

import bankAddr from '../../../deployments/dev/dev-vault.json'
import bankAbi from '../../../deployments/abi/vault.json'

import { premitTypedDate } from "../typedData.js";

export default {

  name: 'erc20-my',

  data() {
    return {

      recipient: null,
      amount: null,
      balance: null,
      vault_balance: null,

      name: null,
      decimal: null,
      symbol: null,
      supply: null,
      depositAmount: null,
      withdrawAmount: null,
      stakeAmount: null,

    }
  },

  async created() {
    await this.initAccount()
    this.initContract()
    this.getInfo();
    this.getNonce();
  },

  methods: {
    async initAccount(){
      if(window.ethereum) {
        console.log("initAccount");
        try{
          this.accounts = await window.ethereum.enable()
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          this.currProvider = window.ethereum;
          this.provider = new ethers.providers.Web3Provider(window.ethereum);

          this.signer = this.provider.getSigner()
          let network = await this.provider.getNetwork()
          this.chainId = network.chainId;
          console.log("chainId:", this.chainId);

        } catch(error){
          console.log("User denied account access", error)
        }
      }else{
        console.log("Need install MetaMask")
      }
    },

    async initContract() {
        console.log("erc20addr.address:%s", erc20Addr.address);
      this.erc20Token = new ethers.Contract(erc20Addr.address, 
        erc20Abi, this.signer);
      
      console.log("bankAddr.address:%s", bankAddr.address);
      this.bank = new ethers.Contract(bankAddr.address, 
        bankAbi, this.signer);

    }, 

    getInfo() {
      this.erc20Token.name().then((r) => {
        this.name = r;
      })
      //console.log("name:%s",this.erc20Token.name());
      this.erc20Token.decimals().then((r) => {
        this.decimal = r;
      })
      this.erc20Token.symbol().then((r) => {
        this.symbol = r;
      })
      this.erc20Token.totalSupply().then((r) => {
        this.supply = ethers.utils.formatUnits(r, 18);
      })

      this.erc20Token.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18);
      })

      this.bank.deposited(this.account).then((r) => {
        this.vault_balance = ethers.utils.formatUnits(r, 18);
      })
      //console.log("balance:%s",this.balance);
      
    },

    getNonce() {
      this.erc20Token.nonces(this.account).then(r => {
        this.nonce = r.toString();
        console.log("nonce:" + this.nonce);
      })
    },

    transfer() {
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.erc20Token.transfer(this.recipient, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.getInfo();
      })
    },
    approve(){
      let amount = ethers.utils.parseUnits(this.approveAmount).toString();
      this.erc20Token.approve(bankAddr.address, amount);
    },
    deposit(){
      let amount = ethers.utils.parseUnits(this.depositAmount).toString();
      console.log("amount:",amount);
      this.bank.deposit(this.account, amount,{
                from: this.account
              }).then(() => {
                this.getInfo();
                this.getNonce();
            });
    },
    withdraw(){
      let amount = ethers.utils.parseUnits(this.withdrawAmount).toString();
      this.bank.withdraw(amount, {
                from: this.account
              }).then(() => {
                this.getInfo();
                this.getNonce();
            });
    },
    permitStake() {
      this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);
      
      let amount =  ethers.utils.parseUnits(this.stakeAmount).toString();
      

      let msgParams = premitTypedDate("ERC20", 
        erc20Addr.address,
        this.account, bankAddr.address, amount, this.deadline, this.chainId, this.nonce);
      
      console.log("msgParams:" + msgParams)

      this.currProvider.sendAsync({
        method: 'eth_signTypedData_v4',
        params: [this.account, msgParams],
        from: this.account
      }, (err, sign) => {
        this.sign = sign.result;
        console.log(this.sign)

        //  椭圆曲线签名签名的值:
        // r = 签名的前 32 字节
        // s = 签名的第2个32 字节
        // v = 签名的最后一个字节

        let r = '0x' + this.sign.substring(2).substring(0, 64);
        let s = '0x' + this.sign.substring(2).substring(64, 128);
        let v = '0x' + this.sign.substring(2).substring(128, 130);

        this.bank.permitDeposit(this.account, amount, this.deadline, v, r, s, {
                from: this.account
              }).then(() => {
                this.getInfo();
                this.getNonce();
            })
      });
    }
  }
}


</script>

<template>
  <div >

      <div>
        <br /> Token名称 : {{ name  }}
        <br /> Token符号 : {{  symbol }}
        <br /> Token精度 : {{  decimal }}
        <br /> Token发行量 : {{  supply }}
        <br /> 我的余额 : {{ balance  }}
        <br /> 我的存款 : {{ vault_balance }}
      </div>

      <div style = "display:none" >
        <br />转账到:
        <input type="text" v-model="recipient" />
        <br />转账金额
        <input type="text" v-model="amount" />
        <br />
        <button @click="transfer()"> 转账 </button>
      </div>
    <div>
      <input v-model="approveAmount" placeholder="授权数量"/>
      <button @click="approve">授权</button>
    </div>
    <div>
      <input v-model="depositAmount" placeholder="输入存款"/>
      <button @click="deposit">进行存款</button>
    </div>
    <div>
      <input v-model="withdrawAmount" placeholder="输入取款"/>
      <button @click="withdraw">进行取款</button>
    </div>
    <div style = "display:none">
      <input v-model="stakeAmount" placeholder="输入质押量"/>
      <button @click="permitStake">离线授权存款</button>
    </div>

  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

div {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>