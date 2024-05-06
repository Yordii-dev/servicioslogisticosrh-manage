import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'

import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import VueGoogleMaps from '@fawmi/vue-google-maps'

createApp(App)
  .use(store)
  .use(router)
  .use(VueLoading)
  .use(VueGoogleMaps, {
    load: {
      key: process.env.VUE_APP_KEY_GOOGLE_MAPS,
    },
  })

  .mount('#app')
