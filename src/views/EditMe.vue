<template>
    <div class="main">
        <Card style="width: 500px">
            <template #content>
                <div class="form__content">
                    <div class="form__title">Редактировать профиль</div>
                    <InputText v-model="item.fullName" name="first" type="text" placeholder="Полное имя"
                        style="width: 100%" />
                    <InputText v-model="item.email" type="text" placeholder="Email" autocomplete="off"
                        style="width: 100%" />
                    <InputText v-model="item.url" type="text" placeholder="Ссылка на фото" autocomplete="off"
                        style="width: 100%" />
                    <Password v-model="password.orignal" placeholder="Пароль" toggle-mask :style="{ width: '100%' }"
                        :input-style="{ width: '100%' }" />
                    <Password v-model="password.repeat" placeholder="Повторите пароль" toggle-mask
                        :style="{ width: '100%' }" :input-style="{ width: '100%' }" />
                    <Message v-if="message" severity="error" size="small" variant="simple">{{ message }}</Message>
                    <Button type="submit" label="Сохранить" @click="submit" style="margin-top: 12px;"/>
                </div>
            </template>
        </Card>
    </div>
</template>
<script setup>
import { useQueries } from '@/composables/useQueries';
import { useMainStore } from '@/stores/mainStore';
import { storeToRefs } from 'pinia';
import { Button, Card, InputText, Message, Password } from 'primevue';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const store = useMainStore()
const { currentUser } = storeToRefs(store)

const { update } = useQueries()

const item = ref({})
const password = ref({
    orignal: '',
    repeat: ''
})
const message = ref('');

onMounted(() => {
    item.value = currentUser.value
})

const router = useRouter()

const validate = () => {
    if (password.value.orignal !== password.value.repeat) return false
    
    return true
}

const submit = async () => {
    const isValid = validate()
    if (!isValid) return

    const sendItem = {
        id: currentUser.value?.id,
        userDto: { ...item.value, password: password.value.orignal, roles: [], username: '' }
    }

    await update({ item: sendItem, serviceName: 'users' })
}
</script>