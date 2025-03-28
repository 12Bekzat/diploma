<template>
  <Menubar :model="items" style="width: 100%">
    <template #start>
      <Logo />
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a
        v-ripple
        style="display: flex; align-items: center"
        v-bind="props.action"
      >
        <span>{{ item.label }}</span>
        <Badge
          v-if="item.badge"
          :class="{ 'ml-auto': !root, 'ml-2': root }"
          :value="item.badge"
        />
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
        <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
        <Avatar :image="currentUser.logoSrc" shape="circle" @click="toggle"/>
        <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
      </div>
    </template>
  </Menubar>
</template>
<script setup>
import { Avatar, Badge, InputText, Menubar } from "primevue";
import { onMounted, ref, watch } from "vue";
import Logo from "./Logo.vue";
import { useMainStore } from "@/stores/mainStore";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const menu = ref()

const menuItems = ref([
  {
    label: "Профиль",
    icon: "pi pi-user",
  },
  {
    label: "Выйти",
    icon: "pi pi-sign-out",
  },
]);

const toggle = (event) => {
  menu.value.toggle(event)
}

const items = ref([
  {
    label: "Главная",
    icon: "pi pi-home",
  },
  {
    label: "Мои запросы",
    icon: "pi pi-search",
    badge: 3,
    items: [
      {
        label: "Core",
        icon: "pi pi-bolt",
        shortcut: "⌘+S",
      },
      {
        label: "Blocks",
        icon: "pi pi-server",
        shortcut: "⌘+B",
      },
      {
        separator: true,
      },
      {
        label: "UI Kit",
        icon: "pi pi-pencil",
        shortcut: "⌘+U",
      },
    ],
  },
]);
</script>
