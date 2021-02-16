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
axios.interceptors.request.use(function(config) {
  let token = null;
  if(VueCookies.get("token"))
    token = VueCookies.get("token");
  
  config.headers.Authorization = `Bearer ${token}`;

  return config;
})
// cookies
Vue.use(VueCookies);
Vue.$cookies.config(60*60*24);  //TODO: change this later

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
