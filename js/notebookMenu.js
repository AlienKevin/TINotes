const toggleBtn = document.querySelector('#sidebar > .toggle-btn');
const sidebar = document.getElementById("sidebar");
toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    toggleBtn.classList.toggle("active");
    if (toggleBtn.textContent === "X"){
        toggleBtn.textContent = "☰";
    } else{
        toggleBtn.textContent = "X";
    }
})