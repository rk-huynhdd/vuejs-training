<script setup>
import { computed, onMounted, ref, h } from "vue";
import useEmployees from "../../stores/employee";
import useUiStore from "../../stores/UIstore";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import {
  ExclamationCircleOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import exportCSV from "../../composable/useExportCSV";
import Loading from "../../common/Loading.vue";
const employeeStore = useEmployees();
const employeeList = defineModel("list");
const criteria = defineModel("criteria");
const router = useRouter();
const UIStore = useUiStore();
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
    sorter: true,
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

const selected = ref([]);
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selected.value,
    onChange: (selectedRowKeys, selectedRows) => {
      selected.value = selectedRowKeys;
    },
  };
});
const handleChange = (pagination, filter, sorter) => {
  UIStore.isLoading = true;
  setTimeout(() => {
    criteria.value.sort = sorter.order;
    UIStore.isLoading = false;
  }, 3000);
};
const handleDelete = (id) => {
  Modal.confirm({
    title: "Do you Want to delete this employee ?",
    icon: createVNode(ExclamationCircleOutlined),

    onOk() {
      employeeStore.deleteEmployee(id);
      openNotification();
      selected.value = [];
    },
    onCancel() {},
    class: "test",
  });
};
const handleExport = () => {
  exportCSV(columns.slice(0, [columns.length - 1]), employeeList.value);
};

onMounted(async () => {
  await employeeStore.getData();
});
</script>
<template>
  <a-flex justify="flex-end">
    <a-button
      type="primary"
      danger
      v-if="selected.length > 0"
      :style="{ marginLeft: '50px' }"
      @click="handleDelete(selected)"
    >
      Delete many</a-button
    >
    <a-button type="primary" @click="handleExport">
      <VerticalAlignBottomOutlined /> Export to CSV</a-button
    >
  </a-flex>
  <Loading v-model:is-loading="UIStore.isLoading" />
  <a-table
    :loading="false"
    :columns="columns"
    :pagination="{ pageSize: 10 }"
    :scroll="{ y: 600, x: 'max-content' }"
    :data-source="employeeList"
    :row-selection="rowSelection"
    row-key="id"
    @change="handleChange"
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
            @click="handleDelete(record.id)"
            >Delete</a-button
          >
        </a-flex>
      </template>
    </template>
  </a-table>
</template>
