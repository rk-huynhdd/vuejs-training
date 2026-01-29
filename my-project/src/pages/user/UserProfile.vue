<script setup>
import useAuthStore from "../../stores/auth";

const authStore = useAuthStore();
</script>
<template>
  Profile
  <h3>Welcome {{ authStore.user.username }}</h3>
  <p>{{ authStore.user.role }}</p>
</template>
