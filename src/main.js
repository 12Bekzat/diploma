import './assets/style.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import router from './router'
import { ToastService } from 'primevue'

const app = createApp(App)
const pinia = createPinia();

pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Aura
    }
 });



app.mount('#app')
