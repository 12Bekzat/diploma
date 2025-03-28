import { useUser } from '@/composables/useUser'
import { useMainStore } from '@/stores/mainStore'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Login,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore()
  const { currentUser } = storeToRefs(mainStore)

  if (to.meta.requiresAuth && !currentUser.value) router.push({ name: 'Login' })
  else next()
})

export default router
