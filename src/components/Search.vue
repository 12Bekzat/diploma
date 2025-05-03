<template>
    <InputText v-model:model-value="text" placeholder="Search" type="text" class="w-32 sm:w-auto" />
    <Popover ref="op">
        <div class="texts">
            <div class="texts__item" v-for="user in showUsers">
                {{ user.firstName + ' ' + user.secondName }}
            </div>
        </div>
    </Popover>
</template>
<script setup>
import { useUser } from '@/composables/useUser';
import { InputText, Popover } from 'primevue';
import { ref, watch } from 'vue';

const text = ref('')
const op = ref()
const showUsers = ref([])

watch(text, () => {
    console.log(users);
    
    showUsers.value = users.value.filter(item => item.firstName.includes(text.value) || item.secondName.includes(text.value))
    if (text.value && showUsers.value.length > 0) {
        op.value.toggle()
    }
})

const { users } = useUser()
</script>