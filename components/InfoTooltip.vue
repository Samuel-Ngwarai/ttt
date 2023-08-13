<template>
  <div class="group relative w-max hover:cursor-pointer">
    <p>
      <main>
        <slot name="main"></slot>
      </main>
    </p>
    <span
      class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-100"
    >
      <tooltip>
        <slot name="tooltip"></slot>
      </tooltip>
    </span>
  </div>
</template>
