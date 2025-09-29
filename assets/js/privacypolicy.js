// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
const navItems = document.querySelectorAll(".nav-links a");
navItems.forEach((item) => {
    item.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
    });
});

// Close mobile menu when clicking outside (only if menu is open)
document.addEventListener("click", (e) => {
    if (
        navLinks.classList.contains("active") &&
        !hamburger.contains(e.target) &&
        !navLinks.contains(e.target)
    ) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
    }
});