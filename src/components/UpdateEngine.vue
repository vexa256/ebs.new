<template>
  <v-dialog v-model="ViewModal" fullscreen>
    <v-card class="shadow-lg enhanced-container">
      <v-card-title class="header-section">
        <v-text-field
          v-model="searchTerm"
          full-width
          label="Search"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-accordion>
          <v-accordion-item
            v-for="(record, index) in filteredRecords"
            :key="index"
          >
            <template #summary>
              <div class="summary-section">
                <h5 class="summary-title">
                  <v-icon class="icon-animation">fas fa-circle-notch</v-icon>
                  {{ record[titleColumnName] }}
                </h5>
                <v-icon class="icon-transition">fas fa-chevron-down</v-icon>
              </div>
            </template>
            <v-card class="mx-auto record-card">
              <v-card class="mx-auto" max-width="400">
                <v-list>
                  <v-list-subheader
                    >View and manage selected record</v-list-subheader
                  >
                  <v-divider
                    :thickness="5"
                    color="warning"
                    class="mt-2 mb-3"
                  ></v-divider>
                  <template v-for="record in records" :key="record.id">
                    <v-subheader class="text-h6 pt-5 mt-6">{{
                      record.ProvinceName
                    }}</v-subheader>

                    <v-list-item
                      v-for="(value, key) in filteredColumns(record)"
                      :key="key"
                      color="primary"
                      variant="plain"
                      class="mt-5"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          class="text-pink text-darken-4"
                          style="font-size: 30px !important"
                          >mdi-folder</v-icon
                        >
                      </template>
                      <div>
                        <v-list-item-title class="pt-3 font-weight-bold pb-3">{{
                          formatColumnName(key)
                        }}</v-list-item-title>
                        <v-list-item-subtitle class="pb-3 font-weight-bold">{{
                          value
                        }}</v-list-item-subtitle>
                      </div>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card>

              <v-card-actions
                class="action-buttons bg-red d-flex justify-space-between"
              >
                <v-btn
                  class="edit-button"
                  @click="updateRecord(record.id, tableName)"
                >
                  <v-icon>mdi-pencil</v-icon> Update
                </v-btn>
                <v-btn
                  class="delete-button DeleteMe"
                  :data-id="record.id"
                  :data-tablename="tableName"
                >
                  <v-icon>mdi-delete</v-icon> Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-accordion-item>
        </v-accordion>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" elevation="0" @click="CloseModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editModal" fullscreen>
    <edit-component
      :record-id="selectedRecordId"
      :table-name="tableName"
      @close="closeEditModal"
    ></edit-component>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import EditComponent from "@/components/UpdateForm.vue"; // Update the path to the correct file location

export default defineComponent({
  components: {
    EditComponent,
  },
  props: {
    RecordID: {
      type: String,
      required: true,
    },
    viewDataModal: {
      type: Boolean,
      required: true,
    },
    provinceId: {
      type: String,
      required: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    excludedColumns: {
      type: Array,
      required: true,
    },
    titleColumnName: {
      type: String,
      required: true,
    },
    ignoredColumns: {
      type: Array,
      required: true,
    },
    serverUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      records: [],
      searchTerm: "",
      sliderValue: 0,
      ViewModal: false,
      editModal: false,
      selectedRecordId: null,
    };
  },
  watch: {
    viewDataModal: function () {
      this.ViewModal = true;
    },
  },
  computed: {
    filteredRecords() {
      if (!this.searchTerm) {
        return this.records;
      }

      const normalizedSearchTerm = this.searchTerm.toLowerCase();
      return this.records.filter((record) => {
        const title = record[this.titleColumnName]?.toLowerCase();
        return title.includes(normalizedSearchTerm);
      });
    },
    filteredColumns() {
      return (record) => {
        return Object.fromEntries(
          Object.entries(record).filter(
            ([key]) =>
              !this.ignoredColumns.includes(key) &&
              !key.includes("ID") &&
              key !== "id"
          )
        );
      };
    },
  },
  methods: {
    CloseModal() {
      this.ViewModal = false;
    },
    closeEditModal() {
      this.editModal = false;
    },
    formatColumnName(name) {
      if (typeof name !== "string") {
        return name;
      }

      return name
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .trim();
    },
    updateRecord(id, tableName) {
      this.selectedRecordId = id;
      this.ViewModal = false; // Close the current dialog
      this.editModal = true; // Open the edit dialog
    },
    async fetchAndDisplayData() {
      try {
        const {
          data: { records },
        } = await axios.post(`${this.serverUrl}FetchSpecificRecords`, {
          TableName: this.tableName,
          id: this.RecordID || this.provinceId,
          excludedColumns: this.excludedColumns,
        });
        if (!Array.isArray(records) || records.length === 0)
          throw "Invalid or empty records";
        this.records = records;
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    },
  },
  async created() {
    await this.fetchAndDisplayData();
  },
  mounted() {
    // You can add further lifecycle logic here if needed
  },
});
</script>
