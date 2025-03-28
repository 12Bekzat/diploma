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
                    <InputText v-model="firstname.value" name="first" type="text" placeholder="Имя"
                        style="width: 100%" />
                    <Message v-if="firstname.error" style="width: 100%;" severity="error" size="small" variant="simple">
                        {{ firstname.error
                        }}</Message>

                    <InputText v-model="secondname.value" name="second" type="text" placeholder="Фамилия"
                        style="width: 100%" />
                    <Message v-if="secondname.error" style="width: 100%;" severity="error" size="small"
                        variant="simple">{{ secondname.error
                        }}</Message>
                    <InputText v-model="username.value" type="text" placeholder="Имя пользователя"
                        style="width: 100%" />
                    <Message v-if="username.error" style="width: 100%;" severity="error" size="small" variant="simple">
                        {{ username.error }}
                    </Message>
                    <Password v-model="password.value" placeholder="Пароль" toggle-mask :style="{ width: '100%' }"
                        :input-style="{ width: '100%' }" />
                    <Message v-if="password.error" style="width: 100%;" severity="error" size="small" variant="simple">
                        {{ password.error }}
                    </Message>
                    <Password v-model="repassword.value" placeholder="Повторите пароль" toggle-mask
                        :style="{ width: '100%' }" :input-style="{ width: '100%' }" />
                    <Message v-if="repassword.error" style="width: 100%;" severity="error" size="small"
                        variant="simple">{{ repassword.error }}</Message>
                    <Message v-if="message" severity="error" size="small" variant="simple">{{ message }}</Message>
                    <RouterLink to="/login" style="width: 100%; text-decoration: none; text-align: end; color: cornflowerblue; margin: 12px 0;">Уже есть аккаунт?</RouterLink>
                    <Button type="submit" label="Регистрация" @click="submit" />
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

const firstname = ref({
    value: '',
    error: '',
});
const secondname = ref({
    value: '',
    error: '',
});
const username = ref({
    value: '',
    error: '',
});
const password = ref({
    value: '',
    error: '',
});
const repassword = ref({
    value: '',
    error: '',
});
const message = ref('');

const { register } = useUser()
const router = useRouter()

const validate = () => {
    let isValid = true
    console.log(firstname.value.value);
    console.log(username.value.value);
    console.log(password.value.value);
    console.log(repassword.value.value);
    if (firstname.value.value == '') {
        firstname.value.error = 'Имя не может быть пустым'
        isValid = false
        console.log(firstname.value.error);
    }
    if (username.value.value == '') {
        username.value.error = 'Имя пользователя не может быть пустым'
        isValid = false
        console.log(username.error.value);
    }
    if (password.value.value == '') {
        password.value.error = 'Пароль не может быть пустым'
        isValid = false
        console.log(password.value.error);
    }
    if (repassword.value.value != password.value.value || password.value.value == '') {
        repassword.value.error = 'Пароли не совпадают'
        isValid = false
        console.log(repassword.value.error);
    }
    
    return isValid
}

const submit = () => {
    const isValid = validate()
    if (!isValid) return

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