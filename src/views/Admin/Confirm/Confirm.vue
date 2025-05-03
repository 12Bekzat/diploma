<template>
  <div class="main">
    <DataTable
      :value="items.filter((item) => item.status === 'pending')"
      style="width: 100%"
    >
      <template #header>
        <div class="table__header">
          <span class="text-xl font-bold">Запросы</span>
        </div>
      </template>
      <Column field="userName" header="Имя сотрудника"></Column>
      <Column field="description" header="Описание"></Column>
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
      <Column>
        <template #body="{ data }">
          <div class="style" style="display: flex; gap: 8px">
            <Button
              icon="pi pi-check"
              aria-label="Save"
              style="background: green; border-color: green"
              @click="confirmRequest(data)"
            />
            <Button
              icon="pi pi-minus-circle"
              aria-label="Save"
              variant="outlined"
              @click="cancelRequest(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="visible">
      <Card style="width: 500px">
        <template #content>
          <div class="form__content" style="gap: 16px">
            <div class="form__title">Подтвердить</div>
            <Select
              v-model="mark"
              :options="marks"
              optionLabel="name"
              placeholder="Выберите печать"
              style="width: 100%"
            />
            <span style="display: flex; gap: 8px;">
              <Button label="Подтвердить по эцп" @click="" variant="outlined" />
              <Button
                :label="statusApprove ? 'Подтвердить' : 'Отказать'"
                @click="save"
              />
            </span>
          </div>
        </template>
      </Card>
    </Dialog>
    <Toast />
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import { useUserStore } from "@/stores/userStore";
import moment from "moment";
import { storeToRefs } from "pinia";
import {
  Button,
  Card,
  Column,
  DataTable,
  Dialog,
  Divider,
  Image,
  InputText,
  Message,
  Password,
  Select,
  Tag,
  Toast,
  useToast,
} from "primevue";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const { getPaged } = useQueries();
const items = ref([]);
const toast = useToast();
const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const visible = ref(false);
const mark = ref();
const marks = ref([{ name: "1 печать", id: 1 }]);

const statusApprove = ref(false);

const save = () => {
    visible.value = false
    toast.add({
      severity: "success",
      summary: "Успешно!",
      detail: "Документ утвердился!",
      life: 3000,
    });
}

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

const cancelRequest = (data) => {
  console.log(data);
  visible.value = true;
  statusApprove.value = false;
};

const confirmRequest = (data) => {
  console.log(data);
  visible.value = true;
  statusApprove.value = true;
};

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/official_request.pdf"; // Путь к файлу в папке public
  link.download = "Запрос.pdf";
  link.click();
};

const userStore = useUserStore();
const { myRequests } = storeToRefs(userStore);

onMounted(() => {
  const { result, code } = getPaged(
    { filter: (item) => item.id == currentUser.value.id },
    { serviceName: "Request" }
  );
  if (code == 200) {
    items.value = [...result, ...myRequests.value];
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
