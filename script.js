const supportForm = document.querySelector("#support-form");
const radioGroups = ["accommodation-support", "job-support", "food-support"];

function showError(field) {
  const formGroup = field.closest(".form-group");

  if (formGroup) {
    formGroup.classList.add("error");
  }

  field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  const formGroup = field.closest(".form-group");

  if (formGroup) {
    formGroup.classList.remove("error");
  }

  field.removeAttribute("aria-invalid");
}

function isFieldValid(field) {
  if (field.type === "email") {
    return field.checkValidity();
  }

  return field.value.trim() !== "" && field.checkValidity();
}

function isRadioGroupValid(name) {
  return Boolean(document.querySelector(`input[name="${name}"]:checked`));
}

function validateForm() {
  let formIsValid = true;

  const requiredFields = supportForm.querySelectorAll("input[required]:not([type=radio]), textarea[required]");

  requiredFields.forEach((field) => {
    if (!isFieldValid(field)) {
      showError(field);
      formIsValid = false;
    } else {
      clearError(field);
    }
  });

  radioGroups.forEach((groupName) => {
    const firstRadio = supportForm.querySelector(`input[name="${groupName}"]`);

    if (!isRadioGroupValid(groupName)) {
      showError(firstRadio);
      formIsValid = false;
    } else {
      supportForm.querySelectorAll(`input[name="${groupName}"]`).forEach(clearError);
    }
  });

  return formIsValid;
}

if (supportForm) {
  supportForm.addEventListener("submit", (event) => {
    if (!validateForm()) {
      event.preventDefault();
    }
  });

  supportForm.addEventListener("input", (event) => {
    clearError(event.target);
  });

  supportForm.addEventListener("change", (event) => {
    if (event.target.type === "radio") {
      supportForm.querySelectorAll(`input[name="${event.target.name}"]`).forEach(clearError);
    } else {
      clearError(event.target);
    }
  });
}
