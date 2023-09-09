<template>
  <div>
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
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

import { onMounted, nextTick } from "vue";

export default {
  props: {
    tableName: String,
    excludedColumns: Array,
    selectElements: Array,
    autoCompleteData: Array,
    hiddenFields: Array,
  },
  data() {
    return {
      formValues: {},
      chunks: [],
      activeStep: 1,
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

      // setTimeout(() => clearInterval(intervalId), 7000);
    });
  },
  mounted() {
    this.fetchColumns();
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
    async sendFormEngine() {
      // Create a new object to hold both the formValues and hiddenFields
      const combinedFormValues = {
        ...this.formValues,
        ...this.hiddenFields.reduce((acc, field) => {
          acc[field.name] = field.value;
          return acc;
        }, {}),
      };

      console.log("Captured form values including hidden fields:", combinedFormValues);

      try {
        const response = await axios.post(window.SERVER_URL+'MassInsert', combinedFormValues, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data[0].status) {
          Swal.fire("Action Successful", response.data[0].status, "success");
          this.$emit('updateSuccess');
        } else if (response.data[0].error_a) {
          Swal.fire("Error", response.data[0].error_a, "error");
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    },
  
  },
};
</script>
