<template>
  <div class="main">
    <Splitter style="height: 800px; width: 100%">
      <SplitterPanel
        class="flex items-center justify-center"
        :size="25"
        :minSize="10"
      >
        <div class="users">
          <div class="user">Admin</div>
        </div>
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center" :size="75">
        <div class="chat">
            <div class="messenger">
              <div class="messenger__text author">Я хотел бы уточнить насчет запроса</div>
              <div class="messenger__text">Привет</div>
              <div class="messenger__text author">Привет</div>
            </div>
            <div class="manage">
                <IconField style="flex-grow: 1;">
                    <InputIcon class="pi pi-send" />
                    <InputText v-model="mess" placeholder="Сообщение" style="width: 100%;"/>
                </IconField>
                <Button icon="pi pi-send" aria-label="Отправить" />
            </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
<script setup>
import { Button, IconField, InputIcon, InputText, Splitter, SplitterPanel } from "primevue";
import { ref } from "vue";

const mess = ref('')
</script>
