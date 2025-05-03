<template>
  <Button
    icon="pi pi-bell"
    aria-label="Save"
    variant="outlined"
    @click="toggle"
  />
  <Popover ref="op">
    <div class="notifs">
        <div class="notifs__item">
            <i class="pi pi-verified"></i>
            <p>Одобрено</p>
        </div>
    </div>
  </Popover>
</template>
<script setup>
import { Button, Dialog, Popover } from "primevue";
import { ref } from "vue";

const op = ref()

const toggle = (event) => op.value.toggle(event)
</script>
