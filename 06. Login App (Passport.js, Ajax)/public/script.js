window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');

  if (!form) return;

  form.onsubmit = function(e) {
    e.preventDefault();

    fetch('/login', {
      method: 'POST',
      credentials: 'include', // "omit" by default, for cookies to work
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: this.email.value,
        password: this.password.value
      })
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        alert(res.error.message)
      } else if (res.displayName) {
        alert(`Welcome, ${res.displayName}`);
        window.location.reload(true);
      } else {
        throw new Error('Invalid response from the server');
      }
    })
    .catch((err) => alert(`Error: ${err.message}`));
  }
});
