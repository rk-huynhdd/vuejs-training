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
  if (
    criteria.value.date &&
    criteria.value.date.length === 2 &&
    criteria.value.date[0] &&
    criteria.value.date[1]
  ) {
    const startDate = dayjs(criteria.value.date[0]).startOf("day").valueOf();
    const endDate = dayjs(criteria.value.date[1]).endOf("day").valueOf();
    newArray = newArray.filter((form) => {
      if (!form.date) return false;
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
    dataIndex: "status",
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
    <div class="admin-leave-container">
      <div class="page-header">
        <h2 class="page-title">Leave Management</h2>
        <p class="page-subtitle">
          Review, approve, or reject employee leave requests
        </p>
      </div>

      <a-card class="filter-card" :bordered="false">
        <div class="filter-wrapper">
          <div class="filter-group">
            <span class="filter-label">Filter by Status</span>
            <a-select
              v-model:value="criteria.status"
              class="custom-select"
              allowClear
            >
              <template #placeholder>
                <AppstoreTwoTone /> Select form status
              </template>
              <a-select-option value="">All Statuses</a-select-option>
              <a-select-option value="Approve">
                <a-tag color="success" class="status-tag">Approve</a-tag>
              </a-select-option>
              <a-select-option value="Reject">
                <a-tag color="error" class="status-tag">Reject</a-tag>
              </a-select-option>
              <a-select-option value="Pending">
                <a-tag color="warning" class="status-tag">Pending</a-tag>
              </a-select-option>
            </a-select>
          </div>
          <div class="filter-group">
            <span class="filter-label">Filter by Date Range</span>
            <a-range-picker
              class="custom-picker"
              v-model:value="criteria.date"
            ></a-range-picker>
          </div>
        </div>
      </a-card>

      <a-card class="table-card" :bordered="false">
        <EmployeeTable
          v-model:list="filteredForms"
          :columns="columns"
          rowKey="formId"
          @change-status="changeStatus"
          @change-multi="handleChangeMulti"
        />
      </a-card>
    </div>
  </MainLayout>
</template>

<style scoped>
.admin-leave-container {
  padding: 0 12px 24px;
  animation: fadeIn 0.4s ease-in-out;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-top: 6px;
  font-weight: 400;
}

.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  background: white;
  transition: box-shadow 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.filter-wrapper {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-select {
  width: 260px;
}

.custom-picker {
  width: 320px;
}

.status-tag {
  min-width: 80px;
  text-align: center;
  font-weight: 500;
  border-radius: 4px;
  padding: 2px 8px;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  background: white;
  overflow: hidden;
}

:deep(.ant-card-body) {
  padding: 24px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 8px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  height: auto !important;
}

:deep(.ant-select-selection-item) {
  display: flex;
  align-items: center;
}
</style>
