// Debug function to check if JavaScript is loading
console.log('✅ convert.js loaded successfully!');

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkModeIcon = darkModeToggle?.querySelector('i');

// Check if elements exist
if (!darkModeToggle) {
    console.error('❌ darkModeToggle element not found!');
}

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    if (darkModeIcon) darkModeIcon.classList.replace('fa-moon','fa-sun');
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            if (darkModeIcon) darkModeIcon.classList.replace('fa-moon','fa-sun');
            localStorage.setItem('theme','dark');
        } else {
            if (darkModeIcon) darkModeIcon.classList.replace('fa-sun','fa-moon');
            localStorage.setItem('theme','light');
        }
    });
}

// Mobile nav with safety checks
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    const toggleNav = () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', (!expanded).toString());
    };
    
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleNav(); });
    hamburger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); }});
    
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
        navLinks.classList.remove('active'); 
        hamburger.classList.remove('active'); 
        hamburger.setAttribute('aria-expanded','false');
    }));
    
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active'); 
            hamburger.classList.remove('active'); 
            hamburger.setAttribute('aria-expanded','false');
        }
    });
}

// Input Method Toggle
function setupInputMethods() {
    const methodBtns = document.querySelectorAll('.method-btn');
    const methodContents = document.querySelectorAll('.input-method-content');
    
    if (methodBtns.length === 0) {
        console.error('❌ method-btn elements not found!');
        return;
    }
    
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.dataset.method;
            
            // Update active button
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding content
            methodContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${method}-input`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// File upload
function handleFileUpload(event){
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { 
        const recipeInput = document.getElementById('recipeInput');
        if (recipeInput) {
            recipeInput.value = e.target.result; 
            // Switch to text input method after upload
            const textMethodBtn = document.querySelector('[data-method="text"]');
            if (textMethodBtn) textMethodBtn.click();
        }
    };
    reader.readAsText(file);
}

// Ingredient emojis
const ingredientEmojis = {
    'flour':'🌾', 'sugar':'🍯', 'butter':'🧈', 'egg':'🥚', 'milk':'🥛', 
    'vanilla':'🌿', 'baking powder':'⚡', 'salt':'🧂', 'chocolate':'🍫', 
    'cocoa':'🍫', 'oil':'🫒', 'honey':'🍯', 'cream':'🥛', 'cheese':'🧀', 
    'nuts':'🥜', 'fruit':'🍓', 'lemon':'🍋', 'orange':'🍊', 'cinnamon':'🌿',
    'default':'🥄'
};

function getIngredientEmoji(ing){
    if (!ing) return ingredientEmojis.default;
    const lower = ing.toLowerCase();
    for (const [key, emoji] of Object.entries(ingredientEmojis)) {
        if (lower.includes(key)) return emoji;
    }
    return ingredientEmojis.default;
}

// Mock AI Conversion
let currentUnit = 'metric';
let convertedData = [];

async function convertRecipe(){
    console.log('🔄 Convert button clicked!');
    
    const recipeInput = document.getElementById('recipeInput');
    if (!recipeInput) {
        console.error('❌ recipeInput element not found!');
        showWarning('Recipe input field not found!');
        return;
    }
    
    const recipeText = recipeInput.value.trim();
    if (!recipeText){ 
        showWarning('Please enter a recipe to convert!'); 
        return; 
    }
    
    console.log('📝 Recipe text:', recipeText);
    setLoading(true);
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock AI response
        const mockResponse = generateMockConversion(recipeText);
        convertedData = mockResponse.ingredients;
        
        console.log('✅ Conversion successful:', convertedData);
        displayResults(convertedData);
        updateResultsSummary(convertedData);
        
        if (mockResponse.warnings && mockResponse.warnings.length) {
            showWarning(mockResponse.warnings.join('\n'));
        }
        
    } catch(err) {
        console.error('❌ Conversion error:', err);
        showWarning('Sorry, there was an error converting your recipe. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Mock AI conversion logic
function generateMockConversion(recipeText) {
    const lines = recipeText.split('\n').filter(line => line.trim());
    const ingredients = [];
    const warnings = [];
    
    const conversionRates = {
        'cup': { 'flour': 120, 'sugar': 200, 'brown sugar': 220, 'butter': 225, 'milk': 240 },
        'tbsp': { 'default': 15 },
        'tsp': { 'default': 5 },
        'pound': { 'default': 450 },
        'oz': { 'default': 28 }
    };
    
    lines.forEach(line => {
        const cleanLine = line.trim();
        if (cleanLine && /(\d+\s*\/?\s*\d*|\d+)\s*(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|pound|pounds|oz|ounce|ounces)/i.test(cleanLine)) {
            
            const quantityMatch = cleanLine.match(/(\d+\s*\/?\s*\d*|\d+)/);
            const unitMatch = cleanLine.match(/(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|pound|pounds|oz|ounce|ounces)/i);
            const ingredientText = cleanLine.replace(quantityMatch[0], '').replace(unitMatch[0], '').trim();
            
            if (quantityMatch && unitMatch) {
                let quantity = eval(quantityMatch[0].replace(/\s+/g, ''));
                const unit = unitMatch[0].toLowerCase();
                let normalizedUnit = unit;
                
                if (unit.includes('cup')) normalizedUnit = 'cup';
                else if (unit.includes('tbsp')) normalizedUnit = 'tbsp';
                else if (unit.includes('tsp')) normalizedUnit = 'tsp';
                else if (unit.includes('pound')) normalizedUnit = 'pound';
                else if (unit.includes('oz')) normalizedUnit = 'oz';
                
                let grams = 0;
                let notes = 'Standard conversion';
                
                if (conversionRates[normalizedUnit]) {
                    let foundSpecific = false;
                    for (const [ingKey, rate] of Object.entries(conversionRates[normalizedUnit])) {
                        if (ingKey !== 'default' && ingredientText.toLowerCase().includes(ingKey)) {
                            grams = Math.round(quantity * rate);
                            notes = `Specific ${ingKey} conversion`;
                            foundSpecific = true;
                            break;
                        }
                    }
                    
                    if (!foundSpecific && conversionRates[normalizedUnit].default) {
                        grams = Math.round(quantity * conversionRates[normalizedUnit].default);
                        notes = 'General conversion';
                    }
                }
                
                if (grams > 0) {
                    ingredients.push({
                        ingredient: ingredientText || 'Unknown ingredient',
                        original: `${quantityMatch[0]} ${unitMatch[0]}`,
                        grams: grams,
                        notes: notes
                    });
                }
            }
        }
    });
    
    if (ingredients.length === 0) {
        ingredients.push(
            { ingredient: 'All-purpose flour', original: '2 cups', grams: 240, notes: 'Sifted measurement' },
            { ingredient: 'Granulated sugar', original: '1 cup', grams: 200, notes: 'Standard conversion' },
            { ingredient: 'Butter', original: '1/2 cup', grams: 113, notes: 'Unsalted' },
            { ingredient: 'Large eggs', original: '2 eggs', grams: 100, notes: 'Approximate weight' }
        );
        warnings.push('Used example conversion - enter your actual recipe for accurate results');
    }
    
    return { ingredients, warnings };
}

// Display Results
function displayResults(items){
    console.log('📊 Displaying results:', items);
    
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    
    if (!resultsSection || !resultsBody) {
        console.error('❌ Results section elements not found!');
        return;
    }
    
    if (items.length === 0) {
        resultsBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">
                    <i class="fas fa-calculator"></i>
                    <p>Your converted ingredients will appear here</p>
                </td>
            </tr>
        `;
        resultsSection.style.display = 'none';
        return;
    }
    
    resultsBody.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'ingredient-row';
        const emoji = getIngredientEmoji(item.ingredient);
        row.innerHTML = `
            <td><span class="ingredient-icon">${emoji}</span>${item.ingredient}</td>
            <td>${item.original}</td>
            <td><strong>${item.grams}g</strong></td>
            <td><small>${item.notes || 'Standard'}</small></td>`;
        resultsBody.appendChild(row);
    });
    
    resultsSection.style.display = 'block';
    setTimeout(() => {
        resultsSection.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 100);
}

// Update Results Summary
function updateResultsSummary(items) {
    const totalEl = document.getElementById('totalIngredients');
    const convertedEl = document.getElementById('convertedCount');
    const accuracyEl = document.getElementById('accuracyRate');
    
    if (totalEl) totalEl.textContent = items.length;
    if (convertedEl) convertedEl.textContent = items.length;
    if (accuracyEl) accuracyEl.textContent = '95%';
}

// Toggle Units
function toggleUnits(unit){
    currentUnit = unit;
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.unit === unit) {
            btn.classList.add('active');
        }
    });
    
    if (convertedData.length) {
        displayResults(convertedData);
    }
}

// Set Loading State
function setLoading(isLoading){
    const button = document.querySelector('.convert-btn');
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    
    if (!button) {
        console.error('❌ Convert button not found!');
        return;
    }
    
    if (isLoading){ 
        button.disabled = true; 
        if (spinner) spinner.style.display = 'inline-block'; 
        if (buttonText) buttonText.textContent = 'Converting...'; 
    } else { 
        button.disabled = false; 
        if (spinner) spinner.style.display = 'none'; 
        if (buttonText) buttonText.textContent = 'Convert with AI'; 
    }
}

// Warning functions
function showWarning(message){
    console.log('⚠️ Warning:', message);
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('warningPopup');
    const messageEl = document.getElementById('warningMessage');
    
    if (overlay) overlay.style.display = 'block';
    if (popup) popup.style.display = 'block';
    if (messageEl) messageEl.textContent = message;
}

function closeWarning(){
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('warningPopup');
    
    if (overlay) overlay.style.display = 'none';
    if (popup) popup.style.display = 'none';
}

// Export and Copy Functions
function exportResults() {
    if (convertedData.length === 0) {
        showWarning('No results to export! Convert a recipe first.');
        return;
    }
    
    let csvContent = "Ingredient,Original Measurement,Grams,Notes\n";
    convertedData.forEach(item => {
        csvContent += `"${item.ingredient}","${item.original}",${item.grams},"${item.notes}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipe-conversion.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function copyResults() {
    if (convertedData.length === 0) {
        showWarning('No results to copy! Convert a recipe first.');
        return;
    }
    
    let textContent = "Recipe Conversion Results:\n\n";
    convertedData.forEach(item => {
        textContent += `${item.ingredient}: ${item.original} → ${item.grams}g (${item.notes})\n`;
    });
    
    navigator.clipboard.writeText(textContent).then(() => {
        const copyBtn = document.querySelector('[onclick="copyResults()"]');
        if (copyBtn) {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalHtml;
            }, 2000);
        }
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
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
}

// Top to Bottom Button
const ToptobackBtn = document.getElementById("Toptoback");
if (ToptobackBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY < 100) {
            ToptobackBtn.classList.add("show");
        } else {
            ToptobackBtn.classList.remove("show");
        }
    });
    ToptobackBtn.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded - initializing app...');
    
    // Initialize input methods
    setupInputMethods();
    
    // Set active navigation link
    setActiveNavigation();
    
    // Add animation to cards
    const cards = document.querySelectorAll('.input-card, .results-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });
    
    // Add keyframes for animation
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(style);
    
    console.log('✅ App initialized successfully!');
});

// Function to set active navigation link
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

// Make functions globally available
window.toggleUnits = toggleUnits;
window.exportResults = exportResults;
window.copyResults = copyResults;
window.closeWarning = closeWarning;
window.handleFileUpload = handleFileUpload;
window.convertRecipe = convertRecipe;

console.log('✅ All functions exported to global scope!');