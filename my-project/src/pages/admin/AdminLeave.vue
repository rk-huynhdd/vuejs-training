<script setup>
import { computed, onMounted, ref } from "vue";
import useLeaveStore from "../../stores/useLeaveStore";
import { useRouter } from "vue-router";
import { AppstoreTwoTone } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import EmployeeTable from "../../components/employee/EmployeeTable.vue";
import MainLayout from "../../layouts/MainLayout.vue";
import useUiStore from "../../stores/UIstore";
const router = useRouter();
const leaveStore = useLeaveStore();
const UIStore = useUiStore();
const criteria = ref({});

const filteredForms = computed(() => {
  let newArray = leaveStore.allForms;
  if (criteria.value.status) {
    newArray = newArray.filter((form) => {
      return form.status === criteria.value.status;
    });
  }
  if (criteria.value.date) {
    const startDate = criteria.value.date[0].valueOf();
    const endDate = criteria.value.date[1].valueOf();
    newArray = newArray.filter((form) => {
      const dateOfForm = dayjs(form.date).valueOf();
      return startDate <= dateOfForm && dateOfForm <= endDate;
    });
  }
  return newArray;
});
const columns = [
  {
    title: "ID",
    dataIndex: "formId",
    key: "id",
  },
  {
    title: "Sender",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },

  {
    title: "Status",
    key: "status",
  },
  {
    title: "Action",
    key: "form-action",
  },
];
const openMessage = () => {
  if (UIStore.showSuccess) {
    message.success({
      content: UIStore.success,
      duration: 3,
      onClose: () => {
        UIStore.showSuccess = false;
        UIStore.success = "";
      },
    });
  }
  if (UIStore.showError) {
    message.error({
      content: UIStore.error,
      duration: 3,
      onClose: () => {
        UIStore.showError = false;
        UIStore.error = "";
      },
    });
  }
};

const changeStatus = async (user) => {
  await leaveStore.changeFormStatus(user.userId, user.formId, user.status);
  openMessage();
};
const handleChangeMulti = async (value) => {
  for (const userId of value.userIds) {
    for (const formId of value.ids) {
      await leaveStore.changeFormStatus(userId, formId, value.status);
    }
  }
  await leaveStore.getAllForms();
};
onMounted(async () => {
  await leaveStore.getAllForms();
});
</script>
<template>
  <MainLayout>
    <a-flex align="center" gap="middle" style="margin-bottom: 20px">
      <a-select
        v-model:value="criteria.status"
        style="width: 300px; margin-left: 30px"
      >
        <template #placeholder>
          <AppstoreTwoTone /> Select form status</template
        >
        <a-select-option value="">All</a-select-option>
        <a-select-option value="Approve"
          ><a-tag color="success">Approve</a-tag></a-select-option
        >
        <a-select-option value="Reject"
          ><a-tag color="error">Reject</a-tag></a-select-option
        >
        <a-select-option value="Pending"
          ><a-tag color="warning">Pending</a-tag></a-select-option
        >
      </a-select>
      <a-range-picker v-model:value="criteria.date"></a-range-picker>
    </a-flex>
    <!-- table -->
    <!-- <a-flex gap="middle" vertical style="margin-left: 30px">
    <p v-if="filteredForms.length == 0">There is no form</p>
    <a-card
      v-else
      v-for="form in filteredForms"
      :key="form.formId"
      :style="{
        border: '1px solid black',
        cursor: 'pointer',
        width: '50%',
      }"
      @click="
        router.push({
          name: 'FormDetails',
          params: {
            formId: form.formId,
          },
        })
      "
    >
      <template #title>
        <p :style="{ color: form.status === 'Pending' ? 'black' : 'gray' }">
          Leaving form of {{ form.name }}
        </p>
      </template>
      <time :style="{ color: form.status === 'Pending' ? 'black' : 'gray' }">{{
        form.date
      }}</time>

      <a-tag
        :style="{ marginLeft: '10px' }"
        :color="
          form.status !== 'Pending'
            ? form.status === 'Approve'
              ? 'success'
              : 'error'
            : 'warning'
        "
        >{{ form.status }}</a-tag
      >
    </a-card>
  </a-flex> -->

    <EmployeeTable
      v-model:list="filteredForms"
      :columns="columns"
      rowKey="formId"
      @change-status="changeStatus"
      @change-multi="handleChangeMulti"
    />
  </MainLayout>
</template>
