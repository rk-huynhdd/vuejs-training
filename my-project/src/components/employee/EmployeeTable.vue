<script setup>
import { computed, onMounted, ref } from "vue";
import useEmployees from "../../stores/employee";
import useUiStore from "../../stores/UIstore";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
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
  {
    title: "Actions",
    key: "action",
    fixed: "right",
  },
];
const openNotification = () => {
  notification.open({
    message: "Deleted Employee successfully",
    description:
      "However, if the page is reloaded, the employee will appear back again",
    style: { color: "red" },
  });
};
const employeeStore = useEmployees();
const employeeList = defineModel("list");
const router = useRouter();
const UIStore = useUiStore();
const selected = ref([]);
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selected.value,
    onChange: (selectedRowKeys, selectedRows) => {
      selected.value = selectedRowKeys;
    },
  };
});
onMounted(async () => {
  await employeeStore.getData();
});
</script>
<template>
  <a-button
    type="primary"
    danger
    v-if="selected.length > 0"
    :style="{ marginLeft: '50px' }"
    @click="
      () => {
        employeeStore.deleteEmployee(selected);
        openNotification();
      }
    "
  >
    Delete many</a-button
  >
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
      <template v-if="column.key === 'action'">
        <a-flex gap="10">
          <a-button
            type="primary"
            size="small"
            ghost
            @click="router.push(`/employees/${record.id}`)"
            >View details</a-button
          >
          <a-button
            type="primary"
            danger
            size="small"
            @click="
              () => {
                employeeStore.deleteEmployee(record.id);
                openNotification();
              }
            "
            >Delete</a-button
          >
        </a-flex>
      </template>
    </template>
  </a-table>
</template>
