<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import useEmployees from "../../stores/employee";
import { useRouter } from "vue-router";
import useUiStore from "../../stores/UIstore";

const employeeStore = useEmployees();
const currentPage = ref(1);
const keyword = ref("");
const query = ref("");
const pageSize = 5;
const filteredEmployees = computed(() => {
  return employeeStore.employeeList.filter((employee) => {
    return employee.username.includes(query.value);
  });
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
watch(query, () => {
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
