<template>
  <div
    class="grid h-screen w-screen bg-slate-100 place-items-center md:grid-cols-4"
  >
    <div class="md:col-span-1">
      <ConnectionState />
      <ConnectionManager />
      <button v-if="gameOver" @click="toggleBoard">View Board/Gif</button>
    </div>
    <Transition>
      <div
        v-if="showBoard"
        class="lg:h-[600px] lg:w-[600px] h-[300px] w-[300px] bg-gray-100 md:col-span-3 grid grid-cols-3 grid-rows-3 gap-2 absolute"
      >
        <SingleBox :x="0" :y="0" />
        <SingleBox :x="1" :y="0" />
        <SingleBox :x="2" :y="0" />
        <SingleBox :x="0" :y="1" />
        <SingleBox :x="1" :y="1" />
        <SingleBox :x="2" :y="1" />
        <SingleBox :x="0" :y="2" />
        <SingleBox :x="1" :y="2" />
        <SingleBox :x="2" :y="2" />
      </div>
      <div v-else class="md:col-span-3 absolute">
        <img :src="gif" class="max-w-5xl max-h-5xl" alt="woahh" />
        {{ endState }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useLetterStore } from "./store";

const config = useRuntimeConfig();

const letterStore = useLetterStore();
const { currentState, connectionState, sessionId, socketsState } =
  storeToRefs(letterStore);

const gif = ref("");
const endState = ref("");
const gameOver = ref(false);
const showBoard = ref(true);

const toggleBoard = () => {
  showBoard.value = !showBoard.value;
}

const getEndGif = async (prompt: string) => {
  const data = await $fetch(`/giphy?prompt=${prompt}&rating=g`);
  gif.value =
    data[
      randomIntFromInterval(0, config.giphyRequestLimit - 1)
    ].images.original.url!;
};

const initializeSocketFunctionality = () => {
  initializeSocketIoClient();
  const socketIoClient = getSocketIoClient();

  socketIoClient.on("connect", () => {
    socketsState.value.connected = true;
    gameOver.value = false;
    showBoard.value = true;
    socketIoClient.emit("establish-connection");
  });

  socketIoClient.on("disconnect", () => {
    socketsState.value.connected = false;
    connectionState.value = "Disconnected";
  });

  socketIoClient.on("player-b", ({ sessionId }) => {
    letterStore.setMyLetter("O");
    letterStore.sessionId = sessionId;
    connectionState.value = "Connected";
    currentState.value = "waiting-now";
  });

  socketIoClient.on("player-a", ({ sessionId }) => {
    letterStore.setMyLetter("X");
    letterStore.sessionId = sessionId;
    connectionState.value = "Connected";
    currentState.value = "playing-now";
  });

  socketIoClient.on("waiting-for-other-player", () => {
    currentState.value = "waiting-now";
  });

  socketIoClient.on("current-turn-to-play", ({ x, y }) => {
    letterStore.updateBoard(x, y, letterStore.alternativeLetter);
    currentState.value = "playing-now";
  });

  socketIoClient.on("end-draw", async () => {
    currentState.value = "end-draw";
    gameOver.value = true;
    showBoard.value = false;
    endState.value = "Draw!";
    await getEndGif("Let's play again!");
    socketIoClient.disconnect();
  });

  socketIoClient.on("end-win", async () => {
    currentState.value = "end-win";
    gameOver.value = true;
    showBoard.value = false;
    endState.value = "I won!";
    await getEndGif("I won!");
    socketIoClient.disconnect();
  });

  socketIoClient.on("end-loss", async ({ x, y }) => {
    letterStore.updateBoard(x, y, letterStore.alternativeLetter);
    currentState.value = "end-loss";
    gameOver.value = true;
    showBoard.value = false;
    endState.value = "I lost...";
    await getEndGif("I lost");
    socketIoClient.disconnect();
  });

  socketIoClient.on("waiting-for-player-b", (args) => {
    connectionState.value = "Waiting";
  });

  socketIoClient.on("other-player-aborted", () => {
    if (sessionId.value) {
      sessionId.value = "";
    }
    socketIoClient.disconnect();
  });
};

initializeSocketFunctionality();
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>