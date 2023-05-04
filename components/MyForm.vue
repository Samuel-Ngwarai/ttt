<template>
  <form @submit.prevent="onSubmit">
    <input v-model="value" />

    <button type="submit" :disabled="isLoading">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { socket } from "@/socket";

const isLoading = ref(false);
const value = ref("");

const onSubmit = () => {
  isLoading.value = true;

  socket.timeout(5000).emit("create-something", value.value, () => {
    isLoading.value = false;
  });
};
</script>
