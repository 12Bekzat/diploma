import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', () => {
  const currentUser = ref(null)

  return { currentUser }
}, {
  persist: true, // Включаем сохранение в localStorage
})
