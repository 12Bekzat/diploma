<template>
  <Menubar
    :model="
      items.filter((item) => (item.isAdmin && adminRole) || !item.isAdmin)
    "
    style="width: 100%"
  >
    <template #start>
      <Logo />
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a
        v-ripple
        style="display: flex; align-items: center"
        v-bind="props.action"
      >
        <RouterLink
          :to="item.to"
          style="color: #334155; text-decoration: none"
          >{{ item.label }}</RouterLink
        >
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <i
          v-if="hasSubmenu"
          :class="[
            'pi pi-angle-down ml-auto',
            { 'pi-angle-down': root, 'pi-angle-right': !root },
          ]"
        ></i>
      </a>
    </template>
    <template #end>
      <div
        class="flex items-center gap-2"
        style="display: flex; align-items: center; gap: 12px"
      >
        <Search />
        <Notification />
        <SplitButton :model="menuItems" text>
          <Avatar :image="currentUser.logoSrc" shape="circle" @click="toggle" />
        </SplitButton>
      </div>
    </template>
  </Menubar>
</template>
<script setup>
import {
  Avatar,
  Badge,
  Button,
  InputText,
  Menubar,
  SplitButton,
} from "primevue";
import { computed, onMounted, ref, watch } from "vue";
import Logo from "./Logo.vue";
import { useMainStore } from "@/stores/mainStore";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";
import Notification from "./Notification.vue";
import Search from "./Search.vue";

const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const menu = ref();

const router = useRouter();

const adminRole = computed(() => {
  return currentUser.value.roles.find((role) => role === "ADMIN") != null;
});

const menuItems = [
  {
    label: "Профиль",
    command: () => {
      router.push({ name: "Profile" });
    },
  },
  {
    label: "Выйти",
    command: () => {
      currentUser.value = null;
      router.push({ name: "Login" });
    },
  },
];

const toggle = (event) => {
  menu.value.toggle(event);
};

const items = ref([
  {
    label: "Главная",
    icon: "pi pi-home",
    to: "/",
  },
  {
    label: "Запросы",
    icon: "pi pi-search",
    items: [
      {
        label: "Мои запросы",
        icon: "pi pi-bolt",
        to: "/requests",
      },
      {
        label: "Шаблоны",
        icon: "pi pi-bolt",
        to: "/templates",
      },
      {
        label: "Связаться",
        icon: "pi pi-bolt",
        to: "/support",
      },
    ],
  },
  {
    label: "Панель управления",
    isAdmin: true,
    items: [
      {
        label: "Пользователи",
        icon: "pi pi-bolt",
        to: "/users",
      },
      {
        label: "Подтвердить",
        icon: "pi pi-bolt",
        to: "/confirm",
      },
    ],
  },
]);
</script>
