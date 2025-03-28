<template>
  <div class="main">
    <Card style="max-width: 800px; width: 100%">
      <template #title>Создать запрос</template>
      <template #content>
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          "
        >
          <InputGroup class="md:w-80">
            <InputGroupAddon>
              <i class="pi pi-pen-to-square"></i>
            </InputGroupAddon>
            <FloatLabel variant="on">
              <InputText v-model="item.type" />
              <label for="price">Тип запроса</label>
            </FloatLabel>
          </InputGroup>
          <InputGroup class="md:w-80">
            <InputGroupAddon>
              <i class="pi pi-pen-to-square"></i>
            </InputGroupAddon>
            <FloatLabel variant="on">
              <Textarea
                id="over_label"
                v-model="item.description"
                style="resize: none; width: 100%"
              />
              <label for="over_label">Описание</label>
            </FloatLabel>
          </InputGroup>
          <FileUpload
            name="demo[]"
            url="/api/upload"
            style="width: 100%"
            class="file-upload"
            @upload="onTemplatedUpload($event)"
            :multiple="true"
            :maxFileSize="1000000"
            @select="onSelectedFiles"
          >
            <template
              #header="{ chooseCallback, uploadCallback, clearCallback, files }"
            >
              <div
                class="flex flex-wrap justify-between items-center flex-1 gap-4"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 16px;
                  flex-wrap: wrap;
                  width: 100%;
                "
              >
                <div class="flex gap-2">
                  <Button
                    @click="chooseCallback()"
                    icon="pi pi-images"
                    rounded
                    outlined
                    severity="secondary"
                  ></Button>
                  <Button
                    @click="uploadEvent(uploadCallback)"
                    icon="pi pi-cloud-upload"
                    rounded
                    outlined
                    severity="success"
                    :disabled="!files || files.length === 0"
                  ></Button>
                  <Button
                    @click="clearCallback()"
                    icon="pi pi-times"
                    rounded
                    outlined
                    severity="danger"
                    :disabled="!files || files.length === 0"
                  ></Button>
                </div>
                <ProgressBar
                  :value="totalSizePercent"
                  :showValue="false"
                  class=""
                  style="width: 100%"
                >
                  <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                </ProgressBar>
              </div>
            </template>
            <template
              #content="{
                files,
                uploadedFiles,
                removeUploadedFileCallback,
                removeFileCallback,
                messages,
              }"
            >
              <div class="flex flex-col gap-8 pt-4">
                <div v-if="files.length > 0">
                  <h5>Pending</h5>
                  <div class="flex flex-wrap gap-4">
                    <div
                      v-for="(file, index) of files"
                      :key="file.name + file.type + file.size"
                      class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
                    >
                      <div>
                        <img
                          role="presentation"
                          :alt="file.name"
                          :src="file.objectURL"
                          width="100"
                          height="50"
                        />
                      </div>
                      <span
                        class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                        >{{ file.name }}</span
                      >
                      <div>{{ formatSize(file.size) }}</div>
                      <Badge value="Pending" severity="warn" />
                      <Button
                        icon="pi pi-times"
                        @click="
                          onRemoveTemplatingFile(
                            file,
                            removeFileCallback,
                            index
                          )
                        "
                        outlined
                        rounded
                        severity="danger"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                  <h5>Completed</h5>
                  <div class="flex flex-wrap gap-4">
                    <div
                      v-for="(file, index) of uploadedFiles"
                      :key="file.name + file.type + file.size"
                      class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
                      style="
                        display: flex;
                        flex-direction: column;
                        border: 1px solid #e2e8f0;
                        padding: 16px;
                        border-radius: 12px;
                        align-items: center;
                        gap: 12px;
                      "
                    >
                      <div>
                        <img
                          role="presentation"
                          :alt="file.name"
                          :src="file.objectURL"
                          width="100"
                          height="50"
                        />
                      </div>
                      <span
                        class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                        >{{ file.name }}</span
                      >
                      <div>{{ formatSize(file.size) }}</div>
                      <Badge
                        value="Completed"
                        class="mt-4"
                        severity="success"
                      />
                      <Button
                        icon="pi pi-times"
                        @click="removeUploadedFileCallback(index)"
                        outlined
                        rounded
                        severity="danger"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #empty>
              <div
                class="flex items-center justify-center flex-col"
                style="
                  display: flex;
                  width: 100%;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                "
              >
                <i class="pi pi-cloud-upload" style="font-size: 48px" />
                <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
              </div>
            </template>
          </FileUpload>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="Сохранить" class="w-full" @click="submit" />
        </div>
      </template>
    </Card>
    <Toast position="bottom-center" />
  </div>
</template>
<script setup>
import { useQueries } from "@/composables/useQueries";
import {
  Badge,
  Button,
  Card,
  FileUpload,
  FloatLabel,
  InputGroup,
  InputGroupAddon,
  InputNumber,
  InputText,
  ProgressBar,
  Textarea,
  Toast,
  useToast,
} from "primevue";
import { ref } from "vue";
const item = ref({});

const toast = useToast();
const { create, createFile } = useQueries();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = 1000000;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

const submit = () => {
  const { code } = create({ item }, { serviceName: 'Request' });

  if (code == 200) {
    const { code: fileCode } = createFile({ item: [] }, { serviceName: 'Request' });

    if (fileCode == 200) {
      toast.add({
        severity: "success",
        summary: "Успешно!",
        detail: "Файл успешно загружен!",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Ошибка",
        detail: "Файл не сохранен!",
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Ошибка при создании запроса!",
      life: 3000,
    });
  }
};
</script>
