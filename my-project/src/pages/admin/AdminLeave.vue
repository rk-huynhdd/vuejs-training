<script setup>
import { computed, onMounted, ref } from "vue";
import useLeaveStore from "../../stores/useLeaveStore";
import { useRouter } from "vue-router";
import { AppstoreTwoTone } from "@ant-design/icons-vue";
import dayjs from "dayjs";
const router = useRouter();
const leaveStore = useLeaveStore();

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

onMounted(async () => {
  await leaveStore.getAllForms();
});
</script>
<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Back"
    @back="
      () => {
        router.push('/dashboard');
      }
    "
  />
  <a-flex align="center" gap="middle" style="margin-bottom: 20px">
    <a-select
      v-model:value="criteria.status"
      style="width: 300px; margin-left: 30px"
    >
      <template #placeholder> <AppstoreTwoTone /> Select form status</template>
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

  <a-flex gap="middle" vertical style="margin-left: 30px">
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
  </a-flex>
</template>
