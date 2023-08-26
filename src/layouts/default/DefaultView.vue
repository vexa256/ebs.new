<template>
  <v-app style="overflow: hidden; height: 100%">
    <default-bar />

    <router-view />

    <FooterBar />
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import FooterBar from "./FooterBar.vue";
</script>

<style>
body {
  overflow-y: hidden;
}
</style>
