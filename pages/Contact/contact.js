const form = document.getElementById('contactForm');
const workingMessage = document.getElementById('workingMessage');
const successPopup = document.getElementById('successPopup');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  workingMessage.style.display = 'block';
  successPopup.style.display = 'none';

  const formData = new FormData(form);

  fetch('/pages/contact/contact.php', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      workingMessage.style.display = 'none';
      successPopup.style.display = 'block';
      form.reset();
    } else {
      workingMessage.textContent = 'Something went wrong!';
    }
  })
  .catch(error => {
    workingMessage.textContent = 'Something went wrong!';
    console.error(error);
  });
});