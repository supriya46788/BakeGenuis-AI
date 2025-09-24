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

// Star Rating Functionality
const stars = document.querySelectorAll('.star');
const ratingText = document.getElementById('ratingText');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        highlightStars(rating);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });

    star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-rating'));
        highlightStars(currentRating);
        updateRatingText(currentRating);
    });
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingText(rating) {
    const ratingTexts = [
        "Select a rating",
        "Poor",
        "Fair",
        "Good",
        "Very Good",
        "Excellent"
    ];
    ratingText.textContent = ratingTexts[rating];
}

// Category Selection
const categoryCards = document.querySelectorAll('.category-card');
let selectedCategory = '';

categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove active class from all cards
        categoryCards.forEach(c => c.classList.remove('selected'));
        // Add active class to clicked card
        card.classList.add('selected');
        selectedCategory = card.getAttribute('data-category');
    });
});

// Form Submission
const feedbackForm = document.getElementById('feedbackForm');
const successMessage = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        rating: currentRating,
        category: selectedCategory,
        message: document.getElementById('feedbackMessage').value,
        timestamp: new Date().toISOString()
    };

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields.');
        return;
    }

    if (currentRating === 0) {
        alert('Please select a rating.');
        return;
    }

    if (!selectedCategory) {
        alert('Please select a feedback category.');
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
        successMessage.classList.add('show');

        // Reset form
        feedbackForm.reset();
        currentRating = 0;
        selectedCategory = '';
        highlightStars(0);
        updateRatingText(0);
        categoryCards.forEach(c => c.classList.remove('selected'));

        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Feedback';

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
});


// Auto-fill user name if logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('userName').value = currentUser;
    }
});