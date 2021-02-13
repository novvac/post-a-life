import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueCookies from "vue-cookies"

import './components/base/index';

Vue.config.productionTip = false;
// ajax
Vue.prototype.$http = axios;
// cookies
Vue.use(VueCookies);
Vue.$cookies.config(60*20);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
