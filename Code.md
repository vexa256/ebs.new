<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  props: {
    RecordID: {
      type: Number,
      default: null,
    },
    provinceId: {
      type: Number,
      default: null,
    },
    tableName: {
      type: String,
      default: "provinces",
    },
    excludedColumns: {
      type: Array,
      default: () => ["created_at", "updated_at", "ProvinceID"],
    },
    titleColumnName: {
      type: String,
      default: "ProvinceName",
    },
    ignoredColumns: {
      type: Array,
      default: () => ["created_at", "updated_at"],
    },
    serverUrl: {
      type: String,
      default: window.SERVER_URL,
    },
  },
  data() {
    return {
      records: [],
      searchTerm: "",
      sliderValue: 0,
      viewDataModal: false,
    };
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
        return Object.entries(record).filter(
          ([key]) => !this.ignoredColumns.includes(key)
        );
      };
    },
  },
  methods: {
    async fetchAndDisplayData() {
      try {
        const {
          data: { records },
        } = await axios.post(`${this.serverUrl}FetchProvinces`, {
          excludedColumns: this.excludedColumns,
        });
        if (!Array.isArray(records) || records.length === 0)
          throw "Invalid or empty records";
        this.records = records;
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    },
    formatColumnName(name) {
      return name
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .trim();
    },
    updateRecord(id, tableName) {
      window.UpdateEngine(
        tableName,
        this.excludedColumns,
        "#UpdateModalContent",
        12,
        12,
        id
      );
      this.fetchAndDisplayData();
      window.setElementValueWhenAvailable(".UpdateRecordID", id);
    },
  },
  async created() {
    await this.fetchAndDisplayData();
  },
  mounted() {
    // You can add further lifecycle logic here if needed
  },
};
</script>