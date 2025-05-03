import { useUser } from '@/composables/useUser'
import { useMainStore } from '@/stores/mainStore'
import Confirm from '@/views/Admin/Confirm/Confirm.vue'
import Users from '@/views/Admin/Users/Users.vue'
import CreateRequest from '@/views/CreateRequest.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Messenger from '@/views/Messenger.vue'
import NotFound from '@/views/NotFound.vue'
import Profile from '@/views/Profile.vue'
import Register from '@/views/Register.vue'
import Requests from '@/views/Requests.vue'
import Templates from '@/views/Templates.vue'
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
      meta: { requiresAuth: true }
    },
    {
      path: '/requests',
      name: 'Requests',
      component: Requests,
      meta: { requiresAuth: true }
    },
    {
      path: '/create-request',
      name: 'CreateRequest',
      component: CreateRequest,
      meta: { requiresAuth: true }
    },
    {
      path: '/templates',
      name: 'Templates',
      component: Templates,
      meta: { requiresAuth: true }
    },
    {
      path: '/support',
      name: 'Support',
      component: Messenger,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: { requiresAuth: true, isAdmin: true }
    },
    {
      path: '/confirm',
      name: 'Confirm',
      component: Confirm,
      meta: { requiresAuth: true, isAdmin: true }
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
  if (to.meta.isAdmin  && !currentUser.value && !currentUser.value?.roles?.find(role => role === 'ADMIN')) router.push({ name: 'Home' })
  else next()
})

export default router
