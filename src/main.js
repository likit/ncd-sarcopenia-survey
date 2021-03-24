import Vue from 'vue'
import App from './App.vue'
import Buefy from "buefy"
import "buefy/dist/buefy.css"
import router from './router'
import store from './store'
import { auth } from './firebase'

Vue.config.productionTip = false
Vue.use(Buefy)

auth.onAuthStateChanged(user => {
    console.log(user)
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
