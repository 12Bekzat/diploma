<script setup>
import { RouterView, useRouter } from 'vue-router';
import Header from './components/Header.vue';
import { useMainStore } from './stores/mainStore';
import { storeToRefs } from 'pinia';

const mainStore = useMainStore()
const { currentUser } = storeToRefs(mainStore)

</script>

<template>
  <Header v-if="currentUser"/>

  <RouterView />
</template>

<style scoped>
</style>
