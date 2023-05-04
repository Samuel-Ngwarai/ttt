<template>
  <div class="bg-blue-200 grid place-items-center" @click="chooseBox">
    {{ xOrO }}
  </div>
</template>

<script setup lang="ts">
import { useLetterStore } from "../store";

const props = defineProps<{
  x: number;
  y: number;
}>();

const xOrO = ref("");
let touched = false;
const letterStore = useLetterStore();

const doSomething = () => {
    console.log('Im batman')
    console.log('x ', props.x);
    console.log('y ', props.y);
}

const chooseBox = () => {
  if (touched) return;
  touched = true;
  console.log("clicking ", props.x, ":", props.y);
  xOrO.value = letterStore.currentLetter();
  letterStore.updateBoard(props.x, props.y, xOrO.value);
};

defineExpose({
    doSomething
})
</script>
