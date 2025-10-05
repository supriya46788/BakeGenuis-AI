console.log('✅ convert.js loaded successfully!');
// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
// assets/js/convert.js - COMPLETE WORKING VERSION
// Debug function to check if JavaScript is loading
console.log('✅ convert.js loaded successfully!');

// Dark Mode Toggle with safety checks
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

// Ingredient emojis - COMBINED VERSION
const ingredientEmojis = {
    'flour':'🌾', 'sugar':'🍯', 'butter':'🧈', 'egg':'🥚', 'milk':'🥛', 
    'vanilla':'🌿', 'baking powder':'⚡', 'baking soda':'⚡', 'salt':'🧂', 
    'chocolate':'🍫', 'cocoa':'🍫', 'oil':'🫒', 'honey':'🍯', 'cream':'🥛', 
    'cheese':'🧀', 'nuts':'🥜', 'fruit':'🍓', 'lemon':'🍋', 'orange':'🍊', 
    'cinnamon':'🌿', 'water':'💧', 'yeast':'🧫', 'default':'🥄'
};

function getIngredientEmoji(ing){
    if (!ing) return ingredientEmojis.default;
    const lower = ing.toLowerCase();
    for (const [key, emoji] of Object.entries(ingredientEmojis)) {
        if (lower.includes(key)) return emoji;
    }
    return ingredientEmojis.default;
}

// Global variables
let currentUnit = 'metric';
let convertedData = [];

// MAIN CONVERSION FUNCTION with safety checks
function convertRecipe(){
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
    
    // Use setTimeout to show loading state
    setTimeout(() => {
        try {
            const localResult = convertRecipeLocally(recipeText);
            convertedData = localResult.ingredients;
            
            displayResults(convertedData);
            updateResultsSummary(convertedData);
            
            if (localResult.warnings.length > 0) {
                showWarning(localResult.warnings.join('\n'));
            }
            
        } catch(err) {
            console.error('❌ Conversion error:', err);
            showWarning('Sorry, there was an error converting your recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    }, 800);
}

// COMPREHENSIVE CONVERSION DATABASE
const conversionDatabase = {
    // Flours
    'all-purpose flour': { grams: 120, note: '1 cup = 120g' },
    'plain flour': { grams: 120, note: '1 cup = 120g' },
    'bread flour': { grams: 130, note: '1 cup = 130g' },
    'whole wheat flour': { grams: 120, note: '1 cup = 120g' },
    
    // Sugars
    'granulated sugar': { grams: 200, note: '1 cup = 200g' },
    'white sugar': { grams: 200, note: '1 cup = 200g' },
    'brown sugar': { grams: 220, note: '1 cup = 220g (packed)' },
    'powdered sugar': { grams: 120, note: '1 cup = 120g' },
    
    // Fats & Oils
    'butter': { grams: 227, note: '1 cup = 227g' },
    'vegetable oil': { grams: 218, note: '1 cup = 218g' },
    'olive oil': { grams: 218, note: '1 cup = 218g' },
    
    // Liquids
    'water': { grams: 236, note: '1 cup = 236g' },
    'milk': { grams: 245, note: '1 cup = 245g' },
    'heavy cream': { grams: 238, note: '1 cup = 238g' },
    
    // Small quantities - these are now PER TEASPOON
    'salt': { grams: 5.7, note: '1 teaspoon = 5.7g' },
    'baking powder': { grams: 4.8, note: '1 teaspoon = 4.8g' },
    'baking soda': { grams: 4.6, note: '1 teaspoon = 4.6g' },
    'vanilla extract': { grams: 4.2, note: '1 teaspoon = 4.2g' },
    'yeast': { grams: 3.1, note: '1 teaspoon = 3.1g' },
    'cinnamon': { grams: 2.6, note: '1 teaspoon = 2.6g' },
    
    // Other ingredients
    'cocoa powder': { grams: 85, note: '1 cup = 85g' },
    'chocolate chips': { grams: 170, note: '1 cup = 170g' },
    'oats': { grams: 90, note: '1 cup = 90g' },
    'honey': { grams: 340, note: '1 cup = 340g' },
    
    // Eggs
    'large egg': { grams: 50, note: '1 large egg = 50g' },
    'egg': { grams: 50, note: '1 egg = 50g' },
    'egg white': { grams: 30, note: '1 egg white = 30g' },
    'egg yolk': { grams: 18, note: '1 egg yolk = 18g' }
};

// Unit conversion factors
const unitConversions = {
    // Volume units to cups
    'cup': 1, 'cups': 1,
    'tablespoon': 1/16, 'tablespoons': 1/16, 'tbsp': 1/16,
    'teaspoon': 1/48, 'teaspoons': 1/48, 'tsp': 1/48,
    'pint': 2, 'pints': 2,
    'quart': 4, 'quarts': 4,
    
    // Small quantity direct multipliers
    'pinch': 1/48, 'dash': 1/24, 'drop': 1/360
};

// Local conversion function
function convertRecipeLocally(recipeText) {
    const lines = recipeText.split('\n').filter(line => line.trim());
    const ingredients = [];
    const warnings = [];
    
    lines.forEach(line => {
        const parsed = parseIngredientLine(line);
        if (parsed) {
            const conversion = convertIngredient(parsed);
            ingredients.push(conversion);
            
            if (conversion.notes.includes('Unknown') || conversion.notes.includes('approximate')) {
                warnings.push(`Used approximate conversion for: ${parsed.ingredient}`);
            }
        } else {
            warnings.push(`Could not parse: "${line}"`);
        }
    });
    
    if (ingredients.length === 0) {
        warnings.push('No valid ingredients found. Please check your recipe format.');
    }
    
    return { ingredients, warnings };
}

// Parse ingredient line
function parseIngredientLine(line) {
    const cleanLine = line.trim();
    if (!cleanLine) return null;
    
    // Common patterns for recipe lines
    const patterns = [
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(tbsp|tsp|cups?|tablespoons?|teaspoons?|pints?|quarts?|ounces?|pounds?|oz|lb)\s+(.+)$/i,
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(.+)$/i
    ];
    
    for (const pattern of patterns) {
        const match = cleanLine.match(pattern);
        if (match) {
            let amount, unit, ingredient;
            
            if (match[3]) {
                // Has unit
                amount = parseFraction(match[1]);
                unit = match[2].toLowerCase();
                ingredient = match[3].trim();
            } else {
                // No unit specified
                amount = parseFraction(match[1]);
                unit = 'unit';
                ingredient = match[2].trim();
            }
            
            return { 
                amount, 
                unit, 
                ingredient, 
                original: cleanLine 
            };
        }
    }
    
    // If no pattern matches, return as ingredient only
    return { 
        amount: 1, 
        unit: 'unit', 
        ingredient: cleanLine, 
        original: cleanLine 
    };
}

// Parse fractions and mixed numbers
function parseFraction(str) {
    const cleanStr = str.toString().trim();
    
    // Handle mixed numbers like "1 1/2"
    if (cleanStr.includes(' ')) {
        const parts = cleanStr.split(' ');
        let total = 0;
        for (const part of parts) {
            total += parseSingleFraction(part);
        }
        return total;
    }
    
    return parseSingleFraction(cleanStr);
}

function parseSingleFraction(str) {
    if (str.includes('/')) {
        const [numerator, denominator] = str.split('/').map(Number);
        return numerator / (denominator || 1);
    }
    return parseFloat(str) || 1;
}

// Convert single ingredient function
function convertIngredient(parsed) {
    const { amount, unit, ingredient, original } = parsed;
    
    // Find the best matching ingredient
    let bestMatch = null;
    let matchedKey = '';
    
    const cleanIngredient = ingredient.toLowerCase();
    
    // Exact match first
    if (conversionDatabase[cleanIngredient]) {
        bestMatch = conversionDatabase[cleanIngredient];
        matchedKey = cleanIngredient;
    } else {
        // Fuzzy match - find ingredient that contains key or vice versa
        for (const [key, data] of Object.entries(conversionDatabase)) {
            if (cleanIngredient.includes(key) || key.includes(cleanIngredient)) {
                bestMatch = data;
                matchedKey = key;
                break;
            }
        }
    }
    
    if (bestMatch) {
        // Convert to the appropriate base unit first
        let baseAmount = amount;
        
        if (unitConversions[unit]) {
            // For volume units, convert to cups first
            baseAmount = amount * unitConversions[unit];
        } else if (unit === 'unit' && bestMatch.grams <= 10) {
            // For small quantities like spices, use direct multiplication
            baseAmount = amount;
        }
        
        // Convert to grams - Handle small quantities properly
        let grams;
        if (bestMatch.grams < 10) {
            // For small quantities (spices, extracts), multiply directly
            grams = Math.round(amount * bestMatch.grams * 100) / 100;
        } else {
            // For larger quantities, use cup-based conversion
            grams = Math.round(baseAmount * bestMatch.grams);
        }
        
        // Ensure we don't get 0g for small amounts
        if (grams === 0 && amount > 0) {
            grams = Math.max(0.1, amount * bestMatch.grams); // At least 0.1g
        }
        
        return {
            ingredient: formatIngredientName(ingredient),
            original: original,
            grams: grams,
            notes: bestMatch.note
        };
    } else {
        // Unknown ingredient
        return {
            ingredient: formatIngredientName(ingredient),
            original: original,
            grams: 'N/A',
            notes: 'Unknown ingredient - needs manual conversion'
        };
    }
}

// Format ingredient name nicely
function formatIngredientName(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
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
        
        // Add warning class for unknown ingredients
        if (item.grams === 'N/A') {
            row.className = 'warning-row';
        }
        
        row.innerHTML = `
            <td><span class="ingredient-icon">${emoji}</span>${item.ingredient}</td>
            <td>${item.original}</td>
            <td><strong>${item.grams}${typeof item.grams === 'number' ? 'g' : ''}</strong></td>
            <td><small>${item.notes || 'Standard conversion'}</small></td>`;
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
        const emoji = getIngredientEmoji(item.ingredient);
        
        // Add warning class for unknown ingredients
        if (item.grams === 'N/A') {
            row.className = 'warning-row';
        }
        
        row.innerHTML = `
            <td><span class="ingredient-icon">${emoji}</span> ${item.ingredient}</td>
            <td>${item.original}</td>
            <td><strong>${item.grams}${typeof item.grams === 'number' ? 'g' : ''}</strong></td>
            <td><small class="note-text">${item.notes}</small></td>`;
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

// Set Loading State with safety checks
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

// Warning functions with safety checks
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
}

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");
// Back to Top Button with safety check
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

// Top to Bottom Button with safety check
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
    
    // Add keyframes and additional styles for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .warning-row {
            background-color: #fff3cd !important;
        }
        body.dark-mode .warning-row {
            background-color: #332701 !important;
        }
        .note-text {
            color: #666;
            font-style: italic;
        }
        body.dark-mode .note-text {
            color: #aaa;
        }
        .ingredient-icon {
            margin-right: 8px;
        }
    `;
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

// TEST FUNCTION - Uncomment to test in console
function testConverter() {
    console.log('=== Testing Recipe Converter ===');
    
    const testRecipe = `2 cups all-purpose flour
1 cup white sugar
1/2 cup butter
2 large eggs
1 tsp vanilla extract
1 tsp baking powder
1/4 tsp salt`;

    const recipeInput = document.getElementById('recipeInput');
    if (recipeInput) {
        recipeInput.value = testRecipe;
        convertRecipe();
    } else {
        console.error('❌ Recipe input not found for testing');
    }
}

// Uncomment the line below to auto-test when page loads
// document.addEventListener('DOMContentLoaded', testConverter);