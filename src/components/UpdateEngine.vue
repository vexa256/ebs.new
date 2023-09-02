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
                  @click="deleteRecord(record.id, tableName)"
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

  <!-- <v-dialog v-model="editModal" fullscreen>
    <edit-component
      :record-id="selectedRecordId"
      :table-name="tableName"
      @close="closeEditModal"
    ></edit-component>
  </v-dialog> -->

  <v-dialog v-model="showUpdateForm" fullscreen>
  <v-toolbar dark color="primary">
    <v-btn icon dark @click="showUpdateForm = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-toolbar-title>Update Data</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items> </v-toolbar-items>
  </v-toolbar>
  <v-card class="shadow-lg enhanced-container">
    <UpdateForm
      :tableName="UpdateTableName"
      :FormID="FormID"
      :excludedColumns="excludedColumns"
      :formDivId="formDivId"
      :props="{ id: id }"
      :selectElements="selectElements"
      :autoCompleteData="autoCompleteData"
      :hiddenFields="hiddenFields"
    ></UpdateForm>
  </v-card>
  <v-card-actions>
    <v-btn icon @click="showUpdateForm = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-card-actions>
</v-dialog>

</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
// import EditComponent from "@/components/UpdateForm.vue"; // Update the path to the correct file location

import UpdateForm from "@/components/UpdateForm.vue";

export default defineComponent({
  components: {
    // EditComponent,
    UpdateForm,
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
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      records: [],
      searchTerm: "",
      sliderValue: 0,
      ViewModal: false,
      editModal: false,
      UpdateTableName: "false",
      selectedRecordId: null,
      showUpdateForm: false,
      id: 0,
      // tableName: 'your_table_name',
      FormID: "UpdateDiveID",
      // excludedColumns: ['column1', 'column2'],
      formDivId: "UpdateDiveID",
      RecordUpdateID: null,
      selectElements: [
        /* your array of select elements */
      ],
      autoCompleteData: [
        /* your array or object for autocomplete data */
      ],
      hiddenFields: [
      // {
      //   name: "created_at",
      //   value: new Date().toISOString().slice(0, 19).replace("T", ""),
      // },
      // {
      //   name: "ProvinceID",
      //   value: 222,
      // },
      { name: "id", value:   this.id},
      { name: "PostRoute", value: "MassUpdate" },
      { name: "TableName", value: this.tableName },
    ],
    };
  },
  watch: {
    viewDataModal: function () {
      this.ViewModal = true;
      

      // console.log('The is is '+sessionStorage.getItem("ViewSelectedRecordID"));
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
    async updateRecord(id, tableName) {
      try {
        sessionStorage.setItem("record_id", id);
        // Wait for the id to be saved in session storage
        await new Promise((resolve, reject) => {
          try {
        
            sessionStorage.setItem("record_id", id);
            resolve();
          } catch (error) {
            reject(error);
          }

       

        });

        // Proceed with the rest of the code only after the id has been saved
        this.selectedRecordId = id;
        this.id = id;
        this.RecordUpdateID = id;
        this.UpdateTableName = tableName;
        this.ViewModal = false; // Close the view modal
        this.showUpdateForm = true; // Open the update form
        console.log("UpdateID" + id + " tablename " + tableName);
      } catch (error) {
        // Handle or log any errors here
        console.error("Failed to save ID to session storage:", error);
      }
    },
    async deleteRecord(id, tableName) {
      // Show Swal dialog to ask for user confirmation
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      // If user confirms, proceed with deletion
      if (result.isConfirmed) {
        try {
          const response = await axios.post(window.SERVER_URL + 'MassDelete', {
            TableName: tableName,
            id: id,
          });

          // If deletion was successful, show a success message
          if (response.status === 200) {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            );
            // Refresh your records or remove the deleted record from the state
            await this.fetchAndDisplayData(); // Assuming this is your method to refresh records
          } else {
            Swal.fire(
              'Failed!',
              'Failed to delete the record.',
              'error'
            );
          }

        } catch (error) {
          console.error("Error deleting record:", error);
          Swal.fire(
            'Failed!',
            'Failed to delete the record.',
            'error'
          );
        }
      }
    },
    async fetchAndDisplayData() {
      try {
        const {
          data: { records },
        } = await axios.post(`${this.serverUrl}FetchSpecificRecords`, {
          TableName: this.tableName,
          id: sessionStorage.getItem("ViewSelectedRecordID"),
          excludedColumns: this.excludedColumns,
        });
        if (!Array.isArray(records) || records.length === 0)
          throw "Invalid or empty records";
        this.records = records;
      } catch (error) {
        // console.log("Error fetching records: or record deleted", error);
      }
    },
  },
  async created() {
    await this.fetchAndDisplayData();
  },
  mounted() {
    this.editModal = false;
    this.intervalId = setInterval(() => {
      this.fetchAndDisplayData();
      // console.log('ran');
    }, 500);

    
  },beforeUnmount() {
    clearInterval(this.intervalId); // clear the interval when the component is destroyed
  },
});
</script>
