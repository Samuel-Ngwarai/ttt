<template>
  <div>
    <div class="flex">
      <div class="rounded-full w-6 h-4 mr-4 my-1" :class="[symbolColor]"></div>
    </div>
    <p>{{ showMyLetter ? `My Letter: ${myLetter}` : "" }}</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import {
  useLetterStore,
  ConnectionStateEnum,
  CurrentGameStateEnum,
} from "../store";

const { connectionState, myLetter, currentState } = storeToRefs(
  useLetterStore()
);
const symbolColor = ref("bg-red-600");

const showMyLetter = computed(() => {
  return (
    connectionState.value === ConnectionStateEnum.Connected ||
    currentState.value === CurrentGameStateEnum.EndDraw ||
    currentState.value === CurrentGameStateEnum.EndLose ||
    currentState.value === CurrentGameStateEnum.EndWin
  );
});

watch(connectionState, (newState, _) => {
  switch (newState) {
    case ConnectionStateEnum.Connected:
      symbolColor.value = "bg-green-600";
      break;
    case ConnectionStateEnum.Waiting:
      symbolColor.value = "bg-orange-400";
      break;

    case ConnectionStateEnum.Disconnected:
      symbolColor.value = "bg-red-600";
      break;
  }
});
</script>
