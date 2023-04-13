<template>
  <div class="h-screen bg-slate-500 grid place-items-center">
    <div class="h-[600px] w-[600px] bg-gray-600 grid grid-cols-3 grid-rows-3 gap-2" v-if="!gameOver">
      <SingleBox :x="0" :y="0"></SingleBox>
      <SingleBox :x="1" :y="0"></SingleBox>
      <SingleBox :x="2" :y="0"></SingleBox>
      <SingleBox :x="0" :y="1"></SingleBox>
      <SingleBox :x="1" :y="1"></SingleBox>
      <SingleBox :x="2" :y="1"></SingleBox>
      <SingleBox :x="0" :y="2"></SingleBox>
      <SingleBox :x="1" :y="2"></SingleBox>
      <SingleBox :x="2" :y="2"></SingleBox>
    </div>
    <div v-else>
      {{ winner === 'draw' ? 'DRAW!' : `${winner} won!` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLetterStore } from "./store";
import { storeToRefs } from 'pinia'

const { winner, gameOver } = storeToRefs(useLetterStore());
</script>
