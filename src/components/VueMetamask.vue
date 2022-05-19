<template>
  <div id="vue-metamask" />
</template>

<script>
import web3Interface from "@/libs/web3Interface";
import walletProviderStatusEnum from "@/libs/metamask/walletProviderStatusEnum";

export default {
  props: {
    userMessage: {
      type: String,
      default: "null",
    },
  },
  data() {
    return {
      web3: null,
      netID: null, // user metamask id
      MetaMaskAddress: null, // user Address
      currentStatus: walletProviderStatusEnum.UNINITIALIZED,
    };
  },
  methods: {
    emitEvent(currentMessage, currentStatus) {
      if (currentStatus === this.currentStatus) {
        return;
      }

      this.currentStatus = currentStatus;

      const message = this.userMessage === "null" ? currentMessage : this.userMessage;

      let eventCallback = "onError";
      if (this.currentStatus === walletProviderStatusEnum.ADDRESS_RETRIEVED) {
        eventCallback = "onComplete";
      }

      this.$emit(eventCallback, {
        web3: this.web3,
        type: this.currentStatus,
        metaMaskAddress: this.MetaMaskAddress,
        netID: this.netID,
        message: message,
      });
    },
  },
  async mounted() {

    const { web3Res, status } = await web3Interface.init();

    if (web3Res !== null) {
      this.netID = web3Res.netID;
      this.$store.dispatch('setUserPublicAddressNetID', this.netID);

      this.MetaMaskAddress = web3Res.MetaMaskAddress;
      this.$store.dispatch('setUserPublicAddress', this.MetaMaskAddress);

      this.web3 = web3Res.web3;
    }

    this.emitEvent(walletProviderStatusEnum.STATUS_DESCRIPTION[status], status);
  },
};
</script>

<style scoped>
#vue-metamask {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}
</style>
