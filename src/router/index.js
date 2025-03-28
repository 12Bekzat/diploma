import { useUser } from '@/composables/useUser'
import { useMainStore } from '@/stores/mainStore'
import CreateRequest from '@/views/CreateRequest.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
import Requests from '@/views/Requests.vue'
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
      component: Register,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
    },
    {
      path: '/requests',
      name: 'Requests',
      component: Requests,
    },
    {
      path: '/create-request',
      name: 'CreateRequest',
      component: CreateRequest,
    },
    {
      path: "/:pathMatch(.*)*", // Ловит все несуществующие маршруты
      name: "NotFound",
      component: NotFound,
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
