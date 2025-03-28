<template>
  <div class="main">
    <DataTable :value="items" style="width: 100%">
      <template #header>
        <div class="table__header">
          <span class="text-xl font-bold">Мои запросы</span>
          <Button icon="pi pi-plus" label="Создать запрос" @click="$router.push({ name: 'CreateRequest' })"></Button>
        </div>
      </template>
      <Column field="userName" header="Имя сотрудника"></Column>
      <Column header="Ответ">
        <template #body="{ data }">
          <img
            src="@assets/request_1.png"
            class="w-24 rounded"
            style="width: 50px; height: 50px; box-shadow: 0 0 1px #00000034"
            @click="downloadFile"
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
import moment from "moment";
import { storeToRefs } from "pinia";
import { Button, Column, DataTable, Image, Tag, useToast } from "primevue";
import { onMounted, ref } from "vue";

const { getPaged } = useQueries();
const items = ref([]);
const toast = useToast();
const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);

const getTag = (status) => {
  const answer = {
    pending: {
      severity: "warn",
      value: "Ожидание",
    },
    approved: {
      severity: "success",
      value: "Получено",
    },
    rejected: {
      severity: "danger",
      value: "Отказано",
    },
  };

  return answer[status];
};

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/official_request.pdf"; // Путь к файлу в папке public
  link.download = "Запрос.pdf";
  link.click();
};

onMounted(() => {
  const { result, code } = getPaged(
    { filter: (item) => item.id == currentUser.value.id },
    { serviceName: "Request" }
  );
  if (code == 200) {
    items.value = result;
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка сервера!",
      detail: "Произошла ошибка при загрузке данных, проблема в фильтре!",
      life: 3000,
    });
  }
});
</script>
