        // Dark Mode Toggle
        const darkModeToggle = document.getElementById("darkModeToggle");
        const body = document.body;
        const darkModeIcon = darkModeToggle.querySelector("i");
        const currentTheme = localStorage.getItem("theme") || "light";
        if (currentTheme === "dark") {
            body.classList.add("dark-mode");
            darkModeIcon.classList.remove("fa-moon");
            darkModeIcon.classList.add("fa-sun");
        }
        darkModeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            if (body.classList.contains("dark-mode")) {
                darkModeIcon.classList.remove("fa-moon");
                darkModeIcon.classList.add("fa-sun");
                localStorage.setItem("theme", "dark");
            } else {
                darkModeIcon.classList.remove("fa-sun");
                darkModeIcon.classList.add("fa-moon");
                localStorage.setItem("theme", "light");
            }
        });
        // Mobile Navigation Toggle
        const hamburger = document.getElementById("hamburger");
        const navLinks = document.getElementById("navLinks");
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
        // Close mobile menu when clicking on a link
        document.querySelectorAll(".nav-links a").forEach(item => {
            item.addEventListener("click", () => {
                navLinks.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (navLinks.classList.contains("active") &&
                !hamburger.contains(e.target) &&
                !navLinks.contains(e.target)
            ) {
                navLinks.classList.remove("active");
                hamburger.classList.remove("active");
            }
        });
        
        // Contact form "sent" animation
        document.getElementById("bakeContactForm").addEventListener("submit", function (e) {
            e.preventDefault();
            document.getElementById("contactSuccess").style.display = "block";
            this.reset();
            setTimeout(() => { document.getElementById("contactSuccess").style.display = "none"; }, 4000);
        });
