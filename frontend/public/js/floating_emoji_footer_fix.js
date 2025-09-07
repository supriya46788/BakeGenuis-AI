/**
 * Floating Emoji Footer Fix
 * Prevents floating emoji decorations from overlapping footer content
 * by detecting when footer enters viewport and hiding/repositioning emojis
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        footerSelector: '.footer, footer',
        floatingElementsSelectors: [
            '.floating-elements',
            '.floating-element', 
            '.floating-cupcake',
            '.animated-bg .floating-element'
        ],
        observerOptions: {
            threshold: 0.1,
            rootMargin: '50px 0px 0px 0px' // Start hiding slightly before footer comes into view
        }
    };
    
    let footerObserver;
    let isFooterVisible = false;
    
    /**
     * Initialize the footer observer when DOM is ready
     */
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFooterObserver);
        } else {
            initFooterObserver();
        }
    }
    
    /**
     * Set up Intersection Observer to watch for footer visibility
     */
    function initFooterObserver() {
        const footer = document.querySelector(CONFIG.footerSelector);
        
        if (!footer) {
            // Footer not found - emoji fix not needed
            return;
        }
        
        // Create intersection observer
        footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hideFloatingEmojis();
                    isFooterVisible = true;
                } else {
                    showFloatingEmojis();
                    isFooterVisible = false;
                }
            });
        }, CONFIG.observerOptions);
        
        // Start observing the footer
        footerObserver.observe(footer);
    }
    
    /**
     * Hide all floating emoji elements
     */
    function hideFloatingEmojis() {
        const elements = getAllFloatingElements();
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            element.style.transition = 'opacity 0.3s ease-out';
        });
    }
    
    /**
     * Show all floating emoji elements
     */
    function showFloatingEmojis() {
        const elements = getAllFloatingElements();
        elements.forEach(element => {
            element.style.opacity = '';
            element.style.pointerEvents = '';
            element.style.transition = 'opacity 0.3s ease-in';
        });
    }
    
    /**
     * Get all floating emoji elements from the page
     */
    function getAllFloatingElements() {
        const elements = [];
        
        CONFIG.floatingElementsSelectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            elements.push(...found);
        });
        
        return elements;
    }
    
    /**
     * Alternative approach: Lower z-index instead of hiding
     * This keeps emojis visible but puts them behind footer
     */
    function lowerEmojiZIndex() {
        const elements = getAllFloatingElements();
        elements.forEach(element => {
            element.style.zIndex = '-1';
            element.style.transition = 'opacity 0.3s ease-out';
        });
    }
    
    /**
     * Restore original z-index
     */
    function restoreEmojiZIndex() {
        const elements = getAllFloatingElements();
        elements.forEach(element => {
            element.style.zIndex = '';
            element.style.transition = 'opacity 0.3s ease-in';
        });
    }
    
    /**
     * Cleanup function
     */
    function cleanup() {
        if (footerObserver) {
            footerObserver.disconnect();
        }
        showFloatingEmojis();
    }
    
    // Initialize when script loads
    init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Expose functions for manual control if needed
    window.FloatingEmojiFooterFix = {
        hide: hideFloatingEmojis,
        show: showFloatingEmojis,
        isFooterVisible: () => isFooterVisible,
        cleanup: cleanup
    };
    
})();
