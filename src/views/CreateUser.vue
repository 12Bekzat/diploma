<template>
  <div class="main">
    <Card style="width: 500px">
      <template #content>
        <div class="form__content">
          <div class="form__title">Создать пользователя</div>
          <InputText
            v-model="item.fullName"
            name="first"
            type="text"
            placeholder="Полное имя"
            style="width: 100%"
          />
          <InputText
            v-model="item.username"
            type="text"
            placeholder="Имя пользователя"
            autocomplete="off"
            style="width: 100%"
          />
          <Message
            v-if="error"
            style="width: 100%"
            severity="error"
            size="small"
            variant="simple"
          >
            Имя пользователя не может быть пустым</Message
          >
          <InputText
            v-model="item.email"
            type="text"
            placeholder="Email"
            autocomplete="off"
            style="width: 100%"
          />
          <InputText
            v-model="item.url"
            type="text"
            placeholder="Ссылка на фото"
            autocomplete="off"
            style="width: 100%"
          />
          <Message
            v-if="message"
            severity="error"
            size="small"
            variant="simple"
            >{{ message }}</Message
          >
          <Select
            v-model="selectedRole"
            :options="cities"
            optionLabel="name"
            placeholder="Выберите роль"
            style="width: 100%"
          />
          <span v-if="selectedRole?.code === 'ROLE_STUDENT'" style="display: flex;
          gap: 12px; flex-direction: column; width: 100%;">
            <InputText
                v-model="jsonExtra.courseName"
                type="text"
                placeholder="Название курса"
                autocomplete="off"
                style="width: 100%"
            />
            <InputText
                v-model="jsonExtra.courseYear"
                type="number"
                placeholder="Курс"
                autocomplete="off"
                style="width: 100%"
            />
          </span>
          <span v-if="selectedRole?.code === 'ROLE_TEACHER'" style="display: flex;
          gap: 12px; flex-direction: column; width: 100%;">
            <InputText
                v-model="jsonExtra.position"
                type="text"
                placeholder="Должность"
                autocomplete="off"
                style="width: 100%"
            />
            <InputText
                v-model="jsonExtra.department"
                type="text"
                placeholder="Отдел"
                autocomplete="off"
                style="width: 100%"
            />
          </span>
          <Button
            type="submit"
            label="Сохранить"
            @click="submit"
            style="margin-top: 12px"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import { storeToRefs } from "pinia";
import {
  Button,
  Card,
  DatePicker,
  InputText,
  Message,
  MultiSelect,
  Password,
  Select,
} from "primevue";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const store = useMainStore();
const { currentUser } = storeToRefs(store);

const { create } = useQueries();

const item = ref({});
const message = ref("");

const jsonExtra = ref({})

const selectedRole = ref({ name: "Преподаватель", code: "ROLE_TEACHER" });
const error = ref(false);
const cities = ref([
  { name: "Преподаватель", code: "ROLE_TEACHER" },
  { name: "Студент", code: "ROLE_STUDENT" },
]);

const router = useRouter();

const validate = () => {
    console.log(item.value);
    
  if (!item.value?.username) {
    error.value = true
    return false;
  }
  if (!selectedRole.value) {
    return false;
  }

  error.value = false
  return true;
};

const submit = async () => {
  const isValid = validate();
  if (!isValid) return;

  if (selectedRole.value.code === 'ROLE_TEACHER') {
    jsonExtra.value.employmentStartDate = new Date()
  }
  const extra = JSON.stringify(jsonExtra.value)

  const sendItem = {
    ...item.value,
    roles: [ selectedRole.value?.code ],
    password: 'qwe123qwe',
    extra
  };

  await create({ item: sendItem, serviceName: "users" });
  router.push({ name: 'Users' })
};
</script>
