// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    // Toggle menu on hamburger click
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close menu if clicked outside
    document.addEventListener("click", (e) => {
        const isClickInside = navLinks.contains(e.target) || hamburger.contains(e.target);
        if (!isClickInside) {
        navLinks.classList.remove("active");
        }
    });
});