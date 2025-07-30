function loginUser() {
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();
  var roleElems = document.getElementsByName('role');
  var role = null;
  for (var i = 0; i < roleElems.length; i++) {
    if (roleElems[i].checked) {
      role = roleElems[i].value;
      break;
    }
  }

  if (!email || !password || !role) {
    alert('Please fill all fields and select a role.');
    return false;
  }

  fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  })
  .then(response => response.json().then(data => {
    if (!response.ok) {
      alert(data.error || 'Login failed.');
    } else {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      alert('Login successful!');
      if (data.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }
  }))
  .catch(() => alert('Error. Please try again later.'));

  return false; 
}
