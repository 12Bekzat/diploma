<template>
  <div class="main">
    <Tabs :value="0" style="width: 100%">
      <TabList>
        <Tab :value="0">Студенты</Tab>
        <Tab :value="1">Преподаватели</Tab>
      </TabList>
      <TabPanels>
        <TabPanel :value="0">
          <Table :items="users.filter(user => user.roles.includes('USER'))" :columns="columns" v-model:filters="filters" />
        </TabPanel>
        <TabPanel :value="1">
          <Table :items="users.filter(user => user.roles.includes('ADMIN'))" :columns="columns" v-model:filters="filters" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
<script setup>
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue";
import Table from "./Components/Table.vue";
import { useQueries } from "@/composables/useQueries";
import { onMounted, ref } from "vue";

const users = ref([]);
const tabValue = ref(0)
const { getPaged } = useQueries();
const columns = ref([
  {
    field: "firstName",
    header: "Имя",
  },
  {
    field: "secondName",
    header: "Фамилия",
  },
  {
    field: "username",
    header: "Имя пользователя",
  },
]);
const filters = ref({
  global: { value: null, matchMode: "CONTAINS" },
  firstName: { operator: 'AND', constraints: [{ value: null, matchMode: 'STARTS_WITH' }] },
  secondName: { operator: 'AND', constraints: [{ value: null, matchMode: 'STARTS_WITH' }] },
  username: { operator: 'AND', constraints: [{ value: null, matchMode: 'STARTS_WITH' }] },
});

onMounted(() => {
  users.value = [
    {
      id: 1,
      firstName: "User",
      secondName: "User",
      roles: ["USER"],
      logoSrc:
        "https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/06/Starbucks_Corporation_Logo_2011.svg-e1657703028844.png?auto=format&q=60&fit=max&w=930",
      username: "user12",
      password: "user123",
    },
    {
      id: 0,
      firstName: "Admin",
      secondName: "Admin",
      roles: ["ADMIN"],
      logoSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ584acfWMPuHP7nRm1z5_Yt5zLmKyGrANsQ&s",
      username: "admin",
      password: "admin123",
    },
  ];
});

const getUsers = () => {
  users.value = getPaged({ filter: {}, orders: [] }, { serviceName: "User" });
};
</script>
