<template>
  <span style="position: relative;">
    <InputText
      v-model:model-value="text"
      placeholder="Search"
      type="text"
      class="w-32 sm:w-auto"
      @value-change="toggle"
    />
    <div :class="'overlay' + ((text === '' || searchTemplate.length <= 0) ? ' hide' : '')">
      <div class="texts">
        <RouterLink to="/templates" class="texts__item" v-for="temp in searchTemplate">
          {{ getTitle(temp.name) }}
        </RouterLink>
      </div>
    </div>
  </span>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useUser } from "@/composables/useUser";
import { InputText, Popover } from "primevue";
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";

const text = ref("");
const op = ref();
const opened = ref(false);
const { getPaged } = useQueries();
const showUsers = ref([]);

const templates = ref([]);

const getTitle = (name) => {
  const titles = {
    place_of_work: "Справка с место работы",
    place_of_study: "Справка с место учебы",
    application_vacation: "Заявление на отпуск",
  };

  return titles[name];
};

const get = async () => {
  templates.value = await getPaged({ serviceName: "templates" });
};

onMounted(async () => {
  await get();
});

const toggle = (event) => {
  console.log(event);

  if (text.value && !opened.value) {
    op.value.toggle(event);
    opened.value = true;
  }
};

const searchTemplate = computed(() => {
  return templates.value.filter((template) =>
    getTitle(template.name).toLowerCase().includes(text.value.toLowerCase())
  );
});

const { users } = useUser();
</script>
