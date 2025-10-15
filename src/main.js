import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/routes'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utility/firebaseConfig'
let app
onAuthStateChanged(auth, async (user) => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    setTimeout(() => {
      app.mount('#app')
    }, 1000)
  }
})
