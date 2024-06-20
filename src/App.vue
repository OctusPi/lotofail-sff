<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="load-wall" class="load-wall d-none">
    <img id="load-img" class="load-img" src="./assets/load.svg" />
  </div>
  <RouterView />
</template>
