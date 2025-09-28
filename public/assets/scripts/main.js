 const toggleBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("navbar");

  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });

  