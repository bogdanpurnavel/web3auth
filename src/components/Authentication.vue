<template>
  <q-dialog
    v-model="openPanel"
    class="auth-card__container"
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card class="auth-container">
      <div class="auth-card__header d-flex justify-center items-center q-py-lg">
        <div class="goth-medium">
          LOGIN
        </div>
      </div>
      <div class="auth-options d-flex column q-px-xl q-py-lg">
        <div class="auth-welcome q-px-md q-mt-md">
          <div
            v-if="vuexOpenPanelMessage!==''"
            class="goth-medium fs-5 text-center q-mb-lg"
          >
            {{ vuexOpenPanelMessage }}
          </div>
          <div
            v-else
            class="goth-medium fs-5 text-center q-mb-lg"
          >
            Ready to start your journey?
          </div>
          <div class="goth-book fs-2_5 text-center">
            You're now connecting to Ethereum and the Decentralized Web
          </div>
        </div>
        <div class="option-selector q-mt-lg q-px-md">
          <div
            v-if="!metamask_install && !metamask_installed"
            class="d-block cursor-pointer no-underline option-hover"
            @click="metaMaskInit"
          >
            <div class="option cursor-pointer d-flex q-mx-auto items-center q-my-md">
              <q-avatar
                class="q-ml-md"
                square
              >
                <img
                  src="../assets/meta-mask_logo.svg"
                  alt="Meta Mask logo"
                >
              </q-avatar>
              <div class="q-ml-xl column">
                <div class="goth-medium fs-2">
                  Authorize with MetaMask
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="metamask_install"
            class="d-block cursor-pointer no-underline option-hover"
            @click="metaMaskInstall"
          >
            <div class="option cursor-pointer d-flex q-mx-auto items-center q-my-md">
              <q-avatar
                class="q-ml-md"
                square
              >
                <img
                  src="../assets/meta-mask_logo.svg"
                  alt="Meta Mask logo"
                >
              </q-avatar>
              <div class="q-ml-xl column">
                <div class="goth-medium fs-2">
                  Install MetaMask
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="metamask_installed"
            class="d-block cursor-pointer no-underline option-hover"
            @click="metaMaskPostInstallRefresh"
          >
            <div class="option cursor-pointer d-flex q-mx-auto items-center q-my-md">
              <q-avatar
                class="q-ml-md"
                square
              >
                <img
                  src="../assets/meta-mask_logo.svg"
                  alt="Meta Mask logo"
                >
              </q-avatar>
              <div class="q-ml-xl column">
                <div class="goth-medium fs-2">
                  Click to refresh the page to enable MetaMask integration
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="metamask_init && metamask_authorization_fail"
            class="option not-active d-flex row q-mx-auto items-center q-my-md"
          >
            <div class="q-ml-xl column">
              <div class="goth-medium fs-2">
                MetaMask authorization is required
              </div>
            </div>
          </div>
          <div
            class="option cursor-pointer option-hover d-flex row q-mx-auto items-center q-my-md"
            @click="socialMediaLoginWeb3Auth"
          >
            <div class="q-ml-xl column">
              <div class="goth-medium fs-2">
                Authorize with Social Media
              </div>
            </div>
          </div>
        </div>

        <Metamask
          v-if="metamask_init"
          user-message="Test message"
          @onError="metaMaskError"
          @onComplete="metaMaskCompleteResult"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import {Cookies} from 'quasar';
import walletProviderStatusEnum from "@/libs/metamask/walletProviderStatusEnum";

export default {
  name: "Authentication",
  data() {
    return {
      openPanel: false,
      openPanelMessage: "",
      metamask_init: false,
      metamask_install: false,
      metamask_installed: false,
      metamask_authorization_fail: false,
      web3Interface: null,
    };
  },
  computed: {
    vuexOpenState() {
      return this.$store.state.openAuthPanel;
    },
    vuexOpenPanelMessage() {
      return this.$store.state.openAuthPanelMessage;
    }
  },
  watch: {
    vuexOpenState: function (newValue) {
      this.openPanel = newValue;
    },
    vuexOpenPanelMessage(newValue) {
      this.openPanelMessage = newValue;
    },
    openPanel: function (newValue) {
      if (newValue === false) {
        this.$store.dispatch("closeAuthDialog");
        this.metamask_init = false;
        this.metamask_install = false;
      }
    }
  },
  mounted() {
    const isLoggedIn = this.$store.state.authenticated;
    const installedMetamaskCookie = Cookies.get("installedMetaMask");
    if (installedMetamaskCookie === "installOpened" && !isLoggedIn) {
      this.openPanel = true;
    }
  },
  methods: {
    metaMaskInit() {
      this.metamask_init = true;
      this.metamask_authorization_fail = false;
    },
    metaMaskInstall() {
      let url = "https://metamask.io/download.html";
      this.metamask_init = false;
      this.metamask_install = false;
      this.metamask_installed = true;
      Cookies.set("installedMetaMask", "installOpened", {expires: 1});
      window.open(url);
    },
    metaMaskPostInstallRefresh() {
      location.reload();
    },
    metaMaskError(result) {
      if (result.type === walletProviderStatusEnum.NO_INSTALL_METAMASK) {
        this.metamask_init = false;
        this.metamask_install = true;
      } else if (result.type === walletProviderStatusEnum.USER_DENIED_ACCOUNT_AUTHORIZATION) {
        this.metamask_init = false;
        this.metamask_install = false;
        this.metamask_authorization_fail = true;
      } else if (result.type === walletProviderStatusEnum.NO_LOGIN) {
        this.metamask_init = false;
        this.metamask_install = false;
      } else if (result.type === walletProviderStatusEnum.NETWORK_ERROR) {
        this.metamask_init = false;
      }
    },
    async metaMaskCompleteResult(result) {
      if (result.type === walletProviderStatusEnum.ADDRESS_RETRIEVED) {
        this.metamask_init = false;
        // let web3Interface = result.web3;
        // let address = this.$store.state.userPublicAddress;

        this.$store.dispatch('authenticationSuccess');
        this.$store.dispatch('closeAuth');
        await this.$router.push('/');
      }
    },
    async socialMediaLoginWeb3Auth() {
      await this.$router.push('/');
      await this.$router.push('/web3-auth');
    },
  }
};
</script>

<style scoped lang="scss">
.q-card.auth-container {
  background-color: #4848FF;
  margin-top: 40px;
  min-width: 657px;
  overflow: visible;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;

  .auth-card__header {
    font-size: 2.438rem;
    color: #fff;
    -webkit-box-shadow: 0 1px 5px 1px rgb(9 17 53 / 10%), 0 2px 2px -2px rgb(9 17 53 / 5%), 0 3px 1px -2px rgb(9 17 53 / 5%);
    -moz-box-shadow: 0 1px 5px 1px rgb(9 17 53 / 10%), 0 2px 2px -2px rgb(9 17 53 / 5%), 0 3px 1px -2px rgb(9 17 53 / 5%);
    box-shadow: 0 1px 5px 1px rgb(9 17 53 / 10%), 0 2px 2px -2px rgb(9 17 53 / 5%), 0 3px 1px -2px rgb(9 17 53 / 5%);
  }

  .auth-options {
    background-color: #F6F5FF;
  }

  .option-selector {
    .option-hover:hover {
      .option {
        opacity: 0.9;
        -webkit-transition: ease-in 150ms;
        -moz-transition: ease-in 150ms;
        -ms-transition: ease-in 150ms;
        -o-transition: ease-in 150ms;
        transition: ease-in 150ms;
      }
    }

    .option {
      color: #091135;
      background-color: #EAE9FF;
      border-radius: 12px;
      padding: 12px;
      max-width: 504px;
      -webkit-transition: ease-out 150ms;
      -moz-transition: ease-out 150ms;
      -ms-transition: ease-out 150ms;
      -o-transition: ease-out 150ms;
      transition: ease-out 150ms;

      &.not-active {
        opacity: 0.5;
      }
    }
  }

  .auth-disclaimer {
    max-width: 504px;
  }
}
</style>
