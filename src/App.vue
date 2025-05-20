<script setup>
import { RouterView, useRoute, useRouter } from "vue-router";
import Header from "./components/Header.vue";
import { useMainStore } from "./stores/mainStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
import { updatePrimaryPalette } from "@primevue/themes";
import EventBus from '@/app/AppEventBus'
import Footer from "./components/Footer.vue";
import { useUser } from "./composables/useUser";

const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const { getMe } = useUser()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const color = {
    name: "rose",
    palette: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
      950: "#4c0519",
    },
  };

  updatePrimaryPalette(color.palette)
  EventBus.emit('theme-palette-change')

  console.log(checkSpecialPage.value, {...currentUser.value});
  await getMe()
  console.log(checkSpecialPage.value, currentUser.value);
  
  if (currentUser.value && checkSpecialPage.value) {
    console.log('router to Home');
    router.push({ name: 'Home' })
  }
});

const specialPages = ['login', 'register']

const checkSpecialPage = computed(() => {
  const res = specialPages.filter(page => route.path.includes(page))
  return res.length > 0
})
</script>

<template>
  <Header v-if="!checkSpecialPage" />

  <RouterView />

  <Footer v-if="!checkSpecialPage"/>
</template>

<style scoped></style>
