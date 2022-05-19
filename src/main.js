import {createApp}                from "vue";
import axios                      from "axios";
import VueAxios                   from "vue-axios";
import { Quasar}           from "quasar";
import App                        from "./App.vue";
import router                     from "./router";
import store                      from "./store";
import quasarUserOptions          from "./quasar-user-options";
import Authentication             from "./components/Authentication";
import VueMetamask                from "./components/VueMetamask";


const app = createApp(App)
  .use(store)
  .use(router)
  .use(Quasar, quasarUserOptions);
app.use(VueAxios, axios);
app.component("Authenticate", Authentication);
app.component("Metamask", VueMetamask);
app.mount("#app");
