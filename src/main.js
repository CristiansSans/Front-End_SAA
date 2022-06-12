/**
=========================================================
* Vue Soft UI Dashboard - v2.0.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-soft-ui-dashboard
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import Antd from 'ant-design-vue';
import "./assets/css/nucleo-icons.css";
import 'ant-design-vue/dist/antd.css';
import "./assets/css/nucleo-svg.css";
import SoftUIDashboard from "./soft-ui-dashboard";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import endPoint from '../config-endpoint/endpoint.js'
import DisableAutocomplete from 'vue-disable-autocomplete';
import VueSocketIO from 'vue-3-socket.io'


const socketio = new VueSocketIO({
    debug: true,
    connection: endPoint.endpointTarget,
  })

const appInstance = createApp(App);

appInstance.use(store);
appInstance.use(DisableAutocomplete);
appInstance.use(Antd);
appInstance.use(VueSweetalert2);
appInstance.use(router);
appInstance.use(SoftUIDashboard);
appInstance.use(socketio)
appInstance.mount("#app");
