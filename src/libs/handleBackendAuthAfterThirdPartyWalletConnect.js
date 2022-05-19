import apiCommunication from "@/libs/apiCommunication";
import {Notify} from "quasar";

export default {
    async validateBackendAuth(web3Provider, address) {
        let userData = null;
        try {
            let response = await apiCommunication.userMS.readUserByAddress(address);
            if (response?.data && response?.data['hydra:totalItems'] > 0 && response?.data['hydra:member'].length) {
                userData = response.data['hydra:member'][0];
            } else {
                let userResource = await apiCommunication.userMS.authorizeAddress(address);
                if (userResource?.data) {
                    userData = userResource.data;
                }
                else {
                    Notify.create({
                        message: "Something went wrong. Could not authorize address",
                        type: "negative"
                    });
                    return undefined;
                }
            }

            if (userData && userData?.nonce === '') {
                Notify.create({
                    message: "Something went wrong. Could not find message for sign",
                    type: "negative"
                });
                return undefined;
            }

            const signedResult = await web3Provider.eth.personal.sign(
                web3Provider.utils.fromUtf8(userData.nonce),
                address,
                function (err, signature) {
                    if (err) {
                        console.error(`Got ${err} when trying to sign`);
                        return err;
                    }
                    return signature;
                }
            );

            let verifySignature = await apiCommunication.userMS.validateSignature(address, signedResult);
            if (verifySignature?.data?.token) {
                let user = await apiCommunication.userMS.loadUser(verifySignature.data.token);
                if (user?.data) {
                    return user?.data;
                } else {
                    throw new Error("Payload with logged user from server is malformed");
                }
            } else {
                throw new Error("Payload with logged user from server is malformed");
            }
        } catch (e) {
            console.error(`Got an error when trying to authenticate`);
            console.log(e);
            Notify.create({
                message: "Something went wrong",
                type: "negative"
            });
            return undefined;
        }
    }
}
