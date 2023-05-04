<template>
  <div class="h-screen bg-slate-500 grid place-items-center">
    <ConnectionState></ConnectionState>
    <ConnectionManager></ConnectionManager>
    <MyForm></MyForm>
    <!-- <button @click="sendMessage">Send socket message to server</button> -->
    <div
      class="h-[600px] w-[600px] bg-gray-600 grid grid-cols-3 grid-rows-3 gap-2"
      v-if="!gameOver"
    >
      <SingleBox :x="0" :y="0" ref="childComponentRef00"></SingleBox>
      <SingleBox :x="1" :y="0" ref="childComponentRef10"></SingleBox>
      <SingleBox :x="2" :y="0" ref="childComponentRef20"></SingleBox>
      <SingleBox :x="0" :y="1" ref="childComponentRef01"></SingleBox>
      <SingleBox :x="1" :y="1" ref="childComponentRef11"></SingleBox>
      <SingleBox :x="2" :y="1" ref="childComponentRef21"></SingleBox>
      <SingleBox :x="0" :y="2" ref="childComponentRef02"></SingleBox>
      <SingleBox :x="1" :y="2" ref="childComponentRef12"></SingleBox>
      <SingleBox :x="2" :y="2" ref="childComponentRef22"></SingleBox>
    </div>
    <div v-else>
      {{ winner === "draw" ? "DRAW!" : `${winner} won!` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLetterStore } from "./store";
import { storeToRefs } from "pinia";
import { socket } from "@/socket";

const letterStore = useLetterStore();
const { winner, gameOver, myLetter } = storeToRefs(letterStore);

const childComponentRef00 = ref();
const childComponentRef10 = ref();
const childComponentRef20 = ref();
const childComponentRef01 = ref();
const childComponentRef11 = ref();
const childComponentRef21 = ref();
const childComponentRef02 = ref();
const childComponentRef12 = ref();
const childComponentRef22 = ref();

socket.on("next-move", (args) => {
  const { x, y } = args;
  console.log(`Next Move with ${x} and ${y} already played`);

  letterStore.updateBoard(x, y, myLetter.value === 'X' ? 'O' : 'X')

  childComponentRef00.value.doSomething();
  childComponentRef10.value.doSomething();
  childComponentRef20.value.doSomething();
  childComponentRef01.value.doSomething();
  childComponentRef11.value.doSomething();
  childComponentRef21.value.doSomething();
  childComponentRef02.value.doSomething();
  childComponentRef12.value.doSomething();
  childComponentRef22.value.doSomething();
});

onMounted(() => {
  childComponentRef00.value.doSomething();
  childComponentRef10.value.doSomething();
  childComponentRef20.value.doSomething();
  childComponentRef01.value.doSomething();
  childComponentRef11.value.doSomething();
  childComponentRef21.value.doSomething();
  childComponentRef02.value.doSomething();
  childComponentRef12.value.doSomething();
  childComponentRef22.value.doSomething();
});

</script>
