
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function loadAllReports() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') {
    alert('Admin login required.');
    window.location.href = 'login.html';
    return;
  }

  fetch(`http://localhost:8080/api/reports/all`, {
    headers: { Authorization: 'Bearer ' + token }
  })
  .then(async response => {
    if (!response.ok) {
      alert('Failed to load reports.');
      return;
    }
    const data = await response.json();
    const tbody = document.getElementById('adminReportsTableBody');
    tbody.innerHTML = '';
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">No reports found.</td></tr>`;
      return;
    }
    data.forEach((report, idx) => {
      const date = new Date(report.createdAt || report.date).toLocaleDateString();
      const reportedBy = report.user ? report.user.name : 'Unknown';
      const location = report.location || '';
      const landmark = report.landmark || '';
      const issue = report.description || report.issue || '';
      const photoUrl = report.photo || report.image || null;
      const status = report.status || 'Pending';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${date}</td>
        <td>${escapeHtml(reportedBy)}</td>
        <td>${escapeHtml(location)}</td>
        <td>${escapeHtml(landmark)}</td>
        <td>${escapeHtml(issue)}</td>
        <td></td> <!-- photo cell placeholder -->
        <td>
          <select class="form-select form-select-sm" onchange="updateStatus('${report._id}', this.value)">
            <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
      `;
      const photoCell = tr.children[6]; 
      if (photoUrl) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-link p-0';
        btn.textContent = 'View';
        btn.title = 'View Photo';
       
        btn.addEventListener('click', () => showPhotoModal(photoUrl));
        photoCell.appendChild(btn);
      } else {
        photoCell.textContent = 'No Photo';
      }

      tbody.appendChild(tr);
    });
  })
  .catch(() => alert('Error. Please try again later.'));
}

function showPhotoModal(photoUrl) {
  const modal = document.getElementById('photoModalSimple');
  const modalImg = document.getElementById('modalPhotoSimple');

  let url = photoUrl;
  if (!url.startsWith('http')) {
    if (!url.startsWith('uploads/')) {
      url = 'uploads/' + url.replace(/^.*[\\\/]/, '');
    }
    url = `http://localhost:8080/${url.replace(/^\/+/, '')}`;
  }

  modalImg.src = url;
  modal.classList.add('active');
}

function closePhotoModal() {
  const modal = document.getElementById('photoModalSimple');
  const modalImg = document.getElementById('modalPhotoSimple');
  modal.classList.remove('active');
  modalImg.src = '';
}

function updateStatus(reportId, newStatus) {
  if (!confirm(`Change status to '${newStatus}'?`)) return;
  const token = localStorage.getItem('token');
  fetch(`http://localhost:8080/api/reports/${reportId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ status: newStatus })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert('Error updating status: ' + data.error);
    } else {
      alert('Status updated successfully.');
      loadAllReports();
    }
  })
  .catch(() => alert('Error. Please try again later.'));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = 'login.html';
}

function loadAllAdminData() {
  loadAllReports();
}

window.onload = loadAllAdminData;

