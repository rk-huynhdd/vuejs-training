<script setup>
import { computed, onMounted, ref, h } from "vue";
import useEmployees from "../../stores/employee";
import useUiStore from "../../stores/UIstore";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import {
  ExclamationCircleOutlined,
  VerticalAlignBottomOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import exportCSV from "../../composable/useExportCSV";
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
const loadingConfig = computed(() => {
  return {
    spinning: UIStore.isLoading,

    indicator: h(LoadingOutlined, {
      style: {
        fontSize: "40px",
        color: "cyan",
      },
      spin: true,
    }),
  };
});
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
  <div class="spin-container" v-if="UIStore.isLoading">
    <a-spin :spinning="UIStore.isLoading" size="large"> </a-spin>
  </div>
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
<style scoped>
.spin-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
