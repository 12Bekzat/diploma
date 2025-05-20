<template>
  <div class="main">
    <DataTable
      :value="items.filter((item) => item.status === 'PENDING')"
      style="width: 100%"
    >
      <template #header>
        <div class="table__header">
          <span class="text-xl font-bold">Запросы</span>
        </div>
      </template>
      <Column field="requesterFullName" header="Имя сотрудника"></Column>
      <Column field="templateName" header="Название">
        <template #body="{ data }">
          {{ getTitle(data.templateName) }}
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
    <Toast />
    <Dialog v-model:visible="visible" modal header="Отказ">
      <div class="modal">
        <Textarea v-model="reason" rows="5" cols="30" style="resize: none;"></Textarea>
        <Button label="Отправить" @click="sendCancelRequest"></Button>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import moment from "moment";
import { NCALayerClient } from "ncalayer-js-client";
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
  Textarea,
  Toast,
  useToast,
} from "primevue";
import { onMounted, ref } from "vue";

const { getPaged, getRequests, approveDocument, rejectDocument } = useQueries();
const items = ref([]);
const toast = useToast();
const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const visible = ref(false);
const reason = ref('');
const actualRequest = ref()

const getTitle = (name) => {
  const titles = {
    place_of_work: "Справка с место работы",
    place_of_study: "Справка с место учебы",
    application_vacation: "Заявление на отпуск",
  };

  return titles[name];
};

const signDocument = async () => {
  const ncalayerClient = new NCALayerClient();

  try {
    await ncalayerClient.connect();
  } catch (error) {
    alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
    return;
  }

  const documentInBase64 = 'MTEK';

  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncalayerClient.basicsSignCMS(
      NCALayerClient.basicsStorageAll,
      documentInBase64, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
      NCALayerClient.basicsCMSParamsDetached,
      NCALayerClient.basicsSignerSignAny,
    );
  } catch (error) {
    if (error.canceledByUser) {
      alert('Действие отменено пользователем.');
    }

    alert(error.toString());
    return;
  }

  return base64EncodedSignature;
};

const sendCancelRequest = async () => {
  if (!actualRequest.value) return

  await rejectDocument({ id: actualRequest.value.id, reason: reason.value })
  visible.value = true
  await get()
  window.location.reload()
}

const getTag = (status) => {
  const answer = {
    PENDING: {
      severity: "warn",
      value: "Ожидание",
    },
    APPROVED: {
      severity: "success",
      value: "Получено",
    },
    REJECTED: {
      severity: "danger",
      value: "Отказано",
    },
    AUTO_ISSUED: {
      severity: "secondary",
      value: "Без статуса",
    },
  };

  return answer[status];
};

const cancelRequest = (data) => {
  console.log(data);
  visible.value = true;
  actualRequest.value = data
};

const confirmRequest = async (data) => {
  console.log(data);
  const answer = await signDocument();
  
  if (answer) {
    await approveDocument({ id: data.id, approverId: currentUser.value.id })
  }
  await get()
  window.location.reload()
};

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/official_request.pdf"; // Путь к файлу в папке public
  link.download = "Запрос.pdf";
  link.click();
};

onMounted(async () => {
  await get();
});

const get = async () => {
  items.value = await getRequests();
  items.value = items.value.filter((item) => item.status === "PENDING");
  console.log("requests", items.value);
};
</script>
