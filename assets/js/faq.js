document.addEventListener("DOMContentLoaded", function () {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
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
    }

    // Set active navigation link based on current page
    setActiveNavigation();

    // FAQ Toggle Functionality
    document.querySelectorAll(".faq-question").forEach((btn) => {
        btn.addEventListener("click", () => {
            const item = btn.parentElement;

            // Close all other items
            document.querySelectorAll(".faq-item").forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }
            });

            item.classList.toggle("active");
        });
    });

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
});

// Back to Top Button Logic
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

//Top to Bottom Button Logic
const ToptobackBtn = document.getElementById("Toptoback");
window.addEventListener("scroll", () => {
    if (window.scrollY < 100) {
        ToptobackBtn.classList.add("show");
    } else {
        ToptobackBtn.classList.remove("show");
    }
});
ToptobackBtn.addEventListener("click", () => {
    window.scrollTo({ top: 10000, behavior: "smooth" });
});