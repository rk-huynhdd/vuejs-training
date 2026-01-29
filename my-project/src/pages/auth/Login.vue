<script setup>
import { ref } from "vue";

import useAuthStore from "../../stores/auth";
import useUiStore from "../../stores/UIstore";

const userName = ref("");
const password = ref("");
const authStore = useAuthStore();
const UIStore = useUiStore();

const handleLogin = async () => {
  await authStore.login({
    username: userName.value,
    password: password.value,
  });
};
</script>
<template>
  <a-row type="flex" justify="center" align="middle" style="min-height: 100vh">
    <a-card
      title="Login"
      :bordered="false"
      :headStyle="{
        fontSize: '24px',
        textAlign: 'center',
        padding: '15px',
      }"
      style="
        width: 500px;
        box-shadow:
          rgba(0, 0, 0, 0.16) 0px 3px 6px,
          rgba(0, 0, 0, 0.23) 0px 3px 6px;
      "
    >
      <a-form
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @submit.prevent="handleLogin"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]"
        >
          <a-input v-model:value="userName" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]"
        >
          <a-input-password v-model:value="password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button
            type="primary"
            html-type="submit"
            :loading="UIStore.isLoading"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
      <a-alert
        v-if="UIStore.error"
        :message="UIStore.error"
        type="error"
        style="font-weight: bold; color: red"
      />
    </a-card>
  </a-row>
</template>
<style scoped></style>
