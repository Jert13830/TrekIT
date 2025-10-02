 const toggleBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("navbar");

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });

  

  /*const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  function toggleConfirmPasswordRequired() {
    if (passwordInput.value.trim() !== "") {
      confirmPasswordInput.setAttribute("required", "required");
    } else {
      confirmPasswordInput.removeAttribute("required");
    }
  }

  // run once on load
  toggleConfirmPasswordRequired();

  // re-check whenever user types in password
  passwordInput.addEventListener("input", toggleConfirmPasswordRequired);*/


 function maskInput(value, pattern) {
  let i = 0;
  return pattern.replace(/#/g, () => value[i++] || '');
}

const addressMacInput = document.querySelector("#addressMac");
if (addressMacInput) {
  addressMacInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9a-fA-F]/g, '');
    value = value.toUpperCase();
    value = value.slice(0, 12);
    e.target.value = maskInput(value, "##:##:##:##:##:##");
  });

  addressMacInput.addEventListener('keypress', function(e) {
    const char = String.fromCharCode(e.keyCode || e.which);
    if (!/[0-9a-fA-F]/.test(char)) {
      e.preventDefault(); 
    }
  });
}


/*document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Refresh when the page becomes visible again
    window.location.reload();
  }
});*/


function renderPieChart(canvasId) {
  const el = document.getElementById(canvasId);
  const labels = JSON.parse(el.dataset.labels);
  const data = JSON.parse(el.dataset.values);

  new Chart(el, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: [
          'rgba(43, 87, 151, 0.7)',
					'rgba(253, 126, 20, 0.7)',
					'rgba(0, 171, 169, 0.7)',
					'rgba(108, 117, 125, 0.7)',
				],
        data: data,
        borderWidth: 1
      }]
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  renderPieChart("myChart");
});