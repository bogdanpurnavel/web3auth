<template>
  <div style="display: none" />
</template>

<script>

import {ADAPTER_STATUS, CHAIN_NAMESPACES} from "@web3auth/base";
import {Web3Auth} from "@web3auth/web3auth";
import Web3 from "web3";

export default {
  name: "Web3AuthAuthentication",
  props: {
    uiConfig: {
      type: Object,
      default: () => ({
        theme: "dark",
        logoUrl: "https://app.hyve.works/img/logo.31465325.svg",
      }),
    },
  },
  data() {
    return {
      defaultClientId: "BCtbnOamqh0cJFEUYA0NB5YkvBECZ3HLZsKfvSRBvew2EiiKW3UxpyQASSR0artjQkiUOCHeZ_ZeygXpYpxZjOs"
    };
  },
  components: {
  },
  created(){
    console.log('lol?');
  },
  async mounted() {
    const routeOb = this.$route;
    const queryData = routeOb.query.data;
    const shouldLogout = (queryData === 'logout');
    if (shouldLogout) {
      await this.logout();
    } else {
      await this.login();
    }
  },
  methods: {
    notifyToast(message, type) {
      this.$q.notify({
        message: message,
        type: type
      });
    },
    async logout() {
      try {
        this.$store.dispatch('setWeb3AuthWalletProvider', null);
        const web3Auth = new Web3Auth({
          uiConfig: { appLogo: this.uiConfig.logoUrl, theme: this.uiConfig.theme },
          chainConfig: { chainNamespace: CHAIN_NAMESPACES.EIP155 },
          clientId: this.defaultClientId,
        });
        await web3Auth.initModal({});
        await web3Auth.logout();
        // eslint-disable-next-line no-empty
      } catch (e) {
      }
    },
    async login() {
      let web3Auth = null;
      let hasErrorOnInit = false;
      try {
        web3Auth = new Web3Auth({
          uiConfig: { appLogo: this.uiConfig.logoUrl, theme: this.uiConfig.theme },
          chainConfig: { chainNamespace: CHAIN_NAMESPACES.EIP155 },
          clientId: this.defaultClientId,
        });
        this.subscribeAuthEvents(web3Auth);
        await web3Auth.initModal({});
      } catch (error) {
        hasErrorOnInit = true;
        console.log(`Got ${error} when initializing web3Auth`);
      }

      if (web3Auth && !hasErrorOnInit) {
        await web3Auth.connect();
      } else {
        this.notifyToast("Something went wrong", "negative");
      }
    },
    subscribeAuthEvents(web3auth) {
      web3auth.on(ADAPTER_STATUS.CONNECTED, async () => {
        const provider = web3auth.provider;
        const web3Interface = new Web3(provider);
        const accounts = await web3Interface.eth.getAccounts();
        if (accounts.length === 0) {
          this.notifyToast("Something went wrong", "negative");
          console.error("No accounts provided after successful login with openLogin");
          return;
        }

        this.$store.dispatch('authenticationSuccess');
        this.$store.dispatch('closeAuth');
        this.$store.dispatch('setWeb3AuthWalletProvider', provider);
        await this.$router.push('/');
      });
    }
  },
};
</script>

<style>

/* Hide email section */
#w3a-modal .w3a-group:not(.w3a-group--hidden):not(:last-child),
#w3a-modal .w3a-group:not(.w3a-group--social-hidden):not(:last-child),
#w3a-modal .w3a-group:not(.w3a-group--email-hidden):not(:last-child),
#w3a-modal .w3a-group:not(.w3a-group--ext-wallet-hidden):not(:last-child) {
  margin-bottom: 0;
  border-bottom: 0;
}

.w3a-group--email {
  display: none;
}

.w3ajs-email-passwordless {
  display: none;
}

/* Hide external wallet section */
.w3ajs-external-wallet {
  display: none;
}

/* Hide footer section */
.w3a-modal__footer {
  display: none;
}

/* Hide powered by Web3Auth spinner */
.w3a-spinner-power {
  display: none;
}

.w3a-adapter-list .w3a-adapter-item:nth-child(5) {
  display: none;
}

.w3a-adapter-list .w3a-adapter-item:nth-child(8) {
  display: none;
}

.w3a-adapter-list .w3a-adapter-item:nth-child(12) {
  display: none;
}

</style>
