import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

console.log('Creating Vue app...')
const app = createApp(App)
console.log('Adding router...')
app.use(router)
console.log('Mounting app...')
app.mount('#app')
