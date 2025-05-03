<script setup>
import { RouterView, useRouter } from "vue-router";
import Header from "./components/Header.vue";
import { useMainStore } from "./stores/mainStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { updatePrimaryPalette } from "@primevue/themes";
import EventBus from '@/app/AppEventBus'
import Footer from "./components/Footer.vue";

const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);

onMounted(() => {
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
});
</script>

<template>
  <Header v-if="currentUser" />

  <RouterView />

  <Footer />
</template>

<style scoped></style>
