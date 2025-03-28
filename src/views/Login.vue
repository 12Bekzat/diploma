<template>
  <div class="form">
    <Card style="width: 500px">
      <template #content>
        <div class="form__content">
          <div class="form__title">Войти</div>
          <div class="form__tags">
            <Card style="cursor: pointer">
              <template #content>
                <div style="display: flex; align-items: center">
                  <i class="pi pi-google" style="font-size: 28px"></i>
                </div>
              </template>
            </Card>
          </div>
          <Divider style="width: 100%" align="center" type="solid">
            или
          </Divider>
          <InputText
            v-model="username"
            name="username"
            type="text"
            placeholder="Имя пользователя"
            style="width: 100%"
          />
          <Password
            v-model="password"
            placeholder="Пароль"
            toggle-mask
            :feedback="false"
            :style="{ width: '100%' }"
            :input-style="{ width: '100%' }"
          />
          <Message v-if="message" severity="error" size="small" variant="simple">{{ message }}</Message>
          <Button type="submit" label="Submit" @click="submit" />
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { useUser } from "@/composables/useUser";
import { Button, Card, Divider, InputText, Message, Password } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const message = ref()

const { login } = useUser()
const router = useRouter()

const submit = () => {
    const response = login(username.value, password.value)
    console.log(response);
    
    if (response.code === 200) {
        message.value = ''
        router.push({ name: 'Home' })
    } else {
        message.value = response.message
    }
}
</script>

<style scoped>
.w-full {
    width: 100%;
}
</style>
