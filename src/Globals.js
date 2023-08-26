/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */

import axios from "axios";
import Swal from "sweetalert2";

window.RandomUniqueID = (callback) => {
  setInterval(() => {
    const randomNumbers = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const randomChars = Array.from({ length: 4 }, () =>
      String.fromCharCode(
        Math.floor(Math.random() * 26) + (Math.random() < 0.5 ? 65 : 97)
      )
    ).join("");
    const unixTimestamp = Math.floor(new Date().getTime() / 1000);

    var result = randomChars + randomChars + randomNumbers + unixTimestamp;
    // Call the callback function with the generated result
    if (typeof callback === "function") {
      callback(result);
    }
  }, 1000);
};

window.SendFormEngine = function (formId, callback) {
  let attempts = 0;
  const interval = setInterval(() => {
    const form = document.getElementById(formId);

    if (form || attempts >= 20) {
      clearInterval(interval);

      if (!form) {
        console.log("Form not found attempts >= 20, This is not Fatal");
        return;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        console.log("Form submitted");

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

        axios
          .post(window.SERVER_URL + postRoute, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data[0].status) {
              Swal.fire(
                "Action Successful",
                response.data[0].status,
                "success"
              );
              if (callback) callback();
            }
          })
          .catch((error) => {
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
              console.error(error);
            }
          });
      });
    }

    attempts++;
  }, 400);
};

window.AppPageTitle = (PageTitle) => {
  document
    .querySelectorAll(".v-toolbar-title__placeholder")
    .forEach((toolbar) => {
      toolbar.innerHTML = PageTitle;
    });
};

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    if (error) {
      console.log("Request error: ", error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // If the response is successful, just pass it along
    return response;
  },
  function (error) {
    // Do something with response error
    if (error && error.response && error.response.data) {
      if (
        Array.isArray(error.response.data) &&
        error.response.data[0].hasOwnProperty("error_a")
      ) {
        Swal.fire("Action Failed", error.response.data[0].error_a, "error");
        console.log("Data: ", error.response.data);
      } else {
        console.log("Data: ", error.response.data);
        console.log("Status: ", error.response.status);
        console.log("Headers: ", error.response.headers);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received: ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    return Promise.reject(error);
  }
);

window.Toggler = () => {
  let viewModal = sessionStorage.getItem("ViewModal");

  if (viewModal === null) {
    // If the 'ViewModal' key doesn't exist, set it to 'false' by default
    sessionStorage.setItem("ViewModal", false);
    viewModal = true;
  }

  // Toggle the value between 'true' and 'false'
  viewModal = viewModal === true ? false : true;
  sessionStorage.setItem("ViewModal", viewModal);

  // Return the updated value
  return sessionStorage.getItem("ViewModal");
};
