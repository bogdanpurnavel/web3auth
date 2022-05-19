<template>
  <div v-if="authenticated">
    <q-btn @click="sendTransaction()">
      Send Transaction
    </q-btn>
  </div>
</template>

<script>
import web3Interface from "../libs/web3Interface";
import web3SwitchNetworkEnum from "../libs/web3SwitchNetworkEnum";


export default {
  name: "Home",
  computed: {
    authenticated() {
      return this.$store.state.authenticated;
    },
  },
  data() {
      return {
        abi: [
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "indexed": true,
                      "internalType": "bytes32",
                      "name": "previousAdminRole",
                      "type": "bytes32"
                  },
                  {
                      "indexed": true,
                      "internalType": "bytes32",
                      "name": "newAdminRole",
                      "type": "bytes32"
                  }
              ],
              "name": "RoleAdminChanged",
              "type": "event",
              "signature": "0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "indexed": true,
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                  },
                  {
                      "indexed": true,
                      "internalType": "address",
                      "name": "sender",
                      "type": "address"
                  }
              ],
              "name": "RoleGranted",
              "type": "event",
              "signature": "0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "indexed": true,
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                  },
                  {
                      "indexed": true,
                      "internalType": "address",
                      "name": "sender",
                      "type": "address"
                  }
              ],
              "name": "RoleRevoked",
              "type": "event",
              "signature": "0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  },
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "applicationId",
                      "type": "uint256"
                  }
              ],
              "name": "TaskApplicationAccepted",
              "type": "event",
              "signature": "0xa45a3f5d64f258a3d12b5bfd84e1d1dbc4dd53e3e027c58481b30bb1a96b3cc1"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  },
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "applicationId",
                      "type": "uint256"
                  },
                  {
                      "indexed": false,
                      "internalType": "address",
                      "name": "applicant",
                      "type": "address"
                  }
              ],
              "name": "TaskApplicationCreated",
              "type": "event",
              "signature": "0x9d968d3cecd0c8fd592e48b2bc902f4bff682e0bf7bddeb0e4a988507c957fed"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  }
              ],
              "name": "TaskCanceled",
              "type": "event",
              "signature": "0x1aa8a90c7d7a86bac690072d3f3d726bb8ebbe1989e158530440963f04c11eb2"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "string",
                      "name": "externalId",
                      "type": "string"
                  },
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  }
              ],
              "name": "TaskCreated",
              "type": "event",
              "signature": "0xed1d390c812a65783a09786b88b832ef75bb16882fbc56eeea9bf61a4c1a8ac7"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  },
                  {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "solutionId",
                      "type": "uint256"
                  }
              ],
              "name": "TaskSolutionAccepted",
              "type": "event",
              "signature": "0x074c7eacb2b34c78b4dec726c4b547bc8c3b501c30998fde36df5df75a88d892"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  },
                  {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "solutionId",
                      "type": "uint256"
                  }
              ],
              "name": "TaskSolutionRejected",
              "type": "event",
              "signature": "0xa1eeca6b9860adc44702f32b9423d2ab473e0f54d7dfff3793e0d295ce8c6ebe"
          },
          {
              "anonymous": false,
              "inputs": [
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  },
                  {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "applicationId",
                      "type": "uint256"
                  },
                  {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "solutionId",
                      "type": "uint256"
                  },
                  {
                      "indexed": false,
                      "internalType": "address",
                      "name": "applicant",
                      "type": "address"
                  }
              ],
              "name": "TaskSolutionSubmitted",
              "type": "event",
              "signature": "0xcfa2a50d267ea7f3fe512115758d6e3b05b54570867f0ca18f208c7a4776373c"
          },
          {
              "inputs": [],
              "name": "DEFAULT_ADMIN_ROLE",
              "outputs": [
                  {
                      "internalType": "bytes32",
                      "name": "",
                      "type": "bytes32"
                  }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true,
              "signature": "0xa217fddf"
          },
          {
              "inputs": [],
              "name": "OPERATOR_ROLE",
              "outputs": [
                  {
                      "internalType": "bytes32",
                      "name": "",
                      "type": "bytes32"
                  }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true,
              "signature": "0xf5b541a6"
          },
          {
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "owner",
                      "type": "address"
                  }
              ],
              "name": "__AccessLevel_init",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0xe4f052cf"
          },
          {
              "inputs": [
                  {
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  }
              ],
              "name": "getRoleAdmin",
              "outputs": [
                  {
                      "internalType": "bytes32",
                      "name": "",
                      "type": "bytes32"
                  }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true,
              "signature": "0x248a9ca3"
          },
          {
              "inputs": [
                  {
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                  }
              ],
              "name": "grantRole",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0x2f2ff15d"
          },
          {
              "inputs": [
                  {
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                  }
              ],
              "name": "hasRole",
              "outputs": [
                  {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                  }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true,
              "signature": "0x91d14854"
          },
          {
              "inputs": [
                  {
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                  }
              ],
              "name": "renounceRole",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0x36568abe"
          },
          {
              "inputs": [
                  {
                      "internalType": "bytes32",
                      "name": "role",
                      "type": "bytes32"
                  },
                  {
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                  }
              ],
              "name": "revokeRole",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0xd547741f"
          },
          {
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "from",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "to",
                      "type": "address"
                  },
                  {
                      "internalType": "contract IERC20Upgradeable",
                      "name": "token",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                  }
              ],
              "name": "sendERC20",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0x79a35b4b"
          },
          {
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "owner",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "taskStorage",
                      "type": "address"
                  }
              ],
              "name": "__TaskManager_init",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0x90e5d58a"
          },
          {
              "inputs": [],
              "name": "getFunctions",
              "outputs": [
                  {
                      "internalType": "bytes4[]",
                      "name": "",
                      "type": "bytes4[]"
                  }
              ],
              "stateMutability": "pure",
              "type": "function",
              "constant": true,
              "signature": "0x95648f1b"
          },
          {
              "inputs": [
                  {
                      "internalType": "bytes4",
                      "name": "interfaceId",
                      "type": "bytes4"
                  }
              ],
              "name": "supportsInterface",
              "outputs": [
                  {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                  }
              ],
              "stateMutability": "view",
              "type": "function",
              "constant": true,
              "signature": "0x01ffc9a7"
          },
          {
              "inputs": [
                  {
                      "components": [
                          {
                              "internalType": "string",
                              "name": "externalId",
                              "type": "string"
                          },
                          {
                              "internalType": "string",
                              "name": "taskDescriptionUri",
                              "type": "string"
                          },
                          {
                              "internalType": "string",
                              "name": "taskDescriptionHash",
                              "type": "string"
                          },
                          {
                              "internalType": "address",
                              "name": "tokenAddress",
                              "type": "address"
                          },
                          {
                              "internalType": "uint256",
                              "name": "amount",
                              "type": "uint256"
                          },
                          {
                              "internalType": "bool",
                              "name": "isHyveCommission",
                              "type": "bool"
                          },
                          {
                              "internalType": "uint256",
                              "name": "deadline",
                              "type": "uint256"
                          }
                      ],
                      "internalType": "struct TaskManager.TaskCreationParams",
                      "name": "taskParams",
                      "type": "tuple"
                  },
                  {
                      "internalType": "address",
                      "name": "applicant",
                      "type": "address"
                  }
              ],
              "name": "createTask",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function",
              "payable": true,
              "signature": "0xc20799e9"
          },
          {
              "inputs": [
                  {
                      "internalType": "uint256",
                      "name": "taskId",
                      "type": "uint256"
                  }
              ],
              "name": "cancelTask",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0x7eec20a8"
          },
          {
              "inputs": [
                  {
                      "internalType": "uint256",
                      "name": "applicationId",
                      "type": "uint256"
                  },
                  {
                      "internalType": "string",
                      "name": "solutionUri",
                      "type": "string"
                  },
                  {
                      "internalType": "string",
                      "name": "solutionHash",
                      "type": "string"
                  }
              ],
              "name": "submitTaskSolution",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0x779bdd17"
          },
          {
              "inputs": [
                  {
                      "internalType": "uint256",
                      "name": "solutionId",
                      "type": "uint256"
                  }
              ],
              "name": "acceptTaskSolution",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0xf20122ae"
          },
          {
              "inputs": [
                  {
                      "internalType": "uint256",
                      "name": "solutionId",
                      "type": "uint256"
                  },
                  {
                      "internalType": "string",
                      "name": "reason",
                      "type": "string"
                  }
              ],
              "name": "rejectTaskSolution",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
              "signature": "0xdc485619"
          }
        ],
        routerAddress: '0x9998832CFD39ab7a04a8709ba4f707A7dA945Ab7'
      };
    },
  methods: {
    async sendTransaction() {
      const { web3Res } = await web3Interface.init();
      const chain = {
          "name": "BSC-Testnet",
          "rpcUrl": "https://data-seed-prebsc-1-s1.binance.org:8545/",
          "chainId": "97",
          "symbol": null,
          "explorerUrl": null,
      }

      const sendObj = {from: web3Res.MetaMaskAddress, value: 207000000000000};

      const payload = [
          "1ecd774d-f24a-6b84-aac7-35781543e6eb",
          "https://localhost/tasks/1ecd774d-f24a-6b84-aac7-35781543e6eb/blockchain_data",
          "0x7e3eb708f447bf80c0f9330fefa72066113e27cd9154eb9278f34af01e613c8f",
          "0x0000000000000000000000000000000000000000",
          "200000000000000",
          false,
          1671622248
      ]

      const applicantId = '0xCf7be84148Db4Ff426f57e229bAc513ba656894c';

      const { switchStatus, switchError } = await web3Interface.switchToCorrectChainIfNeeded(chain.chainId, chain.name);

      if (switchStatus === web3SwitchNetworkEnum.ERROR_OCCURRED) {
        alert('could not switch chain');
        return;
      }


      // need at leat 0,0002 tBNB on the address which calls this contract
      // you can get some tBNB on https://testnet.binance.org/faucet-smart
      let contract = await new web3Res.web3.eth.Contract(this.abi, this.routerAddress);
      await contract.methods.createTask(payload, applicantId).send(sendObj);
    }
  }
};
</script>

<style lang="scss">
</style>