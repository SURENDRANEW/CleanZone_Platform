const base_url= process.env.Backend_API_URL;
function loadReports() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to view reports.');
    window.location.href = 'login.html';
    return;
  }

  fetch(`${base_url}/api/reports/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(async response => {
    const data = await response.json();
    if (!response.ok) {
      alert(data.error || 'Failed to load reports.');
      return;
    }

    const container = document.getElementById('reportsContainer');
    const noReportsMsg = document.getElementById('noReportsMessage');
    container.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      noReportsMsg.classList.remove('d-none');
      return;
    }

    noReportsMsg.classList.add('d-none');

    data.forEach(report => {
      const tr = document.createElement('tr');

      const submittedDate = report.createdAt 
        ? new Date(report.createdAt).toLocaleDateString() 
        : 'N/A';

      tr.innerHTML = `
        <td>${report.location || 'N/A'}</td>
        <td>${report.landmark || 'N/A'}</td>
        <td>${report.description || 'N/A'}</td>
        <td>${report.status || 'Pending'}</td>
        <td>${submittedDate}</td>
      `;

      container.appendChild(tr);
    });
  })
  .catch(() => {
    alert('Error. Please try again later.');
  });
}
