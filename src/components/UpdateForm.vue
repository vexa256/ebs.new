<template>
  <div>
    <v-card class="pa-5" loading style="margin-top: 20px" elevation="0">
      <!-- <v-card-title>{{ headerText }}</v-card-title> -->
      <v-card-text>
        <form @submit.prevent="sendFormEngine">
          <template v-for="(chunk, index) in chunks" :key="index">
            <div v-if="activeStep === index + 1">
              <v-row justify="space-around">
                <v-col
                v-for="field in chunk"
                :key="field.name"
                :cols="
                  field.type === 'text' ||
                  field.type === 'select' ||
                  field.type === 'autocomplete'
                    ? '12'
                    : '12'
                "
              >
                  <v-textarea
                    v-if="field.type === 'text'"
                    :name="field.name"
                    :label="formatLabel(field.name)"
                    v-model="formValues[field.name]"
                  ></v-textarea>
                  
                  <v-text-field
                    v-if="field.type === 'date'"
                    :name="field.name"
                    :label="formatLabel(field.name)"
                    type="date"
                    v-model="formValues[field.name]"
                  ></v-text-field>
    
                  <v-text-field
                    v-else-if="field.type !== 'select' && field.type !== 'autocomplete'"
                    :name="field.name"
                    :label="formatLabel(field.name)"
                    :type="field.type"
                    v-model="formValues[field.name]"
                  ></v-text-field>
    
                  <v-autocomplete
                    v-if="field.type === 'select' || field.type === 'autocomplete'"
                    :name="field.name"
                    :label="formatLabel(field.name)"
                    :items="field.options"
                    v-model="formValues[field.name]"
                  ></v-autocomplete>
    
                  <div>
                    <input
                      v-for="field in hiddenFields"
                      :key="field.name"
                      type="hidden"
                      :name="field.name"
                      :value="field.value"
                      
                    />
                  </div>
                </v-col>
              </v-row>
              
              <v-row justify="space-around">
                <v-btn color="blue-grey" v-if="index > 0" @click="activeStep--">
                  Previous
                </v-btn>
                <v-btn color="indigo" v-if="index < chunks.length - 1" @click="activeStep++">
                  Next
                </v-btn>
                <v-btn color="red" type="submit" v-if="index === chunks.length - 1">
                  Submit
                </v-btn>
              </v-row>
            </div>
          </template>
        </form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
// import { onMounted, nextTick } from 'vue';
import { onMounted, nextTick } from "vue";

const SERVER_URL = window.SERVER_URL;

export default {
  emits: ["updateSuccess"],

  props: {
    tableName: String,
    FormID: String,
    excludedColumns: Array,
    formDivId: String,
    id: String,

    selectElements: {
      type: Array,
      default: () => [],
    },
    autoCompleteData: {
      type: [Object, Array],
      default: () => [],
    },

    hiddenFields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      record: {},
      dialog: true,
      chunks: [],
      formId: `${this.FormID}Form`,
      activeStep: 1,
      formValues: {},
      // chunks: [],
      // activeStep: 1,
    };
  },
  setup() {
    onMounted(async () => {
      await nextTick();

      const intervalId = setInterval(() => {
        const el = document.querySelector('[name="id"]');
        const parentElement = el?.closest(".v-input"); // Vuetify input wrapper class

        if (parentElement) {
          parentElement.style.display = "none"; // Hide the entire component
        }
      }, 500);

      setTimeout(() => clearInterval(intervalId), 7000);
    });
  },
  watch: {
    id: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log(`ID changed from ${oldVal} to ${newVal}`);
        // Now you can call any function you want when id changes
        this.fetchRecord();
      },
    },
  },
  async mounted() {
    this.fetchColumns();
    this.fetchRecord(); // Call this new method to fetch the record
    this.setupFormSubmission();
    this.formValues["id"] = sessionStorage.getItem("record_id");

    console.log('this is the auto complete '+ this.autoCompleteData);
  },
  methods: {
    async fetchColumns() {
      try {
        const response = await axios.post(window.SERVER_URL+`getColumnDetails`, {
          tableName: this.tableName,
          excludedColumns: this.excludedColumns,
        });
        
        let columns = response.data.columnData;

        columns = columns.map((col) => {
          const autoCompleteField = this.autoCompleteData.find(
            (el) => el.name === col.name
          );

          if (autoCompleteField) {
            return {
              ...col,
              type: 'autocomplete',
              options: autoCompleteField.data,
            };
          }
          return col;
        });

        this.chunks = this.chunkArray(columns, 3);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchRecord() {
      try {
        const response = await axios.post(SERVER_URL + "FetchSpecificRecords", {
          TableName: this.tableName,
          id: sessionStorage.getItem("record_id"),
          excludedColumns: this.excludedColumns,
        });

        if (response.data.records && response.data.records.length > 0) {
          this.record = response.data.records[0];
          this.formValues["id"] = this.record.id || sessionStorage.getItem("record_id");
        } else {
          console.error("No record found");
        }
      } catch (error) {
        console.error(error);
      }
    },

    async sendFormEngine() {
      const combinedFormValues = {
        ...this.formValues,
        ...this.hiddenFields.reduce((acc, field) => {
          acc[field.name] = field.value;
          return acc;
        }, {}),
      };

      // Explicitly setting 'id' field after spreading.
      combinedFormValues.id = this.formValues["id"];

      console.log(this.formValues["id"]);

      try {
        const response = await axios.post(SERVER_URL + "MassUpdate", combinedFormValues, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data[0].status) {
          console.log(response.data);
          Swal.fire("Action Successful", response.data[0].status, "success");
          this.$emit("updateSuccess");
        } else if (response.data[0].error_a) {
          Swal.fire("Error", response.data[0].error_a, "error");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    },

    getFieldValue(fieldName) {
      return this.record[fieldName] || ""; // Return the value from the record, or an empty string if not found
    },
    async fetchFields() {
      try {
        const response = await axios.post(`${SERVER_URL}fetchFields`, {
          formId: this.formId,
        });

        let fields = response.data.fieldData;

        if (Array.isArray(fields)) {
          fields = fields.map((field) => {
            if (field.type === "autocomplete") {
              // Search for an autocomplete field matching the field name
              const autoCompleteField = this.autoCompleteData.find(
                (el) => el.name === field.name
              );

              // If found, add options
              if (autoCompleteField) {
                return {
                  ...field,
                  options: autoCompleteField.data,
                };
              }
            }
            // If not found or if not an autocomplete field, return the field as is
            return field;
          });

          this.fields = fields;
        } else {
          console.error("Received data is not an array");
        }
      } catch (error) {
        console.error(error);
      }
    },

    isAutoCompleteColumn(columnName) {
      return (
        Array.isArray(this.autoCompleteData) &&
        this.autoCompleteData.some((el) => el.name === columnName)
      );
    },
    formatLabel(name) {
      return name.replace(/([A-Z])/g, " $1").trim();
    },
    chunkArray(array, chunkSize) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    },
    async setupFormSubmission() {
      let attempts = 0;
      let form = document.getElementById(this.formId);

      while (!form && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        form = document.getElementById(this.formId);
        attempts++;
      }

      if (form) {
        form.addEventListener("submit", (event) => this.sendFormEngine(event)); // Using arrow function to maintain `this` context
      } else {
        console.log("Form not found attempts >= 20, This is not Fatal");
      }
    },

    // async sendFormEngine() {
    //   // Create a new object to hold both the formValues and hiddenFields
    //   const combinedFormValues = {
    //     ...this.formValues,
    //     ...this.hiddenFields.reduce((acc, field) => {
    //       acc[field.name] = field.value;
    //       return acc;
    //     }, {}),
    //   };

    //   console.log("Captured form values including hidden fields:", combinedFormValues);

    //   try {
    //     const response = await axios.post(window.SERVER_URL+'MassUpdate', combinedFormValues, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });

    //     if (response.data[0].status) {
    //       Swal.fire("Action Successful", response.data[0].status, "success");
    //       this.$emit('updateSuccess');
    //     } else if (response.data[0].error_a) {
    //       Swal.fire("Error", response.data[0].error_a, "error");
    //     }
    //   } catch (error) {
    //     Swal.fire("Error", error.message, "error");
    //   }
    // },
  },
};
</script>
