<template>
  <div class="main">
    <Fieldset
      v-for="template in templates"
      :legend="template.title"
      style="width: 100%"
    >
      <p class="m-0">
        Описание: <br />
        {{ template.desc }}
      </p>
      <p class="m-0">
        Срок обработки: <br />
        {{ template.term }}
      </p>
      <Button label="Запросить" @click="template.doClick" />
    </Fieldset>
  </div>
</template>
<script setup>
import { useMainStore } from "@/stores/mainStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { Button, Fieldset } from "primevue";
import { ref } from "vue";

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/official_request.pdf"; // Путь к файлу в папке public
  link.download = "Запрос.pdf";
  link.click();
};

const userStore = useUserStore();
const store = useMainStore();
const { myRequests } = storeToRefs(userStore);
const { currentUser } = storeToRefs(store);

const saveRequest = () => {
  myRequests.value.push({
    id: Math.random(),
    userId: currentUser.value?.id,
    userName: currentUser.value?.firstName + ' ' + currentUser.value?.secondName,
    type: "Другое",
    status: "pending",
    createdAt: new Date(),
    updatedAt: null,
    description: "Прошу предоставить мне ежегодный трудовой отпуск продолжительностью {{Количество дней}} календарных дней с {{Дата начала}} по {{Дата окончания}} включительно.",
    adminComment: null,
    preview: "@assets/request_3.png",
  });
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
