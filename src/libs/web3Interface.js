import Web3 from "web3";

import coinGeneralInfoService from "@/libs/coinInfo/coinGeneralInfoService";
import web3SwitchNetworkEnum from "@/libs/web3SwitchNetworkEnum";
import store from "@/store";
import walletProviderStatusEnum from "@/libs/metamask/walletProviderStatusEnum";
import detectEthereumProvider from "@metamask/detect-provider";

function validateWeb3Instance(web3Instance) {
    if (web3Instance === null || typeof web3Instance === "undefined") {
        return computeResponse(null, walletProviderStatusEnum.NO_INSTALL_METAMASK);
    } else {
        return computeResponse(web3Instance, null);
    }
}

async function attemptToGetWeb3Instance() {
    try {
        const web3AuthWalletProvider = store.getters.web3AuthWalletProvider;
        if (web3AuthWalletProvider) {
            window.web3 = new Web3(web3AuthWalletProvider);
            return validateWeb3Instance(window.web3);
        }

        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();
                return validateWeb3Instance(window.web3);
            } catch (error) {
                console.warn("(!) web3Interface: Got \"" + error + "\" when calling window.ethereum.enable()");
                return computeResponse(null, walletProviderStatusEnum.USER_DENIED_ACCOUNT_AUTHORIZATION);
            }
        }

        if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            return validateWeb3Instance(window.web3);
        }

        return computeResponse(null, walletProviderStatusEnum.NO_INSTALL_METAMASK);
    } catch (error) {
        console.warn("(!) web3Interface: Got \"" + error + "\" when calling attemptToGetWeb3Instance()");
        return computeResponse(null, walletProviderStatusEnum.NETWORK_ERROR);
    }
}

function computeResponse(instance, status) {
    return { web3Res: instance, status: status };
}

async function getCurrentWalletProviderInternal() {
    const web3AuthWalletProvider = store.getters.web3AuthWalletProvider;
    if (web3AuthWalletProvider) {
        console.log("Detected web3 wallet provider");
        return web3AuthWalletProvider;
    }

    let metamaskWalletProvider;
    try {
        console.log("Detected metamask wallet provider");
        metamaskWalletProvider = await detectEthereumProvider({ mustBeMetaMask: true });
    } catch (e) {
        console.log(`Got ${e} when trying to detect metamask wallet provider`);
    }

    if (metamaskWalletProvider) {
       return metamaskWalletProvider;
    }

    const { web3Res, status } = await attemptToGetWeb3Instance();
    if (web3Res !== null) {
        return web3Res.currentProvider;
    } else {
        console.log(`Got ${status} when called attemptToGetWeb3Instance() from getCurrentWalletProvider())`);
        return null;
    }
}

async function isCorrectChainSelected(chainId, walletProvider) {
    const web3 = new Web3(walletProvider);
    const currentChainId = await web3.eth.getChainId();
    return (currentChainId == chainId);
}

async function checkIfWalletProviderIsValidAndCorrectChainIsSelected(chainId) {
    const responseObject = {
        isCurrentChain: false,
        currentWalletProvider: null,
        error: ''
    }

    const currentWalletProvider = await getCurrentWalletProviderInternal();
    if (!currentWalletProvider) {
        responseObject.error = "Could not connect to the network";
        return responseObject;
    }

    responseObject.currentWalletProvider = currentWalletProvider;
    responseObject.isCurrentChain = await isCorrectChainSelected(chainId, currentWalletProvider);

    return responseObject;
}

export default {
    web3: null,
    MetaMaskAddress: "",
    netID: 0,

    async init() {
        let { web3Res, status } = await attemptToGetWeb3Instance();
        if (web3Res === null) {
            return computeResponse(null, status);
        }

        this.web3 = web3Res;

        let getAccountsStatus = false;
        await this.web3.eth.getAccounts((err, accounts) => {
            if (err !== null) {
                status = walletProviderStatusEnum.NETWORK_ERROR;
                console.warn("(!) web3Interface: Got " + err + " when trying to getAccounts");
            } else if (accounts.length === 0) {
                status = walletProviderStatusEnum.NO_LOGIN;
                console.warn("(!) web3Interface: Got 0 accounts when trying to getAccounts");
            } else {
                this.MetaMaskAddress = accounts[0]; // user Address
                getAccountsStatus = true;
            }
        });

        if (getAccountsStatus === false) {
            return computeResponse(null, status);
        }

        this.netID = this.web3.currentProvider.networkVersion;

        status = walletProviderStatusEnum.ADDRESS_RETRIEVED;
        return computeResponse(this, status);
    },

    async switchToCorrectChainIfNeeded(chainId, chainName) {

        const responseObject = {
            switchStatus: web3SwitchNetworkEnum.ERROR_OCCURRED,
            switchError: ""
        };

        let { isCurrentChain, currentWalletProvider, error } = await checkIfWalletProviderIsValidAndCorrectChainIsSelected(chainId);
        if (currentWalletProvider === null) {
            responseObject.switchError = "Could not connect to the network";
            console.log(`Got ${error} when calling checkIfWalletProviderIsValidAndCorrectChainIsSelected(${chainId})`);
            return responseObject;
        }

        if (isCurrentChain === true) {
            responseObject.switchStatus = web3SwitchNetworkEnum.ALREADY_CORRECT_CHAIN;
            return responseObject;
        }

        const hexChainId = "0x" + parseInt(chainId).toString(16);

        try {
            await currentWalletProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexChainId }],
            });
            responseObject.switchStatus = web3SwitchNetworkEnum.SWITCHED_CHAIN;
        } catch (switchError) {
            const shouldAddChain = switchError.code === 4902 // This error code indicates that the chain has not been added to MetaMask.
                                 || (switchError.message && switchError.message.indexOf("is not supported, please add chainConfig for it") !== -1); // web3 auth library indicating that you must add the new chain
            if (shouldAddChain) {
                try {
                    const chainObject = coinGeneralInfoService.getChainObjectForAddEthereumChainMethod(parseInt(chainId));
                    await currentWalletProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [chainObject],
                    });

                    const web3AuthWalletProvider = store.getters.web3AuthWalletProvider;

                    if(web3AuthWalletProvider) {
                        await currentWalletProvider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: hexChainId }],
                        });
                    }

                    const { isCurrentChain } = await checkIfWalletProviderIsValidAndCorrectChainIsSelected(parseInt(chainId));

                    if (isCurrentChain) {
                        responseObject.switchStatus = web3SwitchNetworkEnum.SWITCHED_CHAIN;
                    } else {
                        responseObject.switchError = `The request was rejected. You must switch to ${chainName} chain.`
                    }
                } catch (addError) {
                    if (addError.code === 4001) {
                        responseObject.switchError = `The request was rejected. You must add ${chainName} chain.`;
                    } else {
                        responseObject.switchError = `Something went wrong when trying to add ${chainName} to your wallet.`
                    }
                }
            } else if (switchError.code === 4001) {
                responseObject.switchError = `The request was rejected. You must switch to the ${chainName} chain in your wallet.`;
            } else {
                responseObject.switchError = `Something went wrong when trying to switch to the ${chainName} chain in your wallet.`;
            }
        }

        return responseObject;
    },

    async getWalletProvider() {
        return await getCurrentWalletProviderInternal();
    }
};
