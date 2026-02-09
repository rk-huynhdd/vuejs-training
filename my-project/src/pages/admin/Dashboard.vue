<script setup>
import { computed, onMounted, ref } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import useEmployees from "../../stores/employee";
import EmployeeTable from "../../components/employee/EmployeeTable.vue";
import useAuthStore from "../../stores/auth";
import useUiStore from "../../stores/UIstore";
import { HomeOutlined, ContactsOutlined } from "@ant-design/icons-vue";
const employeeStore = useEmployees();
const authStore = useAuthStore();
const UIStore = useUiStore();
const name = ref("");
const query = ref("");
const criteria = ref({});

const filteredEmployees = computed(() => {
  let newList = employeeStore.employeeList.filter((person) => {
    return person.username.includes(query.value.toLocaleLowerCase().trim());
  });
  if (criteria.value.sort === "ascend") {
    newList.sort((a, b) => a.username.localeCompare(b.username));
  } else if (criteria.value.sort === "descend") {
    newList.sort((a, b) => b.username.localeCompare(a.username));
  }
  if (criteria.value.department) {
    newList = newList.filter((person) => {
      return person.company.department === criteria.value.department;
    });
  }
  if (criteria.value.title) {
    newList = newList.filter((person) => {
      return person.company.title === criteria.value.title;
    });
  }
  return newList;
});
const handleSearch = () => {
  UIStore.isLoading = true;
  setTimeout(() => {
    query.value = name.value;
    UIStore.isLoading = false;
  }, 3000);
};

onMounted(async () => {
  await employeeStore.getData();
});
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
    <a-select v-model:value="criteria.department" style="width: 300px">
      <template #placeholder>
        <HomeOutlined style="margin-right: 10px" /> Select your department
      </template>
      <a-select-option value=""> All </a-select-option>
      <a-select-option
        v-for="department in employeeStore.departmentList"
        :value="department"
        >{{ department }}
      </a-select-option>
    </a-select>

    <a-select v-model:value="criteria.title" style="width: 300px">
      <template #placeholder>
        <ContactsOutlined style="margin-right: 10px" /> Select your title
      </template>
      <a-select-option value=""> All </a-select-option>
      <a-select-option v-for="title in employeeStore.titleList" :value="title"
        >{{ title }}
      </a-select-option>
    </a-select>

    <EmployeeTable
      v-model:list="filteredEmployees"
      v-model:criteria="criteria"
    />
  </MainLayout>
</template>
