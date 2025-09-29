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

            // Update icon
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