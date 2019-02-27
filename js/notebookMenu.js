const toggleBtn = document.querySelector('#hamburger-icon.toggle-btn');
const sidebar = document.getElementById("sidebar");
toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    toggleBtn.classList.toggle("active");
})