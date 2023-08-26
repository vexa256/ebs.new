<template>
  <div>
    <form :id="formId">
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
                :placeholder="formatLabel(field.name)"
              ></v-textarea>
              <v-text-field
                v-if="
                  field.type === 'date' ||
                  field.type === 'datetime' ||
                  field.type === 'timestamp'
                "
                :name="field.name"
                :label="formatLabel(field.name)"
                type="date"
                :placeholder="formatLabel(field.name)"
              ></v-text-field>
              <v-text-field
                v-else-if="
                  field.type !== 'select' && field.type !== 'autocomplete'
                "
                :name="field.name"
                :label="formatLabel(field.name)"
                :type="field.type"
                :placeholder="formatLabel(field.name)"
              ></v-text-field>
              <v-autocomplete
                v-if="field.type === 'select'"
                :name="field.name"
                :label="formatLabel(field.name)"
                :items="field.options"
              ></v-autocomplete>
              <v-autocomplete
                v-if="field.type === 'autocomplete'"
                :name="field.name"
                :label="formatLabel(field.name)"
                :items="field.options"
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
            <v-btn
              color="indigo"
              v-if="index < chunks.length - 1"
              @click="activeStep++"
            >
              Next
            </v-btn>
            <v-btn color="red" type="submit" v-if="index === chunks.length - 1">
              Submit
            </v-btn>
          </v-row>
        </div>
        <!-- New code for hidden fields -->
      </template>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

const SERVER_URL = window.SERVER_URL;

export default {
  props: {
    tableName: String,
    FormID: String,
    excludedColumns: Array,
    formDivId: String,
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
      chunks: [],
      formId: `${this.FormID}Form`,
      activeStep: 1,
    };
  },
  mounted() {
    this.fetchColumns();
    this.setupFormSubmission();
  },
  methods: {
    async fetchColumns() {
      try {
        const response = await axios.post(`${SERVER_URL}getColumnDetails`, {
          tableName: this.tableName,
          excludedColumns: this.excludedColumns,
        });

        let columns = response.data.columnData;

        if (Array.isArray(columns)) {
          columns = columns.filter(
            (col) =>
              col.name !== "created_at" &&
              col.name !== "updated_at" &&
              !col.name.includes("ID") &&
              !this.excludedColumns.includes(col.name) &&
              !this.isAutoCompleteColumn(col.name)
          );

          this.chunks = this.chunkArray(columns, 3);
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

    async sendFormEngine(event) {
      event.preventDefault(); // Prevent the default form submission behavior

      const form = document.getElementById(this.formId);
      const postRouteInput = form.elements["PostRoute"];
      const postRoute = postRouteInput ? postRouteInput.value : null;
      if (!postRoute) {
        console.error("PostRoute not found in form");
        return;
      }

      const formData = new FormData(form);

      for (let value of formData.values()) {
        console.log(value);
      }

      try {
        const response = await axios.post(
          window.SERVER_URL + postRoute,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response.data);

        if (response.data[0].status) {
          Swal.fire("Action Successful", response.data[0].status, "success");
          if (typeof this.$emit === "function") this.$emit("submitSuccess");

          console.log("My Error " + response.data[0].error_a);
        } else if (response.data[0].error_a) {
          // Handling the specific error you mentioned
          Swal.fire("Error", response.data[0].error_a, "error");
        } else {
          // Log unexpected response structure to help diagnose the issue
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const validationErrors = Object.values(error.response.data.errors)
            .flat()
            .join("\n");
          Swal.fire({
            title: "Validation Error!",
            text: validationErrors,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          // Handling any other catch-all errors
          Swal.fire({
            title: "Error!",
            text: error.message || "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error(error);
        }
      }
    },
  },
};
</script>
