<script setup>
const loading = defineModel("isLoading");
</script>
<template>
  <div class="spin-container" v-if="loading">
    <a-spin :spinning="loading" size="large"> </a-spin>
  </div>
</template>
<style scoped>
.spin-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
