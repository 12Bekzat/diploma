<template>
  <div class="main">
    <Tabs :value="0" style="width: 100%">
      <TabList>
        <Tab :value="0">Студенты</Tab>
        <Tab :value="1">Преподаватели</Tab>
      </TabList>
      <TabPanels>
        <TabPanel :value="0">
          <Table
            :items="
              users.filter((user) =>
                user.roles.find((role) => role.name === 'ROLE_STUDENT')
              )
            "
            :columns="columns"
            v-model:filters="filters"
            @on-remove="removeUser"
          />
        </TabPanel>
        <TabPanel :value="1">
          <Table
            :items="
              users.filter((user) =>
                user.roles.find((role) => role.name === 'ROLE_TEACHER')
              )
            "
            :columns="columns"
            v-model:filters="filters"
            @on-remove="removeUser"
          />
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
const tabValue = ref(0);
const { getPaged, remove } = useQueries();
const columns = ref([
  {
    field: "fullName",
    header: "ФИО",
  },
  {
    field: "email",
    header: "Email",
  },
  {
    field: "username",
    header: "Имя пользователя",
  },
]);
const filters = ref({
  global: { value: null, matchMode: "CONTAINS" },
  firstName: {
    operator: "AND",
    constraints: [{ value: null, matchMode: "STARTS_WITH" }],
  },
  secondName: {
    operator: "AND",
    constraints: [{ value: null, matchMode: "STARTS_WITH" }],
  },
  username: {
    operator: "AND",
    constraints: [{ value: null, matchMode: "STARTS_WITH" }],
  },
});

const removeUser = async (data) => {
  const id = data?.id
  if(!id) return

  try {
    await remove({ id: { id }, serviceName: 'users' })
  } finally {
    await getUsers()
  }
}

onMounted(async () => {
  await getUsers();
});

const getUsers = async () => {
  users.value = await getPaged({ serviceName: "users" });
  console.log('users', users.value)
};
</script>
