import Vue from 'vue'

import App from './App'

import VConsole from 'vconsole'
Vue.prototype.$vconsole = VConsole;

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
