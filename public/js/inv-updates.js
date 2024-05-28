const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      validateInput(input);
    });
  });

  function validateInput(input) {
    let isValid = false;

    if (input.name === "inv_make" || input.name === "inv_model") {
      isValid = input.value.length >= 3;
    } else if (input.name === "inv_year") {
      isValid = /^\d{4}$/.test(input.value);
    } else if (input.name === "inv_description") {
      isValid = input.value.length >= 1 && input.value.length <= 150;
    } else if (input.name === "inv_image" || input.name === "inv_thumbnail") {
      isValid = input.value.length >= 3;
    } else if (input.name === "inv_price") {
      isValid = !isNaN(input.value) && input.value.length >= 1;
    } else if (input.name === "inv_miles") {
      isValid = /^\d+$/.test(input.value);
    } else if (input.name === "inv_color") {
      isValid = input.value.length >= 1;
    }

    if (isValid) {
      input.classList.remove("invalid");
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
      input.classList.add("invalid");
    }
  }
});


