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
  >
    <template #header>
      <div style="display: flex; justify-content: space-between;">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          @click="clearFilter()"
        />
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText
            v-model="filters['global'].value"
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    </template>
    <template #empty> No customers found. </template>
    <template #loading> <ProgressSpinner /> </template>
    <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header">
      <template #body="{ data }">
        {{ column.parse ? column.parse(data[column.field]) : data[column.field] }}
      </template>
      <template #filter="{ filterModel }">
        <InputText
          v-model="filterModel.value"
          type="text"
          placeholder="Search by name"
        />
      </template>
    </Column>
  </DataTable>
</template>
<script setup>
import { Button, Column, DataTable, IconField, InputIcon, InputText, ProgressSpinner } from 'primevue';

const { items, columns } = defineProps({
    items: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    },
})
const filters = defineModel('filters', { default: {
    global: { value: null, matchMode: 'contains' },
} });
</script>
