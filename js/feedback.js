// Feedback System for BakeGenius AI
class FeedbackSystem {
    constructor() {
        this.feedbacks = this.loadFeedbacks();
        this.initializeEventListeners();
        this.initializeAnimations();
    }

    // Load feedbacks from localStorage
    loadFeedbacks() {
        const feedbacks = localStorage.getItem('bakegenius_feedbacks');
        return feedbacks ? JSON.parse(feedbacks) : [];
    }

    // Save feedbacks to localStorage
    saveFeedbacks() {
        localStorage.setItem('bakegenius_feedbacks', JSON.stringify(this.feedbacks));
    }

    // Initialize event listeners
    initializeEventListeners() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', this.handleSubmit.bind(this));

        // 🔥 Keyboard shortcuts for quick submit
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                feedbackForm.requestSubmit();
            }
        });
    }
}

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const feedback = {
            id: Date.now().toString(),
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            message: formData.get('message').trim(),
            rating: formData.get('rating'),
            sentiment: this.detectSentiment(formData.get('message')),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Validate form data
        if (!feedback.name || !feedback.email || !feedback.message) {
            this.showError('Please fill in all fields');
            return;
        }

        if (!this.validateEmail(feedback.email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Show loading state
        this.setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Add feedback to storage
            this.feedbacks.unshift(feedback);
            this.saveFeedbacks();

            // Show success and feedback list
            this.showSuccess();
            this.displayFeedbackList();

        } catch (error) {
            // Handle feedback submission error gracefully
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Set loading state
    setLoading(isLoading) {
        const submitBtn = document.getElementById('submitBtn');
        const spinner = document.getElementById('loadingSpinner');
        const buttonText = submitBtn.querySelector('.button-text');

        if (isLoading) {
            submitBtn.disabled = true;
            spinner.style.display = 'inline-block';
            buttonText.textContent = '⏳ Submitting...';
        } else {
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = '🚀 Submit Feedback';
        }
    }

    // Show success message
    showSuccess() {
        const formSection = document.getElementById('feedbackFormSection');
        const successMessage = document.getElementById('successMessage');
        
        formSection.style.display = 'none';
        successMessage.classList.add('show');
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Show error message
    showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            
            const form = document.getElementById('feedbackForm');
            form.insertBefore(errorDiv, form.querySelector('.form-actions'));
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.background = 'rgba(255, 71, 87, 0.1)';
        errorDiv.style.border = '2px solid #FF4757';
        errorDiv.style.borderRadius = '15px';
        errorDiv.style.padding = '1rem';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.style.color = '#FF4757';
        errorDiv.style.fontWeight = '600';
        errorDiv.style.textAlign = 'center';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Detect sentiment (simple keyword-based for demo purposes)
    detectSentiment(message) {
        const positiveWords = ['good', 'great', 'amazing', 'love', 'excellent','nice'];
        const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'awful'];

        let score = 0;
        const lowerMsg = message.toLowerCase();

        positiveWords.forEach(word => { if (lowerMsg.includes(word)) score++; });
        negativeWords.forEach(word => { if (lowerMsg.includes(word)) score--; });

        if (score > 0) return 'Positive';
        if (score < 0) return 'Negative';
        return 'Neutral';
    }
    // Display feedback list
    displayFeedbackList() {
        const listSection = document.getElementById('feedbackListSection');
        const feedbackList = document.getElementById('feedbackList');
        
        if (this.feedbacks.length === 0) {
            feedbackList.innerHTML = '<p style="text-align: center; color: #666;">No feedback submitted yet.</p>';
        } else {
            feedbackList.innerHTML = this.feedbacks.map(feedback => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <span class="feedback-name">${this.escapeHtml(feedback.name)}</span>
                    <span class="feedback-date">${feedback.date}</span>
                </div>
                <div class="feedback-rating">Rating: ${'⭐'.repeat(feedback.rating)}</div>
                <div class="feedback-sentiment">Sentiment: ${feedback.sentiment}</div>
                <div class="feedback-email">${this.escapeHtml(feedback.email)}</div>
                <div class="feedback-message">${this.escapeHtml(feedback.message)}</div>
            </div>
        `).join('');
        }
        
        listSection.style.display = 'block';
        listSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize animations
    initializeAnimations() {
        this.createSparkles();
        this.initScrollAnimations();
        
        // Regenerate sparkles periodically
        setInterval(() => this.createSparkles(), 10000);
    }

    // Generate sparkles
    createSparkles() {
        const sparklesContainer = document.getElementById('sparkles');
        if (!sparklesContainer) return;
        
        // Clear existing sparkles
        sparklesContainer.innerHTML = '';
        
        const sparkleCount = 20;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            sparklesContainer.appendChild(sparkle);
        }
    }

    // Initialize scroll animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Global functions
function goToHome() {
    window.location.href = '../index.html';
}

// Initialize feedback system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new FeedbackSystem();
    
    // Feedback page initialization complete
});
// Add this code to your feature.js file

/**
 * Toggles the mobile navigation menu.
 */
// function initMobileMenu() {
//     // Find the hamburger button by its ID
//     const hamburgerBtn = document.getElementById('hamburger-menu');
//     // Find the menu container by its ID
//     const menuWrapper = document.getElementById('menu-wrapper');

//     // Make sure both elements exist before adding the click listener
//     if (hamburgerBtn && menuWrapper) {
//         hamburgerBtn.addEventListener('click', () => {
//             // Add or remove the 'active' class to show/hide the menu
//             menuWrapper.classList.toggle('active');
//         });
//     }
// }

// /**
//  * Makes the navbar background appear on scroll.
//  */
// function initNavbarScrollEffect() {
//     const navbar = document.querySelector('.navbar');
//     if (!navbar) return; // Exit if no navbar is found

//     const handleScroll = () => {
//         if (window.scrollY > 50) {
//             navbar.classList.add('navbar-scrolled');
//         } else {
//             navbar.classList.remove('navbar-scrolled');
//         }
//     };
//     window.addEventListener('scroll', handleScroll);
// }


// // This runs all initialization functions once the page is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     initMobileMenu();
//     initNavbarScrollEffect();
//     // You can add other shared functions here in the future
// });