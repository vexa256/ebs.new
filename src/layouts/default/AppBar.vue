<template>
  <v-app style="overflow: hidden; height: 100%">
    <!-- AppBar -->
    <v-app-bar app color="primary" dark>
      <!-- Sidebar Toggle Button -->
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- Brand Logo -->
      <div class="d-flex align-center">
        <v-img
          src="@/assets/logo.png"
          class="mr-2"
          contain
          height="60"
          width="70"
        ></v-img>
      </div>

      <!-- Navigation links -->
      <v-toolbar title="Zambia EBS"></v-toolbar>
      <v-spacer></v-spacer>

      <!-- User profile, notifications, etc. -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logOut">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-list-item @click="viewAccount">
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <!-- drawer -->

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item class="pb-3 pt-3">
        <v-list-item-content>
          <v-list-item-title class="title">Menu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item @click="toggleDropdown('dashboard')">
          <v-list-item-content class="d-flex align-center">
            <v-list-item-icon class="mr-2">
              <v-icon class="text-pink">mdi-map</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-subtitle-2"
              >Country Structures</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list v-if="dropdowns.dashboard">
          <!-- Sub-links for Dashboard here -->
          <v-list-item link to="/MgtProvinces">
            <v-list-item-title>Provinces</v-list-item-title>
          </v-list-item>
          <!-- More sublinks here -->
        </v-list>
        <!-- Repeat the pattern for other menu items -->
      </v-list>
    </v-navigation-drawer>
    <!-- drawer -->

    <v-main>
      <v-container fluid class="p-5 m-5">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped>
.v-toolbar {
  background-color: #3f51b5 !important;
  color: white !important;
}
</style>
<script>
import { ref } from "vue";

export default {
  components: {},
  setup() {
    const drawer = ref(false);
    const dropdowns = ref({
      dashboard: false,
      // other dropdowns here
    });

    const toggleDropdown = (name) => {
      dropdowns.value[name] = !dropdowns.value[name];
    };

    return {
      drawer,
      dropdowns,
      toggleDropdown,
    };
  },
};
</script>
