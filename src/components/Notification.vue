<template>
  <Button
    icon="pi pi-bell"
    aria-label="Save"
    variant="outlined"
    :badge="requests.length"
    @click="toggle"
  />
  <Popover ref="op">
    <div class="notifs">
      <div class="notifs__item" v-for="req in requests">
        <Tag icon="pi pi-check" severity="success" v-if="req.status === 'APPROVED'" :value="getTitle(req.templateName)"></Tag>
        <Tag icon="pi pi-times" severity="danger" v-if="req.status === 'REJECTED'" :value="getTitle(req.templateName)"></Tag>
        <Tag icon="pi pi-info-circle" severity="info" v-if="req.status === 'AUTO_ISSUED'" :value="getTitle(req.templateName)"></Tag>
      </div>
    </div>
  </Popover>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import moment from "moment";
import { storeToRefs } from "pinia";
import { Button, Dialog, Popover, Tag } from "primevue";
import { onMounted, ref } from "vue";

const op = ref();

const { getMyRequests } = useQueries();
const store = useMainStore();
const { currentUser } = storeToRefs(store);
const requests = ref([])

const getTitle = (name) => {
  const titles = {
    place_of_work: "Справка с место работы",
    place_of_study: "Справка с место учебы",
    application_vacation: "Заявление на отпуск",
  };

  return titles[name];
};

const toggle = (event) => op.value.toggle(event);

onMounted(async () => {
  await get()
});

const get = async () => {
  if (!currentUser.value) return;
  requests.value = await getMyRequests({ id: currentUser.value.id });
  requests.value = requests.value.filter(req => req.status !== 'PENDING' && moment(req.createdAt).isSame(moment(), 'day'))
  console.log('req', requests.value);
};
</script>
