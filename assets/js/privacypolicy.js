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

    // Scroll buttons logic
    const backToTopBtn = document.getElementById("backToTop");
    const ToptobackBtn = document.getElementById("Toptoback");
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("show", window.scrollY > 300);
      ToptobackBtn.classList.toggle("show", window.scrollY < 100);
    });
    backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    ToptobackBtn.addEventListener("click", () => window.scrollTo({ top: 10000, behavior: "smooth" }));
