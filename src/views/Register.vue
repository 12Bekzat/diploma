<template>
    <div class="form">
        <Card style="width: 500px">
            <template #content>
                <div class="form__content">
                    <div class="form__title">Регистрация</div>
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
                    <InputText v-model="firstname.field" name="first" type="text" placeholder="Имя"
                        style="width: 100%" />
                    <Message v-if="firstname.error" style="width: 100%;" severity="error" size="small" variant="simple">
                        {{ firstname.error
                        }}</Message>

                    <InputText v-model="secondname.field" name="second" type="text" placeholder="Фамилия"
                        style="width: 100%" />
                    <Message v-if="secondname.error" style="width: 100%;" severity="error" size="small"
                        variant="simple">{{ secondname.error
                        }}</Message>
                    <InputText v-model="username.field" name="username" type="text" placeholder="Имя пользователя"
                        style="width: 100%" />
                    <Message v-if="username.error" style="width: 100%;" severity="error" size="small" variant="simple">
                        {{ username.error }}
                    </Message>
                    <Password v-model="password.field" placeholder="Пароль" toggle-mask :style="{ width: '100%' }"
                        :input-style="{ width: '100%' }" />
                    <Message v-if="password.error" style="width: 100%;" severity="error" size="small" variant="simple">
                        {{ password.error }}
                    </Message>
                    <Password v-model="repassword.field" placeholder="Повторите пароль" toggle-mask
                        :style="{ width: '100%' }" :input-style="{ width: '100%' }" />
                    <Message v-if="repassword.error" style="width: 100%;" severity="error" size="small"
                        variant="simple">{{ repassword.error
                        }}</Message>
                    <Message v-if="message" severity="error" size="small" variant="simple">{{ message }}</Message>
                    <RouterLink to="/login" style="width: 100%; text-decoration: none; text-align: end;">Уже есть аккаунт?</RouterLink>
                    <Button type="submit" label="Submit" @click="submit" />
                </div>
            </template>
        </Card>
    </div>
</template>
<script setup>
import { useField } from "@/composables/useField";
import { useUser } from "@/composables/useUser";
import { Button, Card, Divider, InputText, Message, Password } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const firstname = useField('');
const secondname = useField('');
const username = useField('');
const password = useField('');
const repassword = useField('');
const message = ref('');

const { register } = useUser()
const router = useRouter()

const validate = () => {
    const isValid = true
    if (firstname.field.value === '') {
        firstname.error = 'Имя не может быть пустым'
        isValid = false
    }
    if (username.field.value === '') {
        username.error = 'Имя пользователя не может быть пустым'
        isValid = false
    }
    if (password.field.value === '') {
        firstname.error = 'Пароль не может быть пустым'
        isValid = false
    }
    if (repassword.field.value !== password.field.value) {
        repassword.error = 'Пароли не совпадают'
        isValid = false
    }
    return isValid
}

const submit = () => {
    if (!validate()) return

    const user = {
        firstname: firstname.field.value,
        secondname: secondname.field.value,
        username: username.field.value,
        password: password.field.value,
        logoSrc: '',
        id: Math.random()
    }
    const response = register(user)
    console.log(response);

    if (response.code === 200) {
        router.push({ name: 'Login' })
    } else {
        message.value = 'Ошибка сервера!'
    }
}
</script>

<style scoped>
.w-full {
    width: 100%;
}
</style>