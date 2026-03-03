<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import useLeaveStore from "../../stores/useLeaveStore";
import useAuthStore from "../../stores/auth";
import getRandomInt from "../../composable/useGenRandom";
import FormDetails from "../../components/employee/FormDetails.vue";
import useUiStore from "../../stores/UIstore";
import Loading from "../../common/Loading.vue";
import { useRouter } from "vue-router";
import { PlusOutlined, AppstoreTwoTone } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import dayjs from "dayjs";
import MainLayout from "../../layouts/MainLayout.vue";

const leaveStore = useLeaveStore();
const authStore = useAuthStore();
const UIStore = useUiStore();

const showForm = ref(false);
const currentDetailsForm = ref(null);
const currentPage = ref(1);
const showDetails = ref(false);
const router = useRouter();
const formState = reactive({
  name: authStore.user.firstName + " " + authStore.user.lastName,
  reason: "",
  date: "",
});
const formData = computed(() => {
  return {
    userId: authStore.user.id + "",
    name: authStore.user.firstName + " " + authStore.user.lastName,
    reason: formState.reason,
    date: formState.date,
    status: "Pending",
  };
});

const openNotification = () => {
  if (UIStore.showSuccess) {
    notification.success({
      message: UIStore.success,
      style: { color: "green" },
      onClose: () => {
        UIStore.success = "";
        UIStore.showSuccess = false;
      },
    });
  } else if (UIStore.showError) {
    notification.error({
      message: UIStore.error,
      style: { color: "red" },
      onClose: () => {
        UIStore.error = "";
        UIStore.showError = false;
      },
    });
  }
};
const formRule = {
  name: [
    {
      required: true,
      message: "Name cannot be empty",
      trigger: "blur",
    },
  ],
  reason: [
    {
      required: true,
      message: "Please show your reason",
      trigger: "blur",
    },
  ],
  date: [
    {
      required: true,
      message: "Please enter your date",
      trigger: "blur",
    },
  ],
};
const formRef = ref(null);
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    formData.value.formId = getRandomInt(1, 9990) + "";
    await leaveStore.addNewForm(formData.value);
    openNotification();
    if (UIStore.showError) {
      return;
    }
    formState.reason = "";
    formState.date = "";
    showForm.value = false;
  } catch (error) {
    console.log(error);
  }
};
const criteria = ref({});
const filteredForms = computed(() => {
  let newArray = leaveStore.forms;
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
const pageSize = 5;
const paginationForms = computed(() => {
  return filteredForms.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize,
  );
});
watch(criteria, () => {
  currentPage.value = 1;
});
onMounted(async () => {
  try {
    UIStore.isLoading = true;
    await authStore.getUser();
    await leaveStore.getCurrentForms();
  } catch (err) {
  } finally {
    UIStore.isLoading = false;
  }
});
</script>
<template>
  <MainLayout>
    <Loading :is-loading="UIStore.isLoading" />
    <div class="employee-leave-container">
      <div class="page-header">
        <div class="header-content">
          <h2 class="page-title">My Leave Requests</h2>
          <p class="page-subtitle">Manage and track your leave applications</p>
        </div>
        <a-button
          type="primary"
          class="add-btn"
          size="large"
          @click="showForm = true"
        >
          <PlusOutlined />
          New Request
        </a-button>
      </div>

      <div v-if="leaveStore.forms.length === 0" class="empty-state-wrapper">
        <a-empty
          description="You have no leave requests to handle"
          class="empty-state"
        />
      </div>
      <div v-else>
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
                  <AppstoreTwoTone /> Select status
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
              <span class="filter-label">Filter by Date</span>
              <a-range-picker
                class="custom-picker"
                v-model:value="criteria.date"
              ></a-range-picker>
            </div>
          </div>
        </a-card>

        <div class="cards-container">
          <div v-if="paginationForms.length === 0" class="empty-state-wrapper">
            <a-empty
              description="No matching requests found"
              class="empty-state"
            />
          </div>
          <div class="form-grid" v-else>
            <a-card
              v-for="form in paginationForms"
              :key="form.formId"
              class="request-card"
              :bordered="false"
              @click="
                () => {
                  currentDetailsForm = form;
                  showDetails = true;
                }
              "
            >
              <div class="card-content">
                <div class="card-header">
                  <span
                    class="card-type"
                    :class="{ 'is-pending': form.status === 'Pending' }"
                    >Leave Request</span
                  >
                  <a-tag
                    class="status-badge"
                    :color="
                      form.status !== 'Pending'
                        ? form.status === 'Approve'
                          ? 'success'
                          : 'error'
                        : 'warning'
                    "
                  >
                    {{ form.status }}
                  </a-tag>
                </div>
                <div class="card-body">
                  <div class="date-row">
                    <span class="date-label">Date Submitted:</span>
                    <time
                      class="date-value"
                      :class="{ 'is-pending': form.status === 'Pending' }"
                      >{{ form.date }}</time
                    >
                  </div>
                </div>
              </div>
            </a-card>
          </div>
        </div>

        <div class="pagination-wrapper">
          <a-pagination
            v-model:current="currentPage"
            :total="filteredForms.length"
            show-less-items
            :pageSize="pageSize"
            class="custom-pagination"
          />
        </div>
      </div>

      <!-- Modals -->
      <a-modal
        v-model:open="showForm"
        title="Create New Leave Request"
        class="custom-modal"
        :footer="null"
      >
        <a-form
          v-if="authStore.user.firstName"
          :rules="formRule"
          :model="formState"
          ref="formRef"
          layout="vertical"
        >
          <a-form-item label="Applicant Name" name="name">
            <a-input v-model:value="formData.name" readonly size="large" />
          </a-form-item>
          <a-form-item label="Reason for Leave" name="reason">
            <a-textarea
              v-model:value="formState.reason"
              :rows="4"
              placeholder="Please provide details about your leave..."
            />
          </a-form-item>
          <a-form-item label="Start Date" name="date">
            <a-input v-model:value="formState.date" type="date" size="large" />
          </a-form-item>

          <div class="modal-footer">
            <a-button key="back" @click="showForm = false" size="large"
              >Cancel</a-button
            >
            <a-button @click="handleSubmit" type="primary" size="large"
              >Submit Request</a-button
            >
          </div>
        </a-form>
      </a-modal>

      <a-modal
        v-model:open="showDetails"
        :footer="null"
        class="custom-modal details-modal"
      >
        <FormDetails
          v-if="currentDetailsForm"
          :key="currentDetailsForm.formId"
          :data="currentDetailsForm"
        />
      </a-modal>
    </div>
  </MainLayout>
</template>

<style scoped>
.employee-leave-container {
  padding: 0 12px 24px;
  animation: fadeIn 0.4s ease-in-out;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
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
  margin-bottom: 0;
  font-weight: 400;
}

.add-btn {
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
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

.cards-container {
  margin-bottom: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.request-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.request-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  border-color: #e2e8f0;
}

:deep(.request-card .ant-card-body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-type {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
}

.card-type.is-pending {
  color: #1e293b;
}

.status-badge {
  margin: 0;
  border-radius: 6px;
  font-weight: 600;
  padding: 4px 12px;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
}

.date-label {
  font-size: 14px;
  color: #64748b;
}

.date-value {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.date-value.is-pending {
  color: #0f172a;
}

.empty-state-wrapper {
  background: white;
  border-radius: 12px;
  padding: 48px 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
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
:deep(.ant-picker),
:deep(.ant-input),
:deep(.ant-input-number-input) {
  border-radius: 8px !important;
}

:deep(.ant-select-selection-item) {
  display: flex;
  align-items: center;
}

:deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.ant-modal-header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 0;
}

:deep(.ant-modal-title) {
  font-size: 18px;
  font-weight: 600;
}

:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #475569;
}
</style>
