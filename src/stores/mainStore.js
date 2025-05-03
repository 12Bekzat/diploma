import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', () => {
  const currentUser = ref(null)
  const myRequests = ref([])

  return { currentUser, myRequests }
}, {
  persist: true, // Включаем сохранение в localStorage
})
