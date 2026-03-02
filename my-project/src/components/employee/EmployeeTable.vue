<script setup>
import { computed, onMounted, ref, toRaw } from "vue";
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
const props = defineProps(["columns", "rowKey"]);
const openNotification = () => {
  notification.open({
    message: "Deleted Employee successfully",
    description:
      "However, if the page is reloaded, the employee will appear back again",
    style: { color: "red" },
  });
};

const selected = ref([]);
const selectedRecord = ref([]);
const rowSelection = computed(() => {
  return {
    selectedRowKeys: selected.value,
    onChange: (selectedRowKeys, selectedRows) => {
      selected.value = selectedRowKeys;
      selectedRecord.value = selectedRows;
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
const temporaryStatus = ref(undefined);

const emit = defineEmits(["changeStatus", "changeMulti"]);
const handleChangeStatus = (value, option) => {
  emit("changeStatus", option);
};
const handleChangeMulti = () => {
  let userIds = selectedRecord.value.map((record) => {
    return record.userId;
  });
  emit("changeMulti", {
    ids: toRaw(selected.value),
    status: toRaw(temporaryStatus.value),
    userIds,
  });
  selected.value = [];
  temporaryStatus.value = undefined;
  selectedRecord.value = [];
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
      v-if="selected.length > 0 && props.rowKey !== 'formId'"
      :style="{ marginLeft: '50px' }"
      @click="handleDelete(selected)"
    >
      Delete many</a-button
    >
    <a-select
      v-model:value="temporaryStatus"
      style="width: 200px; margin-right: 30px"
      :disabled="selected.length === 0 && props.rowKey === 'formId'"
    >
      <template #placeholder> <AppstoreTwoTone />Change status</template>

      <a-select-option value="Approve"
        ><a-tag color="success">Approve</a-tag></a-select-option
      >
      <a-select-option value="Reject"
        ><a-tag color="error">Reject</a-tag></a-select-option
      >
      <a-select-option value="Pending"
        ><a-tag color="warning"></a-tag
      ></a-select-option>
    </a-select>
    <a-button
      v-if="selected.length > 0"
      type="primary"
      @click="handleChangeMulti"
      style="margin-right: 30px"
    >
      Apply</a-button
    >

    <a-button type="primary" @click="handleExport">
      <VerticalAlignBottomOutlined /> Export to CSV</a-button
    >
  </a-flex>
  <Loading v-model:is-loading="UIStore.isLoading" />
  <a-table
    :columns="props.columns"
    :pagination="{ pageSize: 10 }"
    :scroll="{ y: 600, x: 'max-content' }"
    :data-source="employeeList"
    :row-selection="rowSelection"
    :row-key="props.rowKey"
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

      <template v-if="column.key === 'status'">
        <a-select
          style="width: 160px"
          v-model:value="record.status"
          @change="
            (value) => {
              handleChangeStatus(value, record);
            }
          "
        >
          <a-select-option value="Pending">
            <a-tag color="warning">Pending</a-tag>
          </a-select-option>
          <a-select-option value="Reject ">
            <a-tag color="error">Reject</a-tag></a-select-option
          >
          <a-select-option value="Approve">
            <a-tag color="success">Approve</a-tag></a-select-option
          >
          <!-- <a-tag
            :color="
              record.status === 'Approve'
                ? 'success'
                : status === 'Reject'
                  ? 'error'
                  : 'warning'
            "
            >{{ record.status }}</a-tag
          > -->
        </a-select>
      </template>
      <template v-if="column.key === 'form-action'">
        <a-button
          type="primary"
          ghost
          @click="
            router.push({
              name: 'FormDetails',
              params: {
                formId: record.formId,
              },
            })
          "
          >View details</a-button
        >
      </template>
    </template>
  </a-table>
</template>
