// Mobile Navigation Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
    });
}

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

// Scroll Buttons Functionality
const scrollToTopBtn = document.getElementById('scrollToTop');
const scrollToBottomBtn = document.getElementById('scrollToBottom');
const scrollButtons = document.querySelector('.scroll-buttons');

// Function to toggle scroll button visibility
function toggleScrollButtons() {
    if (!scrollToTopBtn || !scrollToBottomBtn || !scrollButtons) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance

    // Show/hide scroll to top button
    if (scrollTop > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }

    // Show/hide scroll to bottom button (only when not at bottom and scrolled some distance)
    if (!isAtBottom && scrollTop > 100) {
        scrollToBottomBtn.classList.add('show');
    } else {
        scrollToBottomBtn.classList.remove('show');
    }

    // Show/hide entire container if both buttons are hidden
    if (scrollToTopBtn.classList.contains('show') || scrollToBottomBtn.classList.contains('show')) {
        scrollButtons.style.opacity = '1';
        scrollButtons.style.visibility = 'visible';
    } else {
        scrollButtons.style.opacity = '0';
        scrollButtons.style.visibility = 'hidden';
    }
}

// Smooth scroll to top
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add a subtle animation to the button
        scrollToTopBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            scrollToTopBtn.style.transform = '';
        }, 150);
    });
}

// Smooth scroll to bottom
if (scrollToBottomBtn) {
    scrollToBottomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
        });
        
        // Add a subtle animation to the button
        scrollToBottomBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            scrollToBottomBtn.style.transform = '';
        }, 150);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM and CSS are fully rendered
    setTimeout(() => {
        toggleScrollButtons();
    }, 200);
});

// Listen for scroll events to show/hide buttons
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            toggleScrollButtons();
            ticking = false;
        });
        ticking = true;
    }
});

// Listen for resize events to handle responsive behavior
window.addEventListener('resize', () => {
    setTimeout(toggleScrollButtons, 100);
});

// Form Submission
const feedbackForm = document.getElementById('feedbackForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');

if (feedbackForm && submitBtn) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            message: document.getElementById('feedbackMessage').value,
            timestamp: new Date().toISOString()
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Simulate form submission (in real app, this would be an API call)
        setTimeout(() => {
            // Store feedback in localStorage (in real app, this would be sent to a server)
            const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
            existingFeedback.push(formData);
            localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

            // Show success message
            if (successMessage) {
                successMessage.classList.add('show');
            }

            // Reset form
            feedbackForm.reset();

            // Reset submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Issue Report';

            // Hide success message after 5 seconds
            if (successMessage) {
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1500);
    });
}