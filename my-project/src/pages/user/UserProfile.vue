<script setup>
import { useRouter } from "vue-router";

import useAuthStore from "../../stores/auth";
import { computed, onMounted } from "vue";
import useEmployees from "../../stores/employee";
import useUiStore from "../../stores/UIstore";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { message } from "ant-design-vue";

const authStore = useAuthStore();
const employeeStore = useEmployees();
const UIStore = useUiStore();
const router = useRouter();

const filteredEmployee = computed(() => {
  const index = employeeStore.employeeList.findIndex((employee) => {
    return employee.id === authStore.user.id;
  });

  const employee = {};
  if (index !== -1) {
    for (const attr of Object.keys(employeeStore.employeeList[index])) {
      if (
        attr === "id" ||
        attr === "firstName" ||
        attr === "lastName" ||
        attr === "age" ||
        attr === "gender" ||
        attr === "birthDate" ||
        attr === "email" ||
        attr === "phone"
      ) {
        employee[attr] = employeeStore.employeeList[index][attr];
      }
    }
    employee.title = employeeStore.employeeList[index].company.title;
    employee.department = employeeStore.employeeList[index].company.department;
  }

  return employee;
});
const handleSave = (id) => {
  Modal.confirm({
    title: "Do you Want save these changes?",
    icon: createVNode(ExclamationCircleOutlined),

    onOk() {
      employeeStore.getUpdated(id, filteredEmployee.value);
      if (UIStore.showSuccess) {
        message.success("Saved successfully !");
      }
    },
    onCancel() {
      console.log("Cancel");
    },
    class: "test",
  });
};
onMounted(async () => {
  await employeeStore.getData();
});
</script>
<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Back"
    @back="
      () => {
        if (authStore.user.role === 'admin') {
          router.push('dashboard');
        } else {
          router.push('/employees');
        }
      }
    "
  />
  <a-flex gap="60">
    <a-image :width="500" :src="authStore.user.image" :height="500" />
    <a-descriptions bordered>
      <template #title>
        <h3 style="text-align: center; padding: 15px; color: #4096ff">
          {{ authStore.user.username }}
        </h3>
      </template>
      <a-descriptions-item
        :label="atr.toUpperCase()"
        v-for="atr in Object.keys(filteredEmployee)"
        :style="{ marginTop: '15px' }"
        ><input v-model="filteredEmployee[atr]"
      /></a-descriptions-item>
    </a-descriptions>
  </a-flex>

  <a-flex justify="flex-end" style="margin-top: 15px"
    ><a-button
      type="primary"
      @click="handleSave(filteredEmployee.id)"
      :loading="UIStore.isLoading"
    >
      Save changes</a-button
    ></a-flex
  >
</template>
