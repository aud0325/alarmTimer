import Vue from 'vue'
import App from './App.vue'
import moment from 'moment';

Vue.config.productionTip = false
moment.locale('ko');
window.moment = moment;
new Vue({
  render: h => h(App),
}).$mount('#app')
