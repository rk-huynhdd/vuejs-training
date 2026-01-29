<script setup>
import useAuthStore from "../../stores/auth";

const authStore = useAuthStore();
</script>
<template>
  <h1>Dashboard</h1>
  <h3>Welcome {{ authStore.user.username }}</h3>
  <p>{{ authStore.user.role }}</p>
</template>
