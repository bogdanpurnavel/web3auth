import coins from "./coin";

const convertFromServerNamingToStorageNaming = {
    // mainnet
    "Ethereum": "Ethereum Mainnet",
    "Polygon": "Polygon Mainnet",
    "BSC": "Binance Smart Chain Mainnet",

    // testnet
    "Rinkeby": "Ethereum Testnet Rinkeby",
    "Mumbai": "Polygon Testnet Mumbai",
    "BSC-Testnet": "Binance Smart Chain Testnet"
};

export default {

    isStableCoinByCode(coinCode) {
        return coinCode === "ETH"
            || coinCode === "BNB"
            || coinCode === "MATIC";
    },

    getChainId(blockchainServerNaming) {
        const storageName = convertFromServerNamingToStorageNaming[blockchainServerNaming];
        if (storageName === undefined) {
            console.warn("(!) coinGeneralInfoService: Undefined storage naming for " + blockchainServerNaming);
            return undefined;
        }

        const foundCoin = coins.coinArray.find(a => a.name === storageName);
        if (foundCoin === undefined) {
            console.warn("(!) coinGeneralInfoService: Coin " + storageName + " not found");
            return undefined;
        }

        return foundCoin.chainId;
    },

    getChainIdHexStr(blockchainServerNaming) {
        const chainId = this.getChainId(blockchainServerNaming);
        if (chainId === undefined) {
            return undefined;
        }
        return "0x" + chainId.toString(16);
    },

    getChainObjectForAddEthereumChainMethod(chainId) {
        const coin = coins.coinArray.find(a => a.chainId === chainId);

        if (coin === undefined) {
            console.warn("(!) coinGeneralInfoService: Coin with chainId" + chainId + " not found");
            return undefined;
        }

        const chainIdHex = "0x" + coin.chainId.toString(16);

        let rpcUrls = [];
        if (coin.rpc.length > 0) {
            rpcUrls.push(coin.rpc[0]);
        }

        const nativeCurrency = coin.nativeCurrency;

        let blockExplorerUrls = [];
        if (coin.explorers.length > 0) {
            blockExplorerUrls.push(coin.explorers[0].url);
        }

        return {
            chainId: chainIdHex,
            chainName: coin.name,
            nativeCurrency,
            rpcUrls,
            blockExplorerUrls
        };
    }
};
