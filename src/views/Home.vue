<template>
  <div class="main">
    <div class="blocks" v-if="!adminRole">
      <div
        class="blocks__item"
        @click="
          () => {
            router.push({ name: 'Templates' });
          }
        "
        v-for="template in templates"
      >
        <div class="blocks__flex">
          <i class="pi pi-file-word"></i>
        </div>
        <div class="blocks__title">{{ getTitle(template.name) }}</div>
      </div>
    </div>
    <div class="cards">
      <Card>
        <template #title>{{
          adminRole ? "Сообщения" : "Ваши запросы"
        }}</template>
        <template #content>
          <div style="display: flex; flex-direction: column" v-if="!adminRole">
            <p>Проверить статус запросов или отправить новый.</p>
            <span style="width: 100%; display: flex; gap: 12px">
              <Button
                label="Мои запросы"
                severity="info"
                @click="$router.push({ name: 'Requests' })"
              />
            </span>
          </div>
          <div class="users" v-else>
            <div
              :class="'user' + (activeUser?.id === user?.id ? ' active' : '')"
              v-for="user in users"
              @click="$router.push({ name: 'Support' })"
            >
              {{ user.fullName || "Имя пользователя" }}
              <Badge :value="1" />
            </div>
          </div>
        </template>
      </Card>
      <Card style="flex-grow: 1">
        <template #title>Последние запросы</template>
        <template #content>
          <DataTable :value="items" style="width: 100%" v-if="!adminRole">
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
          </DataTable>
          <DataTable
            :value="items.filter((item) => item.status === 'PENDING')"
            style="width: 100%"
            v-else
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
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import moment from "moment";
import { storeToRefs } from "pinia";
import { Badge, Button, Card, Column, DataTable, Tag, useToast } from "primevue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const items = ref([]);
const templates = ref([]);
const { getPaged, getMyRequests, getRequests } = useQueries();
const toast = useToast();
const router = useRouter();
const users = ref([]);

const getTitle = (name) => {
  const titles = {
    place_of_work: "Справка с место работы",
    place_of_study: "Справка с место учебы",
    application_vacation: "Заявление на отпуск",
  };

  return titles[name];
};

const getAdmins = async () => {
  users.value = await getPaged({ serviceName: "users" });
  users.value = users.value.filter((user) =>
    user.roles.find((role) => role.name !== "ROLE_ADMIN")
  );
};

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

onMounted(async () => {
  await get();
  await getTemplates();
  await getAdmins();
});

const getTemplates = async () => {
  templates.value = await getPaged({ serviceName: "templates" });
  console.log(templates.value);
};

const adminRole = computed(() => {
  return (
    currentUser.value?.roles.find((role) => role.name === "ROLE_ADMIN") != null
  );
});

const get = async () => {
  if (adminRole.value) {
    items.value = await getRequests();
    items.value = items.value.filter((item) => item.status === "PENDING");
  } else {
    items.value = await getMyRequests({ id: currentUser.value?.id });
    items.value = items.value.filter((_, ind) => ind < 2);
  }
};

const store = useMainStore();
const { currentUser } = storeToRefs(store);

const setChartData = () => {
  return {
    labels: ["В ожидании", "Успешные", "Отказанные"],
    datasets: [
      {
        label: "Мои запросы",
        data: [540, 325, 702],
        backgroundColor: [
          "rgba(249, 115, 22, 0.2)",
          "rgba(6, 182, 212, 0.2)",
          "rgb(107, 114, 128, 0.2)",
        ],
        borderColor: [
          "rgb(249, 115, 22)",
          "rgb(6, 182, 212)",
          "rgb(107, 114, 128)",
        ],
        borderWidth: 1,
      },
    ],
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--p-text-muted-color"
  );
  const surfaceBorder = documentStyle.getPropertyValue(
    "--p-content-border-color"
  );

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>
