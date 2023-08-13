<template>
  <div class="bg-blue-100 grid place-items-center text-6xl" @click="chooseBox">
    {{
      letterStore.board[props.x][props.y] === "-"
        ? ""
        : letterStore.board[props.x][props.y]
    }}
  </div>
</template>

<script setup lang="ts">
import { ConnectionStateEnum, CurrentGameStateEnum, useLetterStore } from "../store";

const props = defineProps<{
  x: number;
  y: number;
}>();

const letterStore = useLetterStore();
const active = ref(false);
const socketIoClient = getSocketIoClient();

const chooseBox = () => {
  if (letterStore.currentState === CurrentGameStateEnum.Waiting) {
    return alert("Waiting for other player to play first");
  } else if (letterStore.currentState !== CurrentGameStateEnum.Playing) {
    return alert("Patience now. Wait for the game to start") 
  }

  letterStore.updateBoard(props.x, props.y);
  active.value = true;
  socketIoClient.emit("play", {
    x: props.x,
    y: props.y,
    session: letterStore.sessionId,
    icon: letterStore.myLetter,
  });
};
</script>
