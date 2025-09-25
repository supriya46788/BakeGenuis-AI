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

        // Close mobile menu when clicking outside
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

        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });