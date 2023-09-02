<template>
  <v-row align="center">
    <v-col cols="12">
      <v-card-title  loading   class="px-2" elevation="3">
        <v-card-title  loading  -title class="text-subtitle-1">
          {{ title }}
        </v-card-title>
      </v-card-title>
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
