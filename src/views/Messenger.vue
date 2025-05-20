<template>
  <div class="main">
    <Splitter style="height: 800px; width: 100%">
      <SplitterPanel
        class="flex items-center justify-center"
        :size="25"
        :minSize="10"
      >
        <div class="users">
          <div :class="'user' + (activeUser?.id === user?.id ? ' active' : '')" v-for="user in users" @click="activeUser = user"> {{ user.fullName || 'Имя пользователя' }} </div>
        </div>
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center" :size="75">
        <div class="chat">
            <div class="messenger">
              <div :class="'messenger__text' + (currentUser.id === message.sender.id ? ' author' : '')" v-for="message in messages">{{ message.text }}
                <div class="time">{{ moment(message.createdAt).format('HH:mm') }}</div>
              </div>
            </div>
            <div class="manage">
                <IconField style="flex-grow: 1;">
                    <InputIcon class="pi pi-send" />
                    <InputText v-model="mess" placeholder="Сообщение" style="width: 100%;"/>
                </IconField>
                <Button icon="pi pi-send" aria-label="Отправить" @click="submit"/>
            </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import { useMainStore } from "@/stores/mainStore";
import moment from "moment";
import { storeToRefs } from "pinia";
import { Button, IconField, InputIcon, InputText, Splitter, SplitterPanel } from "primevue";
import { onMounted, ref, watch } from "vue";

const mess = ref('')
const { getPaged, getMessages, sendMessage } = useQueries()
const users = ref([])
const activeUser = ref({})
const store = useMainStore()
const { currentUser } = storeToRefs(store)
const messages = ref([])

onMounted(async () => {
  await getAdmins()
})

watch(activeUser, async () => {
  await get()
})

const submit = async () => {
  if (!activeUser.value) return
  await sendMessage({ receiverId: activeUser.value?.id, senderId: currentUser.value?.id, text: mess.value })
  mess.value = ''
  await get()
}

const get = async () => {
  messages.value = await getMessages({ receiverId: activeUser.value?.id, senderId: currentUser.value?.id })
}

const getAdmins = async () => {
  users.value = await getPaged({ serviceName: 'users' })
  if (currentUser.value.roles.filter(role => role.name === 'ROLE_ADMIN').length > 0) {
    users.value = users.value.filter(user => user.roles.find(role => role.name !== 'ROLE_ADMIN'))
  } else users.value = users.value.filter(user => user.roles.find(role => role.name === 'ROLE_ADMIN'))
  if (users.value.length > 0) activeUser.value = users.value[0]
}
</script>
