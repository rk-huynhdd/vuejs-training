<script setup>
import { computed, onMounted, ref } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import useEmployees from "../../stores/employee";
import EmployeeTable from "../../components/employee/EmployeeTable.vue";
import useAuthStore from "../../stores/auth";
import useUiStore from "../../stores/UIstore";

const employeeStore = useEmployees();
const authStore = useAuthStore();
const UIStore = useUiStore();
const name = ref("");
const query = ref("");
const filteredEmployees = computed(() => {
  const newList = employeeStore.employeeList.filter((person) => {
    return person.username.includes(query.value.toLocaleLowerCase().trim());
  });

  return newList;
});
const handleSearch = () => {
  UIStore.isLoading = true;
  setTimeout(() => {
    query.value = name.value;
    UIStore.isLoading = false;
  }, 3000);
};
</script>
<template>
  <MainLayout>
    <a-input-search
      v-model:value="name"
      placeholder="Enter name..."
      :loading="UIStore.isLoading"
      enter-button
      v-if="authStore.user.role === 'admin'"
      style="width: 500px; height: 50px"
      @search="handleSearch"
    />
    <EmployeeTable v-model:list="filteredEmployees" />
  </MainLayout>
</template>
