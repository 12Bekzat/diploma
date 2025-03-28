<template>
    <div class="main">
        <p class="error-title">404</p>
        <p class="error-subtitle">Not Found</p>
        <Button label="Вернуться на главную" icon="pi pi-arrow-left" @click="$router.push({ name: 'Home' })"/>
    </div>
</template>
<script setup>
import { Button } from 'primevue';

</script>