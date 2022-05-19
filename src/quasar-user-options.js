import "./styles/quasar.scss";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import { Dialog, Cookies, Notify } from "quasar";

/** To be used on app.use(Quasar, { ... }) */
export default {
  config: {
    Notify,
  },
  plugins: {
    Dialog,
    Cookies,
    Notify,
  },
};
