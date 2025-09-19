        // Dark Mode Toggle
        const darkModeToggle = document.getElementById("darkModeToggle");
        const body = document.body;
        const darkModeIcon = darkModeToggle.querySelector("i");

        // Check for saved theme preference or default to light mode
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

        // Login/logout state management (placeholder)
        const loginBtn = document.getElementById("openLoginModal");
        const logoutBtn = document.getElementById("logoutBtn");

        // Check login state from localStorage
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
            loginBtn.style.display = "none";
            logoutBtn.style.display = "flex";
        }

        // Logout functionality
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            loginBtn.style.display = "flex";
            logoutBtn.style.display = "none";
            alert("You have been logged out successfully!");
        });

        // Login button click (placeholder - would need to implement full modal)
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            // For demo purposes, just redirect to home page
            window.location.href = "index.html";
        });
