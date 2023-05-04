<template>
    <p>Socketio Connection State: {{ connected }}</p>

    <p>Connection state: {{ currentState }}</p>
  </template>
  
  <script setup lang="ts">
  import { state, socket } from "@/socket";

  const connected = computed(() => state.connected);
  const currentState = ref('');

  // socket.on('waiting-for-player-b', (args) => {
  //   console.log('waiting for player b');
    
  //   currentState.value = args
  // });

  socket.on('player-a', (args) => {
    currentState.value = `Player a with: ${args}`;
  })

  socket.on('player-b', (args) => {
    currentState.value = `Player b with: ${args}`;
  })
  </script>