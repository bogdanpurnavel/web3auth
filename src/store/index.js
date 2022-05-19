import Vuex from "vuex";
import {Cookies} from "quasar";

const store = new Vuex.Store({
    state: {
        amountNumberOfDecimals: 4,
        openAuthPanel: false,
        openAuthPanelMessage: "",
        authenticated: false,
        userPublicAddress: null,
        userPublicAddressNetID: null,
        web3AuthWalletProvider: null
    },
    mutations: {
        authenticationSuccess(state) {
            state.authenticated = true;
        },
        deauthenticate(state) {
            state.authenticated = false;
        },
        openAuth(state) {
            state.openAuthPanel = true;
        },
        openAuthMesage(state, message) {
            state.openAuthPanelMessage = message;
        },
        setAuthMessage(state, message){
            state.openAuthPanelMessage = message;
        },
        closeAuth(state) {
            state.openAuthPanel = false;
        },
        setUserPublicAddress(state, address) {
            state.userPublicAddress = address;
        },
        setUserPublicAddressNetID(state, netID) {
            state.userPublicAddressNetID = netID;
        },
        setWeb3AuthWalletProvider(state, web3AuthWalletProvider) {
            state.web3AuthWalletProvider = web3AuthWalletProvider;
        }
    },
    actions: {
       
        deauthenticate(context){
            Cookies.remove("authenticated");
            context.commit("deauthenticate");
        },
        setUserPublicAddress(context,metaMaskAddress){
            context.commit("setUserPublicAddress",metaMaskAddress);
        },
        setUserPublicAddressNetID(context,netID){
            context.commit("setUserPublicAddressNetID",netID);
        },
        openAuthDialog(context){
            context.commit("openAuth");
        },
        openAuthDialogWithMessage(context, message){
            context.commit("setAuthMessage", message);
            context.commit("openAuth");
        },
        closeAuthDialog(context){
            context.commit("setAuthMessage", "");
            context.commit("closeAuth");
        },
        authenticationSuccess(context){
            Cookies.set("authenticated",true);
            context.commit("authenticationSuccess");
        },
        closeAuth(context){
            context.commit("closeAuth");
        },
        setWeb3AuthWalletProvider(context, web3AuthWalletProvider){
            context.commit("setWeb3AuthWalletProvider", web3AuthWalletProvider);
        },
    },
    getters: {
        authenticated(state) {
            return state.authenticated;
        },
        web3AuthWalletProvider: (state) => {
            return state.web3AuthWalletProvider;
        }
    },
    modules: {},
});

export default store;
