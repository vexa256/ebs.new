<template>
  <v-row class="justify-center">
    <v-col cols="12" md="6" lg="4">
      <v-card class="mx-auto">
        <v-card-item class="bg-red">
          <v-card-title>Manage Districts</v-card-title>
          <template v-slot:append>
            <v-btn
              color="indigo"
              icon="mdi-plus"
              size="small"
              @click="dialog = true"
            ></v-btn>
          </template>
        </v-card-item>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search for Districts"
        ></v-text-field>
        <v-divider></v-divider>
        <v-virtual-scroll
          :items="filteredItems"
          item-height="50"
          height="auto"
          @scroll="onScroll"
          style="max-height: 60vh"
        >
          <template v-slot:default="{ item }">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar :color="item.color" class="text-white" size="40">
                  {{ item.initials }}
                </v-avatar>
              </template>
              <v-list-item-title style="font-size: 12px"
                >{{ item.districtName }}
              </v-list-item-title>
              <template v-slot:append>
                <v-icon @click="showViewData(item.id)" class="btn-sm" color="red" end
                  >mdi-open-in-new</v-icon
                >
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-col>
  </v-row>
  <v-row justify="center">
    <form id="SubmitdistrictForm" method="POST">
      <v-dialog v-model="dialog" persistent fullscreen>
        <v-card class="d-flex flex-column" style="height: 100%">
          <v-card-title>
            <span class="text-h5">
              <v-icon class="mx-1" color="red" end>mdi-plus</v-icon>
              Add district</span
            >
          </v-card-title>
          <v-card-text class="flex-grow-1" style="overflow-y: auto">
            <FormEngine
              :hiddenFields="hiddenFields"
              :tableName="tableName"
              :excludedColumns="excludedColumns"
              :formDivId="formDivId"
              :selectElements="selectElements"
              :autoCompleteData="autoCompleteData"
              :FormID="FormID"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-dialog>
    </form>
  </v-row>

  <UpdateEngine
    :RecordID="viewDataID"
    :districtId="somedistrictId"
    :tableName="tableName"
    :excludedColumns="excludedColumns"
    :titleColumnName="'districtName'"
    :ignoredColumns="['created_at', 'updated_at']"
    :serverUrl="SERVER_URL"
    v-if="viewDataModal"
    :viewDataModal="viewDataModal"
    @close="viewDataModal = false"
  />
</template>
<!-- ... rest of the script remains the same ... -->

<script>
import axios from "axios";
import FormEngine from "@/components/FormEngine.vue"; // Adjust the path to the FormEngine component
import UpdateEngine from "@/components/UpdateEngine.vue";

export default {
  components: {
    FormEngine,
    UpdateEngine,
  },
  data: () => ({
    viewDataID: null,
    SERVER_URL: window.SERVER_URL,
    somedistrictId: "districtIdValue", // Provide the appropriate value

    viewDataModal: false,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    randomId: Array.from({ length: 19 }, () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return characters.charAt(Math.floor(Math.random() * characters.length));
    }).join(""),
    colors: window.COLORS,
    Districts: [],
    FormID: "SubmitdistrictForm",
    search: "",
    error: null,
    lastLoadedIndex: 50,
    dialog: false,
    tableName: "districts",
    excludedColumns: ["created_at", "DistrictID", 'updated_at'],
    colGridSystem: { xs: 12, sm: 6, md: 4, lg: 3 },
    selectData: Object,
    selectElements: [], // You can add select elements if needed
    autoCompleteData: [
      {
        name: "ProvinceID",
        data: [], // Initially empty
      },
    ],
    hiddenFields: [
      {
        name: "created_at",
        value: new Date().toISOString().slice(0, 19).replace("T", ""),
      },
      {
        name: "DistrictID",
        value: 222,
      },
      { name: "PostRoute", value: "MassInsert" },
      { name: "TableName", value: "districts" },
    ],
  }),

  created() {
    this.fetchDistricts();
    this.fetchProvinces();

    this.intervalId = setInterval(this.fetchDistricts, 2000); // 2000 ms = 2 seconds

    console.log(sessionStorage.getItem("RandomUniqueID"));
  },

  mounted() {
    this.updatedistrictID();
    this.fetchProvinces();

    const intervalId = setInterval(() => {
      this.$nextTick(() => {
        const labels = document.querySelectorAll('.v-label.v-field-label');
        labels.forEach((label) => {
          if (label.textContent.trim() === 'Province I D') {
            label.textContent = 'Select Province Name';
          }
        });
      });
    }, 1000); // Runs every 1 second

    // setTimeout(() => {
    //   clearInterval(intervalId); // Stops the interval after 7 seconds
    // }, 7000);
  },

  watch: {
    viewDataModal(value) {
      this.$emit("update:viewDataModal", value);
    },
  },

  computed: {
    filteredItems() {
      return this.search
        ? this.Districts.filter((p) =>
            p.fullName.toLowerCase().includes(this.search.toLowerCase())
          ).slice(0, this.lastLoadedIndex)
        : this.Districts.slice(0, this.lastLoadedIndex);
    },
  },

  methods: {
    showViewData(id) {
      return new Promise((resolve, reject) => {
        console.log(id);
        this.viewDataID = id;

        // Save the passed id in session storage with the key 'ViewSelectedRecordID'
        try {
          sessionStorage.setItem("ViewSelectedRecordID", id);
        } catch (error) {
          console.error("Failed to save ViewSelectedRecordID to sessionStorage", error);
          reject(error);
          return;
        }

        let viewModal = sessionStorage.getItem("ViewModal") ?? "false";
        viewModal = viewModal === "true" ? "false" : "true";
        sessionStorage.setItem("ViewModal", viewModal);

        console.log(sessionStorage.getItem("ViewModal"));

        this.viewDataModal = viewModal;

        // If everything is successful, resolve the Promise
        resolve(this.viewDataModal);
      });
    },

    updatedistrictID() {
      window.RandomUniqueID((newdistrictID) => {
        const districtIDField = this.hiddenFields.find(
          (field) => field.name === "DistrictID"
        );
        if (districtIDField) {
          districtIDField.value = newdistrictID;
        }
      });
    },

    async fetchDistricts() {
      try {
        const response = await axios.get(`${window.SERVER_URL}FetchDistricts`);
        this.Districts = response.data.records.map((district, index) => ({
          ...district, // Spread all properties of the district object
          color: this.colors[index % this.colors.length],
          initials: district.DistrictName.split(" ")
            .slice(0, 2)
            .map((name) => name[0])
            .join(""),
        }));
      } catch (error) {
        this.error = "An error occurred while fetching the data.";
        console.error(error);
      }
    },

    async fetchProvinces() {
      try {
        const response = await axios.get(`${window.SERVER_URL}FetchProvinces`);
        this.provinces = response.data.records.map((province, index) => ({
          ...province,
          color: this.colors[index % this.colors.length],
          initials: province.ProvinceName.split(" ")
            .slice(0, 2)
            .map((name) => name[0])
            .join(""),
        }));

        // Update the 'ProvinceName' entry in autoCompleteData
        const provinceObj = this.autoCompleteData.find(
          (item) => item.name === "ProvinceID"
        );
        if (provinceObj) {
          provinceObj.data = this.provinces.map((p) => p.ProvinceName);
        } else {
          // If the object doesn't exist, create a new one
          this.autoCompleteData.push({
            name: "ProvinceID",
            data: this.provinces.map((p) => p.ProvinceName),
          });
        }
      } catch (error) {
        this.error = "An error occurred while fetching the data.";
        console.error(error);
      }
    },

    onScroll(e) {
      const virtualScrollElement = e.target;
      if (
        virtualScrollElement.scrollTop + virtualScrollElement.clientHeight >=
        virtualScrollElement.scrollHeight
      ) {
        if (this.lastLoadedIndex < this.Districts.length) {
          this.lastLoadedIndex += 50;
        }
      }
    },
  },
};
</script>
