<template>
  <div class="main">
    <Card style="width: 100%; position: relative; margin-top: 150px">
      <template #header>
        <div class="avatar">
          <Image
            :src="currentUser?.logoSrc"
            alt="Image"
            width="250"
            class="avatar__img"
            image-style="height: 250px; border-radius: 50%;"
          />
          <i
            class="pi pi-pencil edit"
            style="cursor: pointer; color: white; font-size: 20px"
          ></i>
        </div>
      </template>
      <template #title>
        <div class="avatar__title">
          {{ currentUser.firstName + " " + currentUser.secondName }}
          <i class="pi pi-pencil" style="cursor: pointer"></i>
        </div>
      </template>
      <template #subtitle
        ><div class="avatar__subtitle">
          {{ currentUser.roles[0] }}
        </div>
        <Message severity="error" variant="simple" size="small"
          >Необходимо подтвердить эцп ключом!</Message
        >
      </template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis
          esse, cupiditate neque quas!
        </p>
      </template>
      <template #footer>
        <div style="display: flex; width: 100%; gap: 12px">
          <Button label="Выйти" severity="danger" outlined class="w-full" @click="signOut" />
          <Button label="Подтвердить" class="w-full" />
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { useMainStore } from "@/stores/mainStore";
import { storeToRefs } from "pinia";
import { Badge, Button, Card, Image, Message } from "primevue";
import { useRouter } from "vue-router";

const mainStore = useMainStore();
const { currentUser } = storeToRefs(mainStore);
const router = useRouter();

const signOut = () => {
  currentUser.value = null;
  router.push({ name: "Login" });
};
</script>
