<template>
  <div
    class="grid h-screen w-screen bg-slate-100 place-items-center md:grid-cols-4"
  >
    <div class="md:col-span-1">
      <ConnectionState />
      <ConnectionManager />
    </div>
    <div
      v-if="!gameOver"
      class="lg:h-[600px] lg:w-[600px] h-[300px] w-[300px] bg-gray-100 md:col-span-3 grid grid-cols-3 grid-rows-3 gap-2"
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
    <div v-else class="md:col-span-3">
      <img :src="gif" class="max-w-5xl max-h-5xl" alt="woahh" />
      {{ endState }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useLetterStore } from "./store";

const letterStore = useLetterStore();
const { gameOver, currentState, connectionState, sessionId, socketsState } =
  storeToRefs(letterStore);

const gif = ref("");
const endState = ref("");

const getEndGif = async (prompt: string) => {
  const data = await $fetch(`/giphy?prompt=${prompt}&rating=g`);

  gif.value = data[randomIntFromInterval(0, 24)].images.original.url!;
};

const initializeSocketFunctionality = () => {
  initializeSocketIoClient();
  const socketIoClient = getSocketIoClient();

  socketIoClient.on("connect", () => {
    socketsState.value.connected = true;
    connectionState.value = "Connected";
    socketIoClient.emit("establish-connection");
  });

  socketIoClient.on("disconnect", () => {
    socketsState.value.connected = false;
    connectionState.value = "Disconnected";
  });

  socketIoClient.on("player-b", ({ sessionId }) => {
    letterStore.setMyLetter("O");
    letterStore.sessionId = sessionId;
    currentState.value = "waiting-now";
  });

  socketIoClient.on("player-a", ({ sessionId }) => {
    letterStore.setMyLetter("X");
    letterStore.sessionId = sessionId;
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
    letterStore.gameOver = true;
    endState.value = "Draw (You both lost)!";
    await getEndGif("Nothing to see here");
    socketIoClient.disconnect();
  });

  socketIoClient.on("end-win", async () => {
    currentState.value = "end-win";
    letterStore.gameOver = true;
    endState.value = "I won!";
    await getEndGif("I won!");
    socketIoClient.disconnect();
  });

  socketIoClient.on("end-loss", async ({ x, y }) => {
    letterStore.updateBoard(x, y, letterStore.alternativeLetter);
    currentState.value = "end-loss";
    letterStore.gameOver = true;
    endState.value = "I lost...";
    await getEndGif("I lost...");
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
