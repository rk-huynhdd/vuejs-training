<script setup>
import { computed, onMounted, ref, watch } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import useEmployees from "../../stores/employee";
import { useRouter } from "vue-router";
import useUiStore from "../../stores/UIstore";
import {
  HomeOutlined,
  ContactsOutlined,
  FunnelPlotOutlined,
} from "@ant-design/icons-vue";

const employeeStore = useEmployees();
const currentPage = ref(1);
const keyword = ref("");
const query = ref("");
const criteria = ref({});
const pageSize = 5;
const filteredEmployees = computed(() => {
  let newEmployees = employeeStore.employeeList.filter((employee) => {
    return employee.username.includes(query.value);
  });
  if (criteria.value.department) {
    newEmployees = newEmployees.filter((employee) => {
      return employee.company.department === criteria.value.department;
    });
  }
  if (criteria.value.title) {
    newEmployees = newEmployees.filter((employee) => {
      return employee.company.title === criteria.value.title;
    });
  }
  if (criteria.value.sort) {
    if (criteria.value.sort === "asc") {
      newEmployees.sort((a, b) => a.username.localeCompare(b.username));
    } else if (criteria.value.sort === "desc") {
      newEmployees.sort((a, b) => b.username.localeCompare(a.username));
    }
  }

  return newEmployees;
});
const paginationEmployees = computed(() => {
  return filteredEmployees.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize,
  );
});

const handleSearch = () => {
  UIStore.isLoading = true;
  setTimeout(() => {
    query.value = keyword.value;
    UIStore.isLoading = false;

    UIStore.isLoading = false;
  }, 3000);
};
const router = useRouter();
const UIStore = useUiStore();
onMounted(async () => {
  await employeeStore.getData();
});
watch([query, criteria], () => {
  currentPage.value = 1;
});
</script>

<template>
  <MainLayout>
    <h1 :style="{ textAlign: 'center', padding: '15px', color: '#4096FF' }">
      Employee List
    </h1>
    <a-input-search
      v-model:value="keyword"
      placeholder="Type name.."
      :loading="UIStore.isLoading"
      enter-button
      :style="{ width: '30%', marginBottom: '15px', height: '35px' }"
      @search="handleSearch"
    />
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="criteria.sort = ''">None</a-menu-item>
          <a-menu-item @click="criteria.sort = 'asc'"> Asc (A-Z)</a-menu-item>
          <a-menu-item @click="criteria.sort = 'desc'"> Desc (Z-A)</a-menu-item>
        </a-menu>
      </template>
      <a-button type="primary" ghost>
        <FunnelPlotOutlined />
        {{ criteria.sort ? criteria.sort.toUpperCase() : "Sort" }}</a-button
      >
    </a-dropdown>
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
    <a-flex gap="middle" vertical>
      <a-card
        v-for="employee in paginationEmployees"
        hoverable
        v-if="paginationEmployees.length > 0"
        @click="router.push(`employees/${employee.id}`)"
      >
        <template #title>
          <a-flex gap="15">
            <a-avatar size="64" :src="employee.image"> </a-avatar>
            <h3>{{ employee.username }}</h3>
          </a-flex>
        </template>
        <p>{{ employee.company.title }}</p>
        <p>{{ employee.company.department }}</p>
      </a-card>
      <p v-else style="color: red">No user found</p>
    </a-flex>
    <a-flex justify="flex-end" style>
      <a-pagination
        v-model:current="currentPage"
        :page-size="pageSize"
        :total="employeeStore.employeeList.length"
        show-less-items
      />
    </a-flex>
  </MainLayout>
</template>
