// Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const darkModeIcon = darkModeToggle.querySelector("i");

    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
      body.classList.add("dark-mode");
      darkModeIcon.classList.replace("fa-moon","fa-sun");
    }

    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        darkModeIcon.classList.replace("fa-moon","fa-sun");
        localStorage.setItem("theme","dark");
      } else {
        darkModeIcon.classList.replace("fa-sun","fa-moon");
        localStorage.setItem("theme","light");
      }
    });

    // Mobile Navigation Toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const toggleNav = () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", (!expanded).toString());
    };
    hamburger.addEventListener("click", (e) => { e.stopPropagation(); toggleNav(); });
    hamburger.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleNav(); } });
    document.querySelectorAll(".nav-links a").forEach((item) => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded","false");
      });
    });
    document.addEventListener("click", (e) => {
      if (navLinks.classList.contains("active") && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded","false");
      }
    });

    // CTA button animation + nav
    const ctaButton = document.querySelector(".cta-button");
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault();
      ctaButton.style.animation = "bounce 0.5s ease-in-out";
      setTimeout(() => {
        ctaButton.style.animation = "pulse 2s ease-in-out infinite";
        window.location.href = "convert.html";
      }, 500);
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

    // Decorative parallax (safe if icons exist)
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      document.querySelectorAll(".baking-icon").forEach((icon, index) => {
        icon.style.transform = `translateY(${parallax * (index + 1) * 0.1}px) rotate(${parallax * 0.05}deg)`;
      });
    });

    // Feature hover sparkle
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("mouseenter", () => { card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.15)"; });
      card.addEventListener("mouseleave", () => { card.style.boxShadow = "none"; });
    });

    // Tab title change
    document.addEventListener("visibilitychange", function () {
      document.title = document.visibilityState === "visible"
        ? "BakeGenius.ai - Perfect Baking Every Time!"
        : "Come back to Website";
    });

    // Hide loading screen and set active navigation
    document.addEventListener("DOMContentLoaded", function () {
      const loadingScreen = document.getElementById("loading-screen");
      setTimeout(() => { loadingScreen.classList.add("hidden"); }, 1500);
      
      // Set active navigation link based on current page
      setActiveNavigation();
    });

    // Function to set active navigation link
    function setActiveNavigation() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-links a');
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }