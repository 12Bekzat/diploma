<template>
  <div class="form">
    <Card style="width: 500px">
      <template #content>
        <div class="form__content">
          <div class="form__title">Войти</div>
          <InputText
            v-model="username"
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
          <Button type="submit" label="Войти" @click="submit" />
        </div>
      </template>
    </Card>
  </div>
</template>
<script setup>
import { useUser } from "@/composables/useUser";
import { Button, Card, Divider, InputText, Message, Password } from "primevue";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const message = ref()

const { login, getMe } = useUser()
const router = useRouter()

const submit = async () => {
    const resp = await login(username.value, password.value)
    if (!resp) {
      message.value = 'Имя полльзователя или пароль неверны!'
      return
    }
    await getMe()
    router.push({ name: 'Home' })
}
</script>

<style scoped>
.w-full {
    width: 100%;
}
</style>
