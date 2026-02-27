<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useLeaveStore from "../../stores/useLeaveStore";
import { message } from "ant-design-vue";
import useUiStore from "../../stores/UIstore";
const route = useRoute();
const router = useRouter();
const leaveStore = useLeaveStore();
const UIStore = useUiStore();
const status = ref(null);
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

const handleSubmit = async () => {
  await leaveStore.changeFormStatus(
    leaveStore.formDetails.userId,
    leaveStore.formDetails.formId,
    status.value,
  );

  router.replace("/admin/leave");
  openMessage();
};
onMounted(async () => {
  await leaveStore.getAllForms();
  await leaveStore.getFormDetails(route.params.formId);
  status.value = leaveStore.formDetails.status;
});
</script>
<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Back"
    @back="
      () => {
        router.push('/admin/leave');
      }
    "
  />
  <a-form
    v-if="leaveStore.formDetails"
    style="
      max-width: 50%;
      margin: 100px auto;
      padding: 50px;
      border-radius: 15px;
      border: 1px solid black;
    "
    @submit.prevent="handleSubmit"
  >
    <a-form-item label="Name">
      <a-input :value="leaveStore.formDetails.name" readonly />
    </a-form-item>

    <a-form-item label="Leaving reason">
      <a-textarea :value="leaveStore.formDetails.reason" readonly />
    </a-form-item>

    <a-form-item label="Status">
      <a-select v-model:value="status">
        <a-select-option value="Pending">
          <a-tag color="warning">Pending</a-tag>
        </a-select-option>
        <a-select-option value="Approve">
          <a-tag color="success">Approve</a-tag>
        </a-select-option>
        <a-select-option value="Reject">
          <a-tag color="error">Reject</a-tag>
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-button type="primary" html-type="submit"> Confirm status </a-button>
  </a-form>
</template>
