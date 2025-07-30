
function submitReport() {
  const location = document.getElementById('location').value.trim();
  const landmark = document.getElementById('landmark').value.trim();
  const description = document.getElementById('description').value.trim();
  const photoElem = document.getElementById('photo');

  if (!location || !description || photoElem.files.length === 0) {
    alert('Please fill location, description and upload a photo.');
    return false;
  }
  const formData = new FormData();
  formData.append('location', location);
  formData.append('landmark', landmark);
  formData.append('description', description);
  formData.append('photo', photoElem.files[0]);

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return false;
  }
  fetch('https://cleanzone-platform.onrender.com/api/reports', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: formData
  })
    .then(async response => {
      if (!response.ok) {
        try {
          const errData = await response.json();
          alert(errData.error || 'Failed to submit report.');
        } catch {
          alert('Failed to submit report.');
        }
        throw new Error('Submission failed');
      }
      return response.json();
    })
    .then(data => {
      alert('Report submitted successfully!');
      const form = document.getElementById('reportForm');
      if (form) {
        form.reset();
      }
    })
    .catch(error => {
      console.error('Error submitting report:', error);
      alert('Error. Please try again later.');
    });

  return false;  
}

