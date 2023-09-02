import axios from "axios";
import Swal from "sweetalert2";
window.SERVER_URL = "http://172.28.212.175:8000/api/";
window.ASSET_URL = "http://172.28.212.175:8000/";

window.COLORS = [
  "#2196F3",
  "#90CAF9",
  "#64B5F6",
  "#42A5F5",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
  "#82B1FF",
  "#448AFF",
  "#2979FF",
  "#2962FF",
];

// // Add a request interceptor
// axios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     if (error) {
//       console.log("Request error: ", error);
//     }
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// // Add a response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     // If the response is successful, just pass it along
//     return response;
//   },
//   function (error) {
//     // Do something with response error
//     if (error && error.response && error.response.data) {
//       if (
//         Array.isArray(error.response.data) &&
//         error.response.data[0].hasOwnProperty("error_a")
//       ) {
//         Swal.fire("Action Failed", error.response.data[0].error_a, "error");
//         console.log("Data: ", error.response.data);
//       } else {
//         console.log("Data: ", error.response.data);
//         console.log("Status: ", error.response.status);
//         console.log("Headers: ", error.response.headers);
//       }
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.log("No response received: ", error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.log("Error", error.message);
//     }
//     return Promise.reject(error);
//   }
// );
