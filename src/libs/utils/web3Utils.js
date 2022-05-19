export const returnChainObject = (chainId) => {
    // eth mainnet & rinkeby is by default present in metamask
    const object = [];
    switch (chainId) {
        //bsc main
        case '0x38':
            object.push({
                chainId,
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed1.binance.org'],
                blockExplorerUrls: ['https://bscscan.com']
            });
            break;

        //bsc test
        case '0x61':
            object.push({
                chainId,
                chainName: "Binance Smart Chain Testnet",
                nativeCurrency: {
                name: "tBNB",
                symbol: "tBNB",
                decimals: 18,
                },
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
                blockExplorerUrls: ["https://testnet.bscscan.com"],
            });
            break;

        //polygon mainnet
        case '0x89':
            object.push({
                chainId,
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
            });
            break;

        //polygon testnet
        case '0x13881':
            object.push({
                chainId,
                chainName: 'Polygon Testnet Mumbai',
                nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                },
                rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
            });
            break;
    }

    return object;
}