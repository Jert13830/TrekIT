 const toggleBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("navbar");

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });

  

  const passwordInput = document.getElementById("password");
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
  passwordInput.addEventListener("input", toggleConfirmPasswordRequired);