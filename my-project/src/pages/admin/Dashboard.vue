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
const age = ref(0);

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
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item
            :style="{ background: '#CCCCCC' }"
            @click="
              () => {
                criteria.department = '';
              }
            "
          >
            None</a-menu-item
          >
          <a-menu-item
            v-for="employee in employeeStore.employeeList"
            @click="
              () => {
                criteria.department = employee.company.department;
              }
            "
          >
            {{ employee.company.department }}
          </a-menu-item>
        </a-menu>
      </template>
      <a-button type="primary" ghost style="margin-left: 15px">
        <home-outlined />
        {{ criteria.department ? criteria.department : "Department" }}
      </a-button>
    </a-dropdown>
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item
            :style="{ background: '#CCCCCC' }"
            @click="
              () => {
                criteria.title = '';
              }
            "
          >
            None</a-menu-item
          >
          <a-menu-item
            v-for="employee in employeeStore.employeeList"
            @click="
              () => {
                criteria.title = employee.company.title;
              }
            "
          >
            {{ employee.company.title }}
          </a-menu-item>
        </a-menu>
      </template>
      <a-button type="primary" ghost style="margin-left: 15px">
        <ContactsOutlined />
        {{ criteria.title ? criteria.title : "Title" }}
      </a-button>
    </a-dropdown>

    <EmployeeTable
      v-model:list="filteredEmployees"
      v-model:criteria="criteria"
    />
  </MainLayout>
</template>
