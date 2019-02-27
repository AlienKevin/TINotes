const toggleBtn = document.querySelector('#hamburger-icon.toggle-btn');
const sidebar = document.getElementById("sidebar");
toggleBtn.addEventListener("click", (event) => {
    event.preventDefault(); // prevent scrolling up to top
    sidebar.classList.toggle("active");
    toggleBtn.classList.toggle("active");
});
// const notebook = {};
// Object.keys(localStorage).forEach(key => {
// 	console.log('TCL: key', key);
//     notebook[key] = getItemFromStorage(key);
// })