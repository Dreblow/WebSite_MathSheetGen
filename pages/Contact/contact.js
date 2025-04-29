document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const workingMsg = document.getElementById("workingMessage");
  const successMsg = document.getElementById("successPopup");

  // Generic function to fade in, wait, and fade out any popup
  function showFadingPopup(popupElement, message = "") {
    if (message) popupElement.textContent = message;

    popupElement.style.display = "block";
    setTimeout(() => {
      popupElement.style.opacity = "1"; // Fade in
    }, 10);

    setTimeout(() => {
      popupElement.style.opacity = "0"; // Fade out
      setTimeout(() => {
        popupElement.style.display = "none";
      }, 500); // Match transition duration
    }, 1500);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    showFadingPopup(workingMsg, "Working, please wait...");

    const formData = new FormData(form);

    fetch("contact.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(text => {
        if (text.includes("Message has been sent")) {
          showFadingPopup(successMsg, "Message sent successfully!");
          form.reset();
        } else {
          showFadingPopup(successMsg, "Failed to send message. Try again.");
          console.log(text);
        }
      })
      .catch(error => {
        showFadingPopup(successMsg, "An error occurred. Please try again.");
        console.error(error);
      });
  });
});