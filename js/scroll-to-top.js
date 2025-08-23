/**
 * Scroll to Top Button Functionality
 * Universal implementation for BakeGenius.ai
 */

class ScrollToTop {
    constructor(options = {}) {
        this.options = {
            // Scroll threshold to show button (in pixels)
            showOffset: 300,
            // Scroll animation duration (in milliseconds)  
            scrollDuration: 800,
            // Button text/icon
            buttonText: '⬆️',
            // Button title attribute
            buttonTitle: 'Scroll to top',
            // Additional CSS classes
            buttonClass: '',
            // Enable pulse effect
            enablePulse: true,
            // Enable smooth scroll
            enableSmoothScroll: true,
            // Button theme: 'default', 'minimal', 'dark', 'pastel'
            theme: 'default',
            ...options
        };
        
        this.button = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createButton();
        this.bindEvents();
        this.checkScrollPosition();
    }

    createButton() {
        // Remove existing button if any
        const existingButton = document.getElementById('scrollToTopBtn');
        if (existingButton) {
            existingButton.remove();
        }

        // Create button element
        this.button = document.createElement('button');
        this.button.id = 'scrollToTopBtn';
        this.button.className = `scroll-to-top ${this.options.buttonClass}`;
        this.button.innerHTML = this.options.buttonText;
        this.button.title = this.options.buttonTitle;
        this.button.setAttribute('aria-label', 'Scroll to top of page');
        
        // Apply theme
        if (this.options.theme !== 'default') {
            this.button.classList.add(`theme-${this.options.theme}`);
        }
        
        // Add to document
        document.body.appendChild(this.button);
    }

    bindEvents() {
        // Scroll event with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.checkScrollPosition();
            }, 10);
        });

        // Button click event
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        // Keyboard accessibility
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }

    checkScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > this.options.showOffset;

        if (shouldShow && !this.isVisible) {
            this.showButton();
        } else if (!shouldShow && this.isVisible) {
            this.hideButton();
        }
    }

    showButton() {
        this.isVisible = true;
        this.button.classList.add('show');
        this.button.classList.remove('hide');
        
        if (this.options.enablePulse) {
            // Add pulse effect after a delay
            setTimeout(() => {
                if (this.isVisible) {
                    this.button.classList.add('pulse');
                }
            }, 1000);
        }
    }

    hideButton() {
        this.isVisible = false;
        this.button.classList.add('hide');
        this.button.classList.remove('show', 'pulse');
        
        // Reset display style after animation completes
        setTimeout(() => {
            if (!this.isVisible) {
                this.button.style.display = '';
            }
        }, 400);
    }

    scrollToTop() {
        if (this.options.enableSmoothScroll && 'scrollTo' in window) {
            // Modern smooth scroll
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback animation for older browsers
            this.animateScroll();
        }

        // Add click feedback
        this.button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 150);
    }

    animateScroll() {
        const start = window.pageYOffset;
        const startTime = performance.now();
        const duration = this.options.scrollDuration;

        const animateStep = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start * (1 - easeOutCubic));

            if (progress < 1) {
                requestAnimationFrame(animateStep);
            }
        };

        requestAnimationFrame(animateStep);
    }

    // Public methods for customization
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.button.innerHTML = this.options.buttonText;
        this.button.title = this.options.buttonTitle;
    }

    destroy() {
        if (this.button) {
            this.button.remove();
        }
        window.removeEventListener('scroll', this.checkScrollPosition);
    }

    // Static method to create instance with default settings
    static create(options = {}) {
        return new ScrollToTop(options);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if scroll to top should be disabled
    if (document.body.dataset.disableScrollToTop !== 'true') {
        window.scrollToTopInstance = ScrollToTop.create();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollToTop;
}

// Global access
window.ScrollToTop = ScrollToTop;
