<script setup>
import { ref, toRaw } from "vue";
import useLeaveStore from "../../stores/useLeaveStore";

const props = defineProps(["data"]);

const formData = ref(props.data);
const leaveStore = useLeaveStore();
const saveFormData = () => {
  leaveStore.updateForm(toRaw(formData.value));
};
</script>
<template>
  <a-form @submit.prevent="saveFormData" :style="{ marginTop: '40px' }">
    <a-form-item label="Name">
      <a-input
        v-model:value="formData.name"
        :readonly="formData.status !== 'Pending'"
      ></a-input>
    </a-form-item>
    <a-form-item label="Reason for leaving ">
      <a-textarea
        v-model:value="formData.reason"
        :readonly="formData.status !== 'Pending'"
      ></a-textarea>
    </a-form-item>
    <a-form-item label="Time leaving:  ">
      <a-input
        v-model:value="formData.date"
        type="date"
        :readonly="formData.status !== 'Pending'"
      ></a-input>
    </a-form-item>
    <a-form-item label="Status:  ">
      <a-tag
        :style="{ marginLeft: '10px' }"
        :color="
          formData.status !== 'Pending'
            ? formData.status === 'Approve'
              ? 'success'
              : 'error'
            : 'warning'
        "
        >{{ formData.status }}</a-tag
      >
    </a-form-item>
    <a-flex v-if="formData.status === 'Pending'" justify="flex-end">
      <a-button type="primary">Save changes</a-button>
    </a-flex>
    <a-typography-text type="warning" v-else
      >Has been viewed by admin, you cannot change it</a-typography-text
    >
  </a-form>
</template>
