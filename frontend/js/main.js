function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  alert('Logged out successfully.');
  window.location.href = 'login.html';
}
