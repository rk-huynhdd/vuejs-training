<script setup>
import { computed, onMounted } from "vue";
import useEmployees from "../../stores/employee";
import { useRoute, useRouter } from "vue-router";
import useUiStore from "../../stores/UIstore";
import useAuthStore from "../../stores/auth";
const employeeStore = useEmployees();
const UIStore = useUiStore();
const route = useRoute();
const router = useRouter();
const userId = route.params.id;
const authStore = useAuthStore();
const filteredEmployee = computed(() => {
  const employee = {};
  for (const attr of Object.keys(employeeStore.currentEmployee)) {
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
      employee[attr] = employeeStore.currentEmployee[attr];
    }
    employee.title = employeeStore.currentEmployee.company.title;
    employee.department = employeeStore.currentEmployee.company.department;
  }
  return employee;
});
onMounted(async () => {
  await employeeStore.getData();
  await employeeStore.getOneEmployee(userId);
  document.title = employeeStore.currentEmployee.username;
});
</script>
<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Back"
    @back="() => router.push('/dashboard')"
  />
  <a-flex value="vertical" :style="{ marginTop: '35px' }" gap="2px">
    <a-card
      style="
        width: 30%;
        box-shadow:
          rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
          rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      "
      :loading="UIStore.isLoading"
    >
      <template #cover>
        <a-image
          alt="User avatar"
          :src="employeeStore.currentEmployee.image"
          :loading="UIStore.isLoading"
          width="500px"
        />
      </template>
      <a-card-meta>
        <template #title>
          <div :style="{ textAlign: 'center', fontWeight: 'bold' }">
            {{ employeeStore.currentEmployee.username }}
          </div>
        </template>
      </a-card-meta>
    </a-card>
    <a-card
      :bordered="true"
      style="
        width: 70%;
        box-shadow:
          rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
          rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      "
      :loading="UIStore.isLoading"
    >
      <template #title>
        <h3 :style="{ textAlign: 'center' }">Information Details</h3>
      </template>
      <a-row>
        <a-col
          span="8"
          v-for="atr in Object.keys(filteredEmployee)"
          :style="{
            padding: '14px',
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
          }"
        >
          <p style="color: blue; font-weight: bold">{{ atr.toUpperCase() }}</p>
          <input
            v-model="filteredEmployee[atr]"
            v-if="authStore.user.role === 'admin'"
          />
        </a-col>
      </a-row>
    </a-card>
  </a-flex>
</template>
