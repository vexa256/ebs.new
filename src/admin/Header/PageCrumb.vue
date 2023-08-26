<template>
  <v-row align="center">
    <v-col cols="12">
      <v-card class="px-2" elevation="3">
        <v-card-title class="text-subtitle-1">
          {{ title }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "PageTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.v-card {
  background-color: white; /* You can adjust this color */
  border-radius: 20px;
}
</style>
