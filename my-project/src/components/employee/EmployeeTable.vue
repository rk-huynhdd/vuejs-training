<script setup>
import { computed, onMounted, ref } from "vue";
import useEmployees from "../../stores/employee";
import useUiStore from "../../stores/UIstore";
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "username",
    key: "name",
  },
  {
    title: "Avatar",
    dataIndex: "image",
    key: "avt",
  },
  {
    title: "Job Title",
    dataIndex: ["company", "title"],
    key: "job",
  },
  {
    title: "Department",
    dataIndex: ["company", "department"],
    key: "department",
  },
];
const employeeStore = useEmployees();
const employeeList = defineModel("list");

const UIStore = useUiStore();
const selected = ref([]);
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selected.value,
    onChange: (selectedRowKeys, selectedRows) => {
      selected.value = selectedRowKeys;
      console.log(selectedRows);
    },
  };
});
onMounted(async () => {
  await employeeStore.getData();
});
</script>
<template>
  <a-table
    :loading="UIStore.isLoading"
    :columns="columns"
    :pagination="{ pageSize: 10 }"
    :scroll="{ y: 600, x: 'max-content' }"
    :data-source="employeeList"
    :row-selection="rowSelection"
    row-key="id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'avt'">
        <a-image :src="record.image" width="60px"></a-image>
      </template>
    </template>
  </a-table>
</template>
