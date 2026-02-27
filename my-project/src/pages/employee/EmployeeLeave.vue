<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import useLeaveStore from "../../stores/useLeaveStore";
import useAuthStore from "../../stores/auth";
import getRandomInt from "../../composable/useGenRandom";
import FormDetails from "../../components/employee/FormDetails.vue";
import useUiStore from "../../stores/UIstore";
import Loading from "../../common/Loading.vue";
import { useRouter } from "vue-router";
import { PlusOutlined } from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";

const leaveStore = useLeaveStore();
const authStore = useAuthStore();
const UIStore = useUiStore();

const showForm = ref(false);
const currentDetailsForm = ref(null);

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
  <Loading :is-loading="UIStore.isLoading" />
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Back"
    @back="
      () => {
        if (authStore.user.role === 'admin') {
          router.push('dashboard');
        } else {
          router.push('/employees');
        }
      }
    "
  >
    <a-flex justify="flex-end">
      <a-button
        :style="{
          marginLeft: 'auto',
        }"
        type="primary"
        ghost
        @click="
          () => {
            showForm = true;
          }
        "
      >
        <PlusOutlined />
        Add new form
      </a-button>
    </a-flex>
  </a-page-header>
  <p v-if="leaveStore.forms.length === 0">You have no form to handle</p>
  <div v-else style="margin-left: 10px">
    <a-typography-title :level="2" :style="{ marginTop: '5px' }"
      >Your current leaving forms:
    </a-typography-title>
    <a-flex gap="middle" vertical>
      <a-card
        v-for="form in leaveStore.forms"
        :key="form.formId"
        :style="{
          border: '1px solid black',
          cursor: 'pointer',
          width: '50%',
        }"
        @click="
          () => {
            currentDetailsForm = form;
            showDetails = true;
          }
        "
      >
        <template #title>
          <p :style="{ color: form.status === 'Pending' ? 'black' : 'gray' }">
            Leaving form
          </p>
        </template>
        <time
          :style="{ color: form.status === 'Pending' ? 'black' : 'gray' }"
          >{{ form.date }}</time
        >

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
    </a-flex>
  </div>
  <!-- modal form hiện ra  -->
  <a-modal v-model:open="showForm" title="Create new form">
    <a-form
      v-if="authStore.user.firstName"
      :rules="formRule"
      :model="formState"
      ref="formRef"
    >
      <a-form-item label="Name" name="name">
        <a-input v-model:value="formData.name" readonly></a-input>
      </a-form-item>
      <a-form-item label="Reason for leaving " name="reason">
        <a-textarea v-model:value="formState.reason"></a-textarea>
      </a-form-item>
      <a-form-item label="Time leaving:  " name="date">
        <a-input v-model:value="formState.date" type="date"></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="showForm = false">Return</a-button>
      <a-button @click="handleSubmit" type="primary">Submit</a-button>
    </template>
  </a-modal>
  <a-modal v-model:open="showDetails">
    <FormDetails :key="currentDetailsForm.formId" :data="currentDetailsForm" />
    <template #footer> </template>
  </a-modal>
</template>
