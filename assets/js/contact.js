// Mobile Navigation Toggle
        const hamburger = document.getElementById("hamburger-icon");
        const navLinks = document.getElementById("nav-links");
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
            console.log("printed")
            this.reset();
            setTimeout(() => { document.getElementById("contactSuccess").style.display = "none"; }, 4000);
        });