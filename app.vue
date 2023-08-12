<template>
  <div
    class="grid p-5 h-screen w-screen bg-slate-100 place-items-center grid-cols-1 grid-rows-small lg:grid-rows-1 lg:grid-cols-large"
  >
    <div class="md:col-span-1">
      <ConnectionState />
      <ConnectionManager />
      <button
        v-if="displayToggleBoardButton"
        @click="toggleBoard"
        class="relative inline-flex w-[250px] items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-2xl font-medium text-gray-900 rounded-full group bg-gradient-to-br from-blue-400 to-green-600 group-hover:from-blue-400 group-hover:to-green-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      >
        <span
          class="relative px-10 w-[250px] py-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0"
        >
          Toggle Board
        </span>
      </button>
    </div>
    <div>
      <div
        v-if="showBoard"
        class="md:h-[600px] md:w-[600px] h-[300px] w-[300px] bg-gray-100 md:col-span-3 grid grid-cols-3 grid-rows-3 gap-2"
      >
        <SingleBox v-for="y in 3" :x="0" :y="y - 1" />
        <SingleBox v-for="y in 3" :x="1" :y="y - 1" />
        <SingleBox v-for="y in 3" :x="2" :y="y - 1" />
      </div>
      <div v-else class="md:col-span-3">
        <img
          :src="gif"
          class="max-w-xs max-h-xs lg:max-w-5xl lg:max-h-5xl"
          alt="woahh"
        />
        {{ endState }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  useLetterStore,
  ConnectionStateEnum,
  CurrentGameStateEnum,
} from "./store";

const config = useRuntimeConfig();

const letterStore = useLetterStore();
const { currentState, connectionState, sessionId, socketsState } =
  storeToRefs(letterStore);

const gif = ref("");
const endState = ref("");
const showBoard = ref(true);

const displayToggleBoardButton = ref(false);

watch(currentState, (newValue, _) => {
  switch (newValue) {
    case CurrentGameStateEnum.EndDraw:
    case CurrentGameStateEnum.EndLose:
    case CurrentGameStateEnum.EndWin:
      displayToggleBoardButton.value = true;
      showBoard.value = false;
      break;

    default:
      displayToggleBoardButton.value = false;
      showBoard.value = true;
      break;
  }
});

const toggleBoard = () => {
  showBoard.value = !showBoard.value;
};

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

    socketIoClient.emit("establish-connection");
  });

  socketIoClient.on("disconnect", () => {
    socketsState.value.connected = false;
    connectionState.value = ConnectionStateEnum.Disconnected;
  });

  socketIoClient.on("player-b", ({ sessionId }) => {
    letterStore.setMyLetter("O");
    letterStore.sessionId = sessionId;
    connectionState.value = ConnectionStateEnum.Connected;
    currentState.value = CurrentGameStateEnum.Waiting;
  });

  socketIoClient.on("player-a", ({ sessionId }) => {
    letterStore.setMyLetter("X");
    letterStore.sessionId = sessionId;
    connectionState.value = ConnectionStateEnum.Connected;
    currentState.value = CurrentGameStateEnum.Playing;
  });

  socketIoClient.on("waiting-for-other-player", () => {
    currentState.value = CurrentGameStateEnum.Waiting;
  });

  socketIoClient.on("current-turn-to-play", ({ x, y }) => {
    letterStore.updateBoard(x, y, letterStore.alternativeLetter);
    currentState.value = CurrentGameStateEnum.Playing;
  });

  socketIoClient.on("end-draw", async () => {
    currentState.value = CurrentGameStateEnum.EndDraw;
    endState.value = "Draw!";
    await getEndGif("Let's play again!");
    socketIoClient.disconnect();
  });

  socketIoClient.on("end-win", async () => {
    currentState.value = CurrentGameStateEnum.EndWin;
    endState.value = "I won!";
    await getEndGif("I won!");
    socketIoClient.disconnect();
  });

  socketIoClient.on("end-loss", async ({ x, y }) => {
    letterStore.updateBoard(x, y, letterStore.alternativeLetter);
    currentState.value = CurrentGameStateEnum.EndLose;
    endState.value = "I lost...";
    await getEndGif("I lost");
    socketIoClient.disconnect();
  });

  socketIoClient.on("waiting-for-player-b", (args) => {
    connectionState.value = ConnectionStateEnum.Waiting;
    currentState.value = CurrentGameStateEnum.Waiting;
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
