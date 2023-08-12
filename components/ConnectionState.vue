<template>
  <div class="h-10 flex justify-center">
    <div class="flex">
      <p>{{ connectionState }}</p>
      <div class="rounded-full w-5 h-5 mx-4"  :class="[symbolColor]"></div>
      <p>{{ connectionState === ConnectionStateEnum.Connected ? myLetter : '' }}</p>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useLetterStore, ConnectionStateEnum } from "../store";

const { connectionState, myLetter } = storeToRefs(useLetterStore());
const symbolColor = ref('bg-red-600');

watch(connectionState, (newState, _) => {
  switch (newState) {
    case ConnectionStateEnum.Connected:
      symbolColor.value = 'bg-green-600';
      break;
    case ConnectionStateEnum.Waiting:
      symbolColor.value = 'bg-orange-400'
      break;
  
    case ConnectionStateEnum.Disconnected:
      symbolColor.value = 'bg-red-600'
      break;
  }
});

</script>
