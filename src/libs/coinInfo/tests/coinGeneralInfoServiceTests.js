import coinGeneralInfoService from "../coinGeneralInfoService.js";
import * as assert from "assert";

assert.equal(coinGeneralInfoService.getChainId("Ethereum"), 1);
assert.equal(coinGeneralInfoService.getChainId("Polygon"), 137);
assert.equal(coinGeneralInfoService.getChainId("BSC"), 56);
assert.equal(coinGeneralInfoService.getChainId("Rinkeby"), 4);
assert.equal(coinGeneralInfoService.getChainId("Mumbai"), 80001);
assert.equal(coinGeneralInfoService.getChainId("BSC-Testnet"), 97);
assert.equal(coinGeneralInfoService.getChainId("blabla"), undefined);

assert.equal(coinGeneralInfoService.getChainIdHexStr("Ethereum"), "0x1");
assert.equal(coinGeneralInfoService.getChainIdHexStr("Polygon"), "0x89");
assert.equal(coinGeneralInfoService.getChainIdHexStr("BSC"), "0x38");
assert.equal(coinGeneralInfoService.getChainIdHexStr("Rinkeby"), "0x4");
assert.equal(coinGeneralInfoService.getChainIdHexStr("Mumbai"), "0x13881");
assert.equal(coinGeneralInfoService.getChainIdHexStr("BSC-Testnet"), "0x61");
assert.equal(coinGeneralInfoService.getChainIdHexStr("blabla"), undefined);

const binanceSmartChainObExpected = {
    chainId: '0x38',
    name: 'Binance Smart Chain Mainnet',
    nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'BNB', decimals: 18 },
    rpcUrls: [ 'https://bsc-dataseed1.binance.org' ],
    blockExplorerUrls: [ 'https://bscscan.com' ]
};

const binanceSmartChainObResult = coinGeneralInfoService.getChainObjectForAddEthereumChainMethod(56);

console.log(binanceSmartChainObExpected.toString());
console.log(binanceSmartChainObResult.toString());

assert.equal(binanceSmartChainObResult.toString(), binanceSmartChainObExpected.toString());
