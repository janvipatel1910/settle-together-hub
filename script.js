const supportForm = document.querySelector("#support-form");
const successMessage = document.querySelector("#success-message");
const googleAppsScriptURL = "https://script.google.com/macros/s/AKfycbxAePAEcgR-jgzprtsIdzKTze_3Qm8lLDGN_776l9Vhn70eV2ssVnbmdqrtCm7PfCD4/exec";
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

function getFormData() {
  const formData = new FormData(supportForm);
  return Object.fromEntries(formData.entries());
}

async function sendSupportRequest(requestData) {
  const response = await fetch(googleAppsScriptURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  });

  if (!response.ok) {
    throw new Error("The form could not be submitted.");
  }

  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    const responseData = JSON.parse(responseText);

    if (responseData.success === false) {
      throw new Error(responseData.message || "The form could not be submitted.");
    }

    return responseData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return responseText;
    }

    throw error;
  }
}

function showMessage(message, isError = false) {
  successMessage.textContent = message;
  successMessage.classList.toggle("error", isError);
  successMessage.classList.add("show");
}

function hideMessage() {
  successMessage.classList.remove("show", "error");
}

if (supportForm) {
  supportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage();

    if (validateForm()) {
      const submitButton = supportForm.querySelector("button[type='submit']");
      const originalButtonText = submitButton.textContent;
      const requestData = getFormData();

      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        await sendSupportRequest(requestData);
        showMessage("Thank you. Your support request has been sent successfully.");
        supportForm.reset();
        supportForm.querySelectorAll("[aria-invalid]").forEach((field) => {
          field.removeAttribute("aria-invalid");
        });
      } catch (error) {
        console.error(error);
        showMessage("Sorry, something went wrong. Please try again in a moment.", true);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
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

// Future JavaScript for Settle Together Hub can be added here.
