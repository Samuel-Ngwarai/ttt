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
import { useLetterStore } from "../store";

const props = defineProps<{
  x: number;
  y: number;
}>();

const letterStore = useLetterStore();
const active = ref(false);
const socketIoClient = getSocketIoClient();

const chooseBox = () => {
  if (letterStore.currentState === "waiting-now") {
    return alert("Waiting for other player to play first");
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
