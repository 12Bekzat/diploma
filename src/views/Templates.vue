<template>
  <div class="main">
    <Fieldset
      v-for="template in documentTemplates"
      :legend="getTitle(template.name)"
      style="width: 100%"
    >
      <p class="m-0">
        Описание: <br />
        {{ template.description }}
      </p>
      <Button
        label="Запросить"
        @click="sendRequestClick(template)"
        :disabled="adminRole"
      />
    </Fieldset>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    header="Дополнительно"
  >
    <div class="modal">
      <DatePicker
        placeholder="С"
        v-model="extra.startDate"
        date-format="dd.mm.yy"
      />
      <DatePicker
        placeholder="До"
        v-model="extra.endDate"
        date-format="dd.mm.yy"
      />
      <Textarea
        rows="5"
        cols="30"
        v-model="extra.reason"
        placeholder="Причина"
        style="resize: none"
      />
      <Message
        v-if="error"
        style="width: 100%"
        severity="error"
        size="small"
        variant="simple"
      >
        Имя пользователя не может быть пустым
      </Message>
      <Button label="Отправить" @click="confirmRequest" />
    </div>
  </Dialog>
  <Toast />
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import {
  Button,
  DatePicker,
  Dialog,
  Fieldset,
  Message,
  Textarea,
  Toast,
  useToast,
} from "primevue";
import { computed, onMounted, ref } from "vue";

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/official_request.pdf"; // Путь к файлу в папке public
  link.download = "Запрос.pdf";
  link.click();
};

const userStore = useUserStore();
const store = useMainStore();
const { myRequests } = storeToRefs(userStore);
const extra = ref({});
const error = ref("");
const toast = useToast();
const { currentUser } = storeToRefs(store);
const visible = ref(false);

const { getPaged, sendRequest } = useQueries();

const saveRequest = () => {};

const getTitle = (name) => {
  const titles = {
    place_of_work: "Справка с место работы",
    place_of_study: "Справка с место учебы",
    application_vacation: "Заявление на отпуск",
  };

  return titles[name];
};

const documentTemplates = ref([]);

const adminRole = computed(() => {
  return (
    currentUser.value?.roles.find((role) => role.name === "ROLE_ADMIN") != null
  );
});

const roleByTemplate = {
  ROLE_STUDENT: ["place_of_study"],
  ROLE_TEACHER: ["place_of_work", "application_vacation"],
  ROLE_ADMIN: ["place_of_work", "application_vacation", "place_of_study"],
};

onMounted(async () => {
  await get();
});

const get = async () => {
  documentTemplates.value = await getPaged({ serviceName: "templates" });
  documentTemplates.value = documentTemplates.value.filter((template) => {
    if (
      currentUser.value.roles.filter((role) =>
        roleByTemplate[role.name].includes(template.name)
      ).length > 0
    )
      return true;
    return false;
  });
};

const confirmRequest = async () => {
  if (!extra.value?.requesterId || !extra.value?.templateId) return;
  try {
    const { requesterId, templateId, ...tail } = extra.value;
    await sendRequest(
      {
        requesterId: currentUser.value?.id,
        templateId: templateId,
      },
      JSON.stringify(tail)
    );
  } finally {
    visible.value = false;
    extra.value = {};
  }
};

const sendRequestClick = async (template) => {
  if (template.name === "application_vacation") {
    visible.value = true;
    extra.value = {
      requesterId: currentUser.value?.id,
      templateId: template.id,
    };
    return;
  }
  try {
    await sendRequest({
      requesterId: currentUser.value?.id,
      templateId: template.id,
    });
    toast.add({
      severity: "success",
      summary: "Успешно!",
      detail: "Запрос успешно отправлен!",
      life: 3000,
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Запрос не был оотправлен!",
      life: 3000,
    });
  } finally {
  }
};

const templates = ref([
  {
    title: "Справка с место учебы",
    desc: `Этот документ подтверждает, что вы официально обучаетесь в МУИТ.`,
    term: `Справка формируется автоматически и доступна для скачивания сразу после отправки заявки.`,
    doClick: downloadFile,
  },
  {
    title: "Справка с места работы",
    desc: `Этот документ подтверждает, что вы действительно работаете в {{Название организации}} на должности {{Должность}}..`,
    term: `Справка формируется автоматически и доступна для скачивания сразу после отправки заявки.`,
    doClick: downloadFile,
  },
  {
    title: "Заявление на отпуск",
    desc: `Это заявление выражает ваше желание получить ежегодный трудовой отпуск. Заявка будет рассмотрена администрацией, после чего может быть одобрена или отклонена.`,
    term: `Рассмотрение заявления занимает от 3 до 5 рабочих дней. После проверки вы получите уведомление о результате.`,
    doClick: saveRequest,
  },
]);
</script>
