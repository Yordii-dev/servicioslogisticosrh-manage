import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle"

import VueLoading from "vue-loading-overlay"
import "vue-loading-overlay/dist/vue-loading.css"
createApp(App).use(store).use(router).use(VueLoading).mount("#app")
