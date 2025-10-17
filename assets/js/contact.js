// =========================
// Mobile Navigation Toggle
// =========================
const hamburger = document.getElementById("hamburger-icon");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });

  // Close menu when clicking outside
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
}

// =========================
// Contact Form "Sent" Animation
// =========================
const contactForm = document.getElementById("bakeContactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("contactSuccess").style.display = "block";
    console.log("Form submitted");
    this.reset();
    setTimeout(() => {
      document.getElementById("contactSuccess").style.display = "none";
    }, 4000);
  });
}

// =========================
// 🌙 Dark Mode Toggle
// =========================
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  // Restore previous theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkModeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
  }

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = darkModeToggle.querySelector("i");

    if (document.body.classList.contains("dark-mode")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "light");
    }
  });
}
