<template>
  <div class="main">
    <DataTable :value="items" style="width: 100%">
      <template #header>
        <div class="table__header">
          <span class="text-xl font-bold">Мои запросы</span>
        </div>
      </template>
      <Column field="templateName" header="Название">
        <template #body="{ data }">
          {{ getTitle(data.templateName) }}
        </template>
      </Column>
      <Column field="rejectionReason" header="Описание"></Column>
      <Column header="Ответ">
        <template #body="{ data }">
          <Button
            icon="pi pi-arrow-down"
            :disabled="data.status === 'PENDING'"
            @click="downloadFile(data)"
          />
        </template>
      </Column>
      <Column header="Статус">
        <template #body="{ data }">
          <Tag
          :severity="getTag(data.status).severity"
          :value="getTag(data.status).value"
          ></Tag>
        </template>
      </Column>
      <Column field="createdAt" header="Дата подачи">
        <template #body="{ data }">
          {{ moment(data.createdAt).format("DD-MM-YYYY") }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import { useUserStore } from "@/stores/userStore";
import moment from "moment";
import { storeToRefs } from "pinia";
import { Button, Column, DataTable, Image, Tag, useToast } from "primevue";
import { onMounted, ref } from "vue";

const { getMyRequests, getGeneratedPDF } = useQueries();
const items = ref([]);
const toast = useToast();
const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);

const getTag = (status) => {
  const answer = {
    "PENDING": {
      severity: "warn",
      value: "Ожидание",
    },
    "APPROVED": {
      severity: "success",
      value: "Получено",
    },
    "REJECTED": {
      severity: "danger",
      value: "Отказано",
    },
    "AUTO_ISSUED": {
      severity: "secondary",
      value: "Без статуса",
    },
  };

  return answer[status];
};

const getTitle = (name) => {
  const titles = {
    'place_of_work': 'Справка с место работы',
    'place_of_study': 'Справка с место учебы',
    'application_vacation': 'Заявление на отпуск',
  }

  return titles[name]
}

const downloadFile = async (request) => {
  const blob = await getGeneratedPDF({ id: request.id })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `document_${request.id}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
};

const userStore = useUserStore()
const { myRequests } = storeToRefs(userStore)

onMounted(async () => {
  await get()
});

const get = async () => {
  items.value = await getMyRequests({ id: currentUser.value?.id })
  console.log('request', items.value);
}
</script>
