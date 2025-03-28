<template>
  <div class="main">
    <p
      style="
        width: 100%;
        max-width: 1600px;
        text-align: start;
        font-size: 24px;
        font-weight: 500;
      "
    >
      График моих запросов
    </p>
    <Chart
      type="bar"
      style="width: 1600px"
      :data="chartData"
      :options="chartOptions"
    />
    <div class="cards">
      <Card>
        <template #title>Ваши запросы</template>
        <template #content>
          <div style="display: flex; flex-direction: column">
            <p>Проверить статус запросов или отправить новый.</p>
            <span style="width: 100%; display: flex; gap: 12px">
              <Button
                label="Мои запросы"
                severity="info"
                @click="$router.push({ name: 'Requests' })"
              />
              <Button
                label="Подать заявку"
                @click="$router.push({ name: 'CreateRequest' })"
              />
            </span>
          </div>
        </template>
      </Card>
      <Card style="flex-grow: 1;">
        <template #title>Последние запросы</template>
        <template #content>
          <DataTable :value="items" style="width: 100%;">
            <Column field="userName" header="Имя сотрудника"></Column>
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
import moment from "moment";
import { Button, Card, Column, DataTable, Tag } from "primevue";
import Chart from "primevue/chart";
import { onMounted, ref } from "vue";

const items = ref([]);
const { getPaged } = useQueries();

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

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  const { result, code } = getPaged(
    { filter: (item) => item.id == currentUser.value.id },
    { serviceName: "Request" }
  );
  if (code == 200) {
    items.value = result.filter((_, ind) => ind < 2);
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка сервера!",
      detail: "Произошла ошибка при загрузке данных, проблема в фильтре!",
      life: 3000,
    });
  }
});

const chartData = ref();
const chartOptions = ref();

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
