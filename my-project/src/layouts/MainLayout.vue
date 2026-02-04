<script setup>
import { ref, h } from "vue";
import {
  UserOutlined,
  UploadOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import useAuthStore from "../stores/auth";
import { Modal } from "ant-design-vue";
const selectedKeys = ref(["dashboard"]);

const authStore = useAuthStore();
const handleLogout = () => {
  Modal.confirm({
    title: "Are you sure want to logout ?",
    icon: h(ExclamationCircleOutlined),

    onOk() {
      authStore.logout();
    },
    onCancel() {},
  });
};
</script>
<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="dashboard">
          <user-outlined />
          <span>Employees </span>
        </a-menu-item>
        <a-menu-item key="settings">
          <upload-outlined />
          <span>Settings</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        style="
          background: #fff;
          padding: 0 24px;
          box-shadow:
            rgba(0, 0, 0, 0.12) 0px 1px 3px,
            rgba(0, 0, 0, 0.24) 0px 1px 2px;
        "
      >
        <a-flex
          horizontal
          justify="flex-end"
          align="center"
          gap="20"
          :style="{ height: '100%' }"
        >
          <h3>Welcome {{ authStore.user.username }}</h3>
          <a-avatar
            :size="{ xs: 24, sm: 32, md: 40, lg: 48, xl: 48, xxl: 54 }"
            :src="authStore.user.image"
          >
          </a-avatar>
          <a-button type="primary" danger @click="handleLogout"
            ><LogoutOutlined /> Logout</a-button
          >
        </a-flex>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <div
          :style="{
            padding: '24px',
            background: '#fff',
            minHeight: '360px',
            marginTop: '16px',
          }"
        >
          <slot></slot>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design Vue ©2024 Created by You
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
