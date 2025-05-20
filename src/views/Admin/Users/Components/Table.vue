<template>
  <DataTable
    v-model:filters="filters"
    :value="items"
    paginator
    showGridlines
    :rows="10"
    dataKey="id"
    filterDisplay="menu"
    :globalFilterFields="[
      'name',
      'country.name',
      'representative.name',
      'balance',
      'status',
    ]"
    @filter="onFilter"
  >
    <template #header>
      <div class="table__header" style="margin-bottom: 16px" v-if="adminRole">
        <span class="text-xl font-bold"></span>
        <Button
          icon="pi pi-plus"
          label="Создать пользователя"
          @click="$router.push({ name: 'CreateUser' })"
        ></Button>
      </div>
    </template>
    <template #empty> Пользователи не найдены! </template>
    <template #loading> <ProgressSpinner /> </template>
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :showFilterMenu="false"
      :header="column.header"
    >
      <template #body="{ data }">
        {{
          column.parse ? column.parse(data[column.field]) : data[column.field]
        }}
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          placeholder="Search by name"
        />
      </template>
    </Column>
    <Column
      field="manage"
      :header="'Управление'"
    >
      <template #body="{ data }">
        <Button icon="pi pi-trash" @click="emits('onRemove', data)"></Button>
      </template>
    </Column>
  </DataTable>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import { storeToRefs } from "pinia";
import {
  Button,
  Column,
  DataTable,
  IconField,
  InputIcon,
  InputText,
  ProgressSpinner,
} from "primevue";
import { computed } from "vue";

const { items, columns } = defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['onRemove'])

const store = useMainStore();
const { currentUser } = storeToRefs(store);

const adminRole = computed(() => {
  return (
    currentUser.value?.roles.find((role) => role.name === "ROLE_ADMIN") != null
  );
});

const filters = defineModel("filters", {
  default: {
    global: { value: null, matchMode: "contains" },
  },
});
</script>
