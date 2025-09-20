// customize.js - Complete JavaScript functionality for BakeGenius.ai customize.html page

// Sample ingredients data (matches HTML structure)
const sampleIngredients = [
    {
        name: 'All-Purpose Flour',
        icon: '🌾',
        currentGrams: 120,
        measurementType: 'sifted',
        originalAmount: '1 cup'
    },
    {
        name: 'Brown Sugar',
        icon: '🍯',
        currentGrams: 200,
        measurementType: 'packed',
        originalAmount: '1 cup'
    },
    {
        name: 'Butter',
        icon: '🧈',
        currentGrams: 226,
        measurementType: 'softened',
        originalAmount: '1 cup'
    },
    {
        name: 'Vanilla Extract',
        icon: '🌟',
        currentGrams: 4,
        measurementType: 'liquid',
        originalAmount: '1 tsp'
    },
    {
        name: 'Baking Powder',
        icon: '⚡',
        currentGrams: 4,
        measurementType: 'leveled',
        originalAmount: '1 tsp'
    }
];

// Brand adjustments data
const brandAdjustments = {
    'standard': { 'All-Purpose Flour': 120 },
    'king-arthur': { 'All-Purpose Flour': 125 },
    'bob-red-mill': { 'All-Purpose Flour': 118 },
    'gold-medal': { 'All-Purpose Flour': 120 }
};

// DOM Elements
let darkModeToggle, darkModeIcon, body, hamburger, navLinks, navItems;
let ingredientsContainer, brandOptions, scrollTopBtn, scrollBottomBtn;
let loginBtn, logoutBtn, successMessage;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeDarkMode();
    initializeNavigation();
    initializeScrollButtons();
    initializeAuth();
    initializeCustomizeFeatures();
});

// Initialize DOM elements
function initializeElements() {
    // Theme elements
    darkModeToggle = document.getElementById('darkModeToggle');
    darkModeIcon = darkModeToggle?.querySelector('i');
    body = document.body;
    
    // Navigation elements
    hamburger = document.getElementById('hamburger');
    navLinks = document.getElementById('navLinks');
    navItems = document.querySelectorAll('.nav-links a');
    
    // Customize page elements
    ingredientsContainer = document.getElementById('ingredientsContainer');
    brandOptions = document.querySelectorAll('.brand-option');
    successMessage = document.getElementById('successMessage');
    
    // Scroll buttons
    scrollTopBtn = document.getElementById('scrollTopBtn');
    scrollBottomBtn = document.getElementById('scrollBottomBtn');
    
    // Auth elements
    loginBtn = document.getElementById('openLoginModal');
    logoutBtn = document.getElementById('logoutBtn');
}

// Dark Mode Functionality
function initializeDarkMode() {
    if (!darkModeToggle) return;
    
    // Load saved theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    }

    // Toggle event listener
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Mobile Navigation
function initializeNavigation() {
    if (!hamburger || !navLinks) return;

    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on nav items
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Scroll Buttons
function initializeScrollButtons() {
    if (!scrollTopBtn || !scrollBottomBtn) return;

    // Show/hide buttons based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        if (window.innerHeight + window.scrollY < document.body.offsetHeight - 300) {
            scrollBottomBtn.classList.add('show');
        } else {
            scrollBottomBtn.classList.remove('show');
        }
    });

    // Scroll functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollBottomBtn.addEventListener('click', function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// Authentication
function initializeAuth() {
    updateLoginState();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            updateLoginState();
            alert('You have been logged out successfully!');
        });
    }
}

function updateLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (loginBtn && logoutBtn) {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
        } else {
            loginBtn.style.display = 'flex';
            logoutBtn.style.display = 'none';
        }
    }
}

// Customize Page Features
function initializeCustomizeFeatures() {
    renderIngredients();
    loadBrandPreference();
    setupBrandSelector();
    addInteractiveElements();
}

// Load ingredients from localStorage or use sample data
function loadIngredients() {
    const savedIngredients = localStorage.getItem('bakegenius_ingredients');
    return savedIngredients ? JSON.parse(savedIngredients) : sampleIngredients;
}

// Render ingredient cards
function renderIngredients() {
    if (!ingredientsContainer) return;

    const ingredients = loadIngredients();
    
    ingredientsContainer.innerHTML = ingredients.map((ingredient, index) => `
        <div class="ingredient-card">
            <div class="ingredient-header">
                <span class="ingredient-icon">${ingredient.icon}</span>
                <span class="ingredient-name">${ingredient.name}</span>
                <span class="tooltip" data-tooltip="Original: ${ingredient.originalAmount}">ℹ️</span>
            </div>
            <div class="ingredient-controls">
                <div class="control-group">
                    <label class="control-label">Measurement Type</label>
                    <select class="custom-select" data-ingredient="${index}" data-field="measurementType">
                        <option value="sifted" ${ingredient.measurementType === 'sifted' ? 'selected' : ''}>Sifted</option>
                        <option value="packed" ${ingredient.measurementType === 'packed' ? 'selected' : ''}>Packed</option>
                        <option value="leveled" ${ingredient.measurementType === 'leveled' ? 'selected' : ''}>Leveled</option>
                        <option value="heaped" ${ingredient.measurementType === 'heaped' ? 'selected' : ''}>Heaped</option>
                        <option value="melted" ${ingredient.measurementType === 'melted' ? 'selected' : ''}>Melted</option>
                        <option value="softened" ${ingredient.measurementType === 'softened' ? 'selected' : ''}>Softened</option>
                        <option value="liquid" ${ingredient.measurementType === 'liquid' ? 'selected' : ''}>Liquid</option>
                    </select>
                </div>
                <div class="control-group">
                    <label class="control-label">Grams Override</label>
                    <input type="number" class="custom-input" 
                           value="${ingredient.currentGrams}" 
                           data-ingredient="${index}" 
                           data-field="currentGrams"
                           min="1" max="1000" step="0.1">
                </div>
            </div>
        </div>
    `).join('');

    addEventListeners();
}

// Add event listeners to controls
function addEventListeners() {
    const selects = document.querySelectorAll('.custom-select');
    const inputs = document.querySelectorAll('.custom-input');
    
    [...selects, ...inputs].forEach(function(element) {
        element.addEventListener('change', updateIngredient);
    });
}

// Update ingredient data when controls change
function updateIngredient(event) {
    const ingredientIndex = parseInt(event.target.dataset.ingredient);
    const field = event.target.dataset.field;
    const value = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    
    const ingredients = loadIngredients();
    ingredients[ingredientIndex][field] = value;
    
    // Auto-save changes
    localStorage.setItem('bakegenius_ingredients', JSON.stringify(ingredients));
}

// Brand Selector
function setupBrandSelector() {
    if (!brandOptions.length) return;

    brandOptions.forEach(function(option) {
        option.addEventListener('click', selectBrand);
    });
}

function selectBrand(event) {
    // Remove selected class from all options
    brandOptions.forEach(function(option) {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
    
    const selectedBrand = event.target.dataset.brand;
    localStorage.setItem('bakegenius_brand', selectedBrand);
    
    // Adjust gram values based on brand
    adjustForBrand(selectedBrand);
}

// Adjust ingredient weights based on selected brand
function adjustForBrand(brand) {
    const ingredients = loadIngredients();
    const adjustments = brandAdjustments[brand];

    if (adjustments) {
        ingredients.forEach(function(ingredient) {
            if (adjustments[ingredient.name]) {
                ingredient.currentGrams = adjustments[ingredient.name];
            }
        });
        
        localStorage.setItem('bakegenius_ingredients', JSON.stringify(ingredients));
        renderIngredients();
    }
}

// Load saved brand preference
function loadBrandPreference() {
    const savedBrand = localStorage.getItem('bakegenius_brand') || 'standard';
    
    brandOptions.forEach(function(option) {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-brand="${savedBrand}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
}

// Global functions for button events (required by HTML)
window.applyChanges = function() {
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '⏳ Applying...';
    
    setTimeout(function() {
        button.style.transform = '';
        button.innerHTML = '✨ Apply Changes';
        showSuccessMessage('Changes applied successfully!');
    }, 1000);
};

window.resetToDefaults = function() {
    if (confirm('Are you sure you want to reset all customizations to default values?')) {
        localStorage.removeItem('bakegenius_ingredients');
        localStorage.removeItem('bakegenius_brand');
        
        // Reset brand selection
        brandOptions.forEach(function(option) {
            option.classList.remove('selected');
        });
        const standardOption = document.querySelector('[data-brand="standard"]');
        if (standardOption) {
            standardOption.classList.add('selected');
        }
        
        renderIngredients();
        showSuccessMessage('Reset to defaults successfully!');
    }
};

window.saveSettings = function() {
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    button.innerHTML = '💾 Saving...';
    
    setTimeout(function() {
        button.style.transform = '';
        button.innerHTML = '💾 Save Settings';
        showSuccessMessage('Settings saved to your browser!');
    }, 800);
};

// Show success message
function showSuccessMessage(message) {
    if (!successMessage) return;
    
    successMessage.textContent = `✨ ${message}`;
    successMessage.style.display = 'block';
    
    setTimeout(function() {
        successMessage.style.display = 'none';
    }, 3000);
}

// Interactive Elements
function addInteractiveElements() {
    // Add bounce animation to ingredient icons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ingredient-icon')) {
            e.target.style.animation = 'none';
            setTimeout(function() {
                e.target.style.animation = 'bounce 0.5s ease';
            }, 10);
        }
    });

    // Add hover effects to cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.ingredient-card')) {
            const card = e.target.closest('.ingredient-card');
            card.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.ingredient-card')) {
            const card = e.target.closest('.ingredient-card');
            card.style.transform = '';
        }
    });
}