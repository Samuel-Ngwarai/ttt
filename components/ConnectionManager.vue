<template>
  <div class="grid">
    <button
      class="relative inline-flex w-[250px] items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-2xl font-medium text-gray-900 rounded-full group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      @click="connect()"
    >
      <span
        class="relative px-10 w-[250px] py-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0"
      >
        {{ currentState === CurrentGameStateEnum.InitialState ? "Start" : "Restart" }}
      </span>
    </button>
    <button
      v-if="currentState === CurrentGameStateEnum.Playing || currentState === CurrentGameStateEnum.Waiting"
      class="relative inline-flex w-[250px] items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-2xl font-medium text-gray-900 rounded-full group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
      @click="disconnect()"
    >
      <span
        class="relative w-[250px] px-10 py-5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0"
      >
        Abort
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { ConnectionStateEnum, CurrentGameStateEnum, useLetterStore } from "../store";

const letterStore = useLetterStore();
const { connectionState, sessionId, currentState } = storeToRefs(letterStore);
const socketIoClient = getSocketIoClient();

const connect = () => {
  if (currentState.value !== CurrentGameStateEnum.InitialState) {
    currentState.value = CurrentGameStateEnum.InitialState;
    disconnect();
  }
  socketIoClient.connect();
  letterStore.resetBoard();
  sessionId.value = "";
};

const disconnect = () => {
  if (sessionId.value) {
    socketIoClient.emit("abort-connection", sessionId.value);
    sessionId.value = "";
  }

  socketIoClient.disconnect();
  connectionState.value = ConnectionStateEnum.Disconnected;
};
</script>
