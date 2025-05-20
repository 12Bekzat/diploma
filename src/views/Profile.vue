<template>
  <div class="main">
    <Card style="width: 100%; position: relative; margin-top: 150px">
      <template #header>
        <div class="avatar">
          <Image
            v-if="currentUser?.url"
            :src="currentUser?.url"
            alt="Image"
            width="250"
            class="avatar__img"
            image-style="height: 250px; border-radius: 50%;"
          />
          <div
            v-else
            class="avatar__avatar"
          >{{ currentUser.fullName ? currentUser.fullName[0] : 'A' }}</div>
        </div>
      </template>
      <template #title>
        <div class="avatar__title">
          {{ currentUser.fullName || 'Имя пользователя'  }}
          <Button icon="pi pi-pencil" severity="secondary" @click="$router.push({name: 'EditMe'})"/>
        </div>
      </template>
      <template #subtitle
        ><div class="avatar__subtitle">
          {{ getRoles() }}
        </div>
      </template>
      <template #content>
        <p class="m-0" style="display: flex; align-items: center; gap: 8px;">Email: {{ currentUser.email }}</p>
        <p class="m-0">Все действия подтверждаются вашей электронной подписью, а документы проходят проверку перед выдачей.</p>
      </template>
      <template #footer>
        <div style="display: flex; width: 100%; gap: 12px">
          <Button label="Выйти" severity="danger" outlined class="w-full" @click="signOut" />
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { useMainStore } from "@/stores/mainStore";
import { storeToRefs } from "pinia";
import { Avatar, Badge, Button, Card, Image, Message } from "primevue";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const router = useRouter();

const getRoles = () => {
  return currentUser.value.roles.map(role => role.name === 'ROLE_ADMIN' ? 'Админстратор' : role.name === 'ROLE_TEACHER' ? 'Преподаватель' : 'Студент').join(', ')
}

const signOut = () => {
  currentUser.value = null;
  localStorage.removeItem('jwt-token')
  router.push({ name: "Login" });
};
</script>
