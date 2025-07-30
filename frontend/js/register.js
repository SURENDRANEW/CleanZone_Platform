

function registerUser() {
  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var location = document.getElementById('location').value.trim();

  if (!name || !email || !password || !phone || !location) {
    alert('Please fill all fields.');
    return false;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters.');
    return false;
  }

  fetch('https://cleanzone-platform.onrender.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone, location })
  })
  .then(response => response.json().then(data => {
    if (!response.ok) {
      alert(data.error || 'Registration failed.');
    } else {
      localStorage.setItem('token', data.token);
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    }
  }))
  .catch(() => alert('Error. Please try again later.'));

  return false;
}
