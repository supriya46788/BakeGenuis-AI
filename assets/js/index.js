
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

        // Smooth scroll for CTA button
        const ctaButton = document.querySelector(".cta-button");
        ctaButton.addEventListener("click", (e) => {
            e.preventDefault();
            // Add a fun animation on click
            ctaButton.style.animation = "bounce 0.5s ease-in-out";
            setTimeout(() => {
                ctaButton.style.animation = "pulse 2s ease-in-out infinite";
                // Navigate to convert page (in real app)
                window.location.href = "convert.html";
            }, 500);
        });

        // Back to Top Button Logic
        const backToTopBtn = document.getElementById("backToTop");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
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

        // Parallax effect for decorative icons
        window.addEventListener("scroll", () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;

            document.querySelectorAll(".baking-icon").forEach((icon, index) => {
                icon.style.transform = `translateY(${parallax * (index + 1) * 0.1
                    }px) rotate(${parallax * 0.05}deg)`;
            });
        });

        // Add sparkle effect on hover for feature cards
        document.querySelectorAll(".feature-card").forEach((card) => {
            card.addEventListener("mouseenter", () => {
                card.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.15)";
            });

            card.addEventListener("mouseleave", () => {
                card.style.boxShadow = "none";
            });
        });

        // Login/Sign-Up Modal Logic
        const loginModal = document.getElementById("loginModal");
        const openLoginModal = document.getElementById("openLoginModal");
        const closeLoginModal = document.getElementById("closeLoginModal");
        const loginForm = document.getElementById("loginForm");
        const signUpForm = document.getElementById("signUpForm");
        const toggleForm = document.getElementById("toggleForm");
        const modalTitle = document.getElementById("modalTitle");
        const formError = document.getElementById("formError");

        // Open Modal
        openLoginModal.addEventListener("click", (e) => {
            e.preventDefault();
            loginModal.style.display = "flex";
            loginForm.style.display = "block";
            signUpForm.style.display = "none";
            modalTitle.textContent = "Login";
            toggleForm.textContent = "Don't have an account? Sign Up";
            formError.style.display = "none";
        });

        // Close Modal
        closeLoginModal.addEventListener("click", () => {
            loginModal.style.display = "none";
        });

        /// Toggle between login and signup
        document.getElementById('toggleForm').addEventListener('click', function() {
            const loginForm = document.getElementById('loginForm');
            const signUpForm = document.getElementById('signUpForm');
            const toggleText = document.getElementById('toggleText');
            const toggleLink = document.getElementById('toggleForm');
            const formTitle = document.querySelector('.form-title');
            
            if (loginForm.style.display !== 'none') {
                // Switch to Sign Up
                loginForm.style.display = 'none';
                signUpForm.style.display = 'block';
                toggleText.textContent = 'Already have an account?';
                toggleLink.textContent = 'Login';
                formTitle.textContent = 'Create Account';
            } else {
                // Switch to Login
                loginForm.style.display = 'block';
                signUpForm.style.display = 'none';
                toggleText.textContent = 'Don\'t have an account?';
                toggleLink.textContent = 'Sign Up';
                formTitle.textContent = 'Welcome Back';
            }
        });

        // Toggle password visibility
        function togglePassword(inputId) {
            const passwordInput = document.getElementById(inputId);
            const toggleIcon = passwordInput.parentElement.querySelector('.password-toggle i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.className = 'fa-regular fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                toggleIcon.className = 'fa-regular fa-eye';
            }
        }


        // Handle Login Form Submission
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;

            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem("users")) || {};

            // Check if the user exists and the password matches
            if (users[username] && users[username] === password) {
                alert(`Welcome back, ${username}!`);
                loginModal.style.display = "none";

                // Set login state
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", username);
                updateLoginState();
            } else {
                formError.textContent = "Invalid username or password.";
                formError.style.display = "block";
            }
        });

        // Handle Sign-Up Form Submission
        signUpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("signUpUsername").value;
            const password = document.getElementById("signUpPassword").value;
            const confirmPassword =
                document.getElementById("confirmPassword").value;

            // Validate passwords match
            if (password !== confirmPassword) {
                formError.textContent = "Passwords do not match.";
                formError.style.display = "block";
                return;
            }

            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem("users")) || {};

            // Check if the username already exists
            if (users[username]) {
                formError.textContent = "Username already exists.";
                formError.style.display = "block";
            } else {
                // Save the new user
                users[username] = password;
                localStorage.setItem("users", JSON.stringify(users));
                alert("Sign-Up successful! You can now log in.");
                loginForm.style.display = "block";
                signUpForm.style.display = "none";
                modalTitle.textContent = "Login";
                toggleForm.textContent = "Don't have an account? Sign Up";
                formError.style.display = "none";
            }
        });

        // Function to update login state
        function updateLoginState() {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const loginBtn = document.getElementById("openLoginModal");
            const logoutBtn = document.getElementById("logoutBtn");

            if (isLoggedIn) {
                loginBtn.style.display = "none";
                logoutBtn.style.display = "flex";
            } else {
                loginBtn.style.display = "flex";
                logoutBtn.style.display = "none";
            }
        }

        // Logout functionality
        document.getElementById("logoutBtn").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            updateLoginState();
            alert("You have been logged out successfully!");
        });

        // Check login state on page load
        document.addEventListener("DOMContentLoaded", () => {
            updateLoginState();
        });

        // Close Modal on Outside Click
        window.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = "none";
            }
        });

        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                document.title = 'BakeGenius.ai - Perfect Baking Every Time!';
            } else {
                document.title = 'Come back to Website';
            }
        });

        document.addEventListener("DOMContentLoaded", function () {
            const loadingScreen = document.getElementById("loading-screen");
        
            // Set a timeout to hide the loading screen
            setTimeout(() => {
                loadingScreen.classList.add("hidden");
            }, 7000); // 7000ms = 7 seconds (adjust as needed)
        });
