<template>
  <div class="h-10">
    <p>{{ connectionState }}</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLetterStore } from "../store";

const { connectionState } = storeToRefs(useLetterStore());
</script>
