// assets/js/convert.js - COMPLETE WORKING VERSION

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkModeIcon = darkModeToggle.querySelector('i');

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  darkModeIcon.classList.replace('fa-moon','fa-sun');
}

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    darkModeIcon.classList.replace('fa-moon','fa-sun');
    localStorage.setItem('theme','dark');
  } else {
    darkModeIcon.classList.replace('fa-sun','fa-moon');
    localStorage.setItem('theme','light');
  }
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const toggleNav = () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', (!expanded).toString());
};
hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleNav(); });
hamburger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); }});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('active'); hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false');
}));
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('active') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('active'); hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false');
  }
});

// File upload
function handleFileUpload(event){
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => { 
    document.getElementById('recipeInput').value = e.target.result; 
  };
  reader.readAsText(file);
}
window.handleFileUpload = handleFileUpload;

// Ingredient emojis
const ingredientEmojis = {
  'flour':'🌾','sugar':'🍯','butter':'🧈','egg':'🥚','milk':'🥛','vanilla':'🌿',
  'baking powder':'⚡','baking soda':'⚡','salt':'🧂','chocolate':'🍫','cocoa':'🍫',
  'oil':'🫒','honey':'🍯','cream':'🥛','cheese':'🧀','nuts':'🥜','fruit':'🍓',
  'lemon':'🍋','orange':'🍊','cinnamon':'🌿','water':'💧','yeast':'🧫','default':'🥄'
};

function getIngredientEmoji(ing){
  const lower = ing.toLowerCase();
  for (const [key, emoji] of Object.entries(ingredientEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return ingredientEmojis.default;
}

// UPDATED: Comprehensive conversion database with fixed small quantities
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
    
    // FIXED: Small quantities - these are now PER TEASPOON
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
// UPDATED: Unit conversion factors with better small quantity handling
const unitConversions = {
    // Volume units to cups
    'cup': 1, 'cups': 1,
    'tablespoon': 1/16, 'tablespoons': 1/16, 'tbsp': 1/16,
    'teaspoon': 1/48, 'teaspoons': 1/48, 'tsp': 1/48,
    'pint': 2, 'pints': 2,
    'quart': 4, 'quarts': 4,
    
    // Small quantity direct multipliers (for ingredients under 10g per cup)
    'pinch': 1/48, 'dash': 1/24, 'drop': 1/360
};
// Global variables
let currentUnit = 'metric';
let convertedData = [];

// MAIN CONVERSION FUNCTION
function convertRecipe(){
  const recipeText = document.getElementById('recipeInput').value.trim();
  
  if (!recipeText) { 
    showWarning('Please enter a recipe to convert!'); 
    return; 
  }
  
  setLoading(true);
  
  // Use setTimeout to show loading state
  setTimeout(() => {
    try {
      const localResult = convertRecipeLocally(recipeText);
      convertedData = localResult.ingredients;
      
      displayResults(convertedData);
      
      if (localResult.warnings.length > 0) {
        showWarning(localResult.warnings.join('\n'));
      }
      
    } catch(err) {
      console.error('Conversion error:', err);
      showWarning('Sorry, there was an error. Please check your recipe format and try again.');
    } finally {
      setLoading(false);
    }
  }, 800);
}

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

// Parse ingredient line - IMPROVED VERSION
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

// FIXED: Convert single ingredient function
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
        
        // Convert to grams - FIXED: Handle small quantities properly
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

// Display results in table
function displayResults(items) {
  const resultsSection = document.getElementById('resultsSection');
  const resultsBody = document.getElementById('resultsBody');
  
  resultsBody.innerHTML = '';
  
  if (items.length === 0) {
    resultsBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No ingredients found to convert</td></tr>';
    return;
  }
  
  items.forEach(item => {
    const row = document.createElement('tr');
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
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle between metric and imperial
// Enhanced unit conversion system
const unitSystems = {
    metric: {
        weight: 'g',
        volume: 'ml',
        smallWeight: 'g',
        temperature: '°C'
    },
    imperial: {
        weight: 'oz',
        volume: 'cups',
        smallWeight: 'tsp',
        temperature: '°F'
    }
};

// Conversion factors for common ingredients
const imperialConversions = {
    // Weight conversions (grams to ounces)
    'all-purpose flour': { factor: 0.035274, unit: 'oz' },
    'plain flour': { factor: 0.035274, unit: 'oz' },
    'bread flour': { factor: 0.035274, unit: 'oz' },
    'whole wheat flour': { factor: 0.035274, unit: 'oz' },
    'granulated sugar': { factor: 0.035274, unit: 'oz' },
    'white sugar': { factor: 0.035274, unit: 'oz' },
    'brown sugar': { factor: 0.035274, unit: 'oz' },
    'powdered sugar': { factor: 0.035274, unit: 'oz' },
    'butter': { factor: 0.035274, unit: 'oz' },
    'milk': { factor: 0.033814, unit: 'cups' },
    'water': { factor: 0.033814, unit: 'cups' },
    'honey': { factor: 0.033814, unit: 'cups' },
    'oil': { factor: 0.033814, unit: 'cups' },
    
    // Small quantities (teaspoons/tablespoons)
    'salt': { factor: 0.202884, unit: 'tsp' },
    'baking powder': { factor: 0.202884, unit: 'tsp' },
    'baking soda': { factor: 0.202884, unit: 'tsp' },
    'vanilla extract': { factor: 0.202884, unit: 'tsp' },
    'yeast': { factor: 0.202884, unit: 'tsp' },
    
    // Default conversion
    'default': { factor: 0.035274, unit: 'oz' }
};

// Enhanced toggleUnits function with actual conversion
function toggleUnits(unitSystem) {
    currentUnit = unitSystem;
    
    // Update active button state
    document.querySelectorAll('.unit-toggle button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if (convertedData.length === 0) {
        return; // No data to convert
    }
    
    // Convert and display results based on selected unit system
    if (unitSystem === 'imperial') {
        displayImperialResults(convertedData);
    } else {
        displayResults(convertedData); // Metric (default)
    }
}

// Display results in imperial units
function displayImperialResults(items) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    
    resultsBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        const emoji = getIngredientEmoji(item.ingredient);
        
        let displayValue, displayUnit, displayNote;
        
        if (item.grams === 'N/A') {
            // Unknown ingredient
            displayValue = 'N/A';
            displayUnit = '';
            displayNote = item.notes;
        } else {
            // Convert to imperial
            const conversion = convertToImperial(item.ingredient, item.grams);
            displayValue = conversion.value;
            displayUnit = conversion.unit;
            displayNote = `≈ ${conversion.value} ${conversion.unit} (${item.grams}g)`;
        }
        
        // Add warning class for unknown ingredients
        if (item.grams === 'N/A') {
            row.className = 'warning-row';
        }
        
        row.innerHTML = `
            <td><span class="ingredient-icon">${emoji}</span> ${item.ingredient}</td>
            <td>${item.original}</td>
            <td><strong>${displayValue}${displayUnit ? ' ' + displayUnit : ''}</strong></td>
            <td><small class="note-text">${displayNote}</small></td>`;
        
        resultsBody.appendChild(row);
    });
    
    resultsSection.style.display = 'block';
}

// Convert grams to imperial units
function convertToImperial(ingredientName, grams) {
    if (grams === 'N/A') {
        return { value: 'N/A', unit: '', original: grams };
    }
    
    const cleanName = ingredientName.toLowerCase();
    let conversion = imperialConversions.default;
    
    // Find specific conversion for this ingredient
    for (const [key, conv] of Object.entries(imperialConversions)) {
        if (cleanName.includes(key)) {
            conversion = conv;
            break;
        }
    }
    
    // Special handling for specific ingredient types
    if (cleanName.includes('egg')) {
        // Eggs are typically counted, not converted
        return { 
            value: Math.round(grams / 50), // Approximate eggs
            unit: 'large eggs',
            original: grams
        };
    }
    
    const imperialValue = grams * conversion.factor;
    
    // Format based on quantity
    let displayValue, displayUnit;
    
    if (conversion.unit === 'tsp' || conversion.unit === 'tbsp') {
        // For small quantities, show in practical kitchen measurements
        if (imperialValue >= 3 && conversion.unit === 'tsp') {
            displayValue = (imperialValue / 3).toFixed(1); // Convert to tablespoons
            displayUnit = 'tbsp';
        } else if (imperialValue >= 16 && conversion.unit === 'tbsp') {
            displayValue = (imperialValue / 16).toFixed(2); // Convert to cups
            displayUnit = 'cups';
        } else if (imperialValue >= 1) {
            displayValue = imperialValue.toFixed(1);
            displayUnit = conversion.unit;
        } else {
            displayValue = imperialValue.toFixed(2);
            displayUnit = conversion.unit;
        }
    } else if (conversion.unit === 'cups') {
        // For volume measurements
        if (imperialValue >= 1) {
            displayValue = imperialValue.toFixed(2);
            displayUnit = 'cups';
        } else if (imperialValue >= 0.5) {
            displayValue = '1/2';
            displayUnit = 'cup';
        } else if (imperialValue >= 0.33) {
            displayValue = '1/3';
            displayUnit = 'cup';
        } else if (imperialValue >= 0.25) {
            displayValue = '1/4';
            displayUnit = 'cup';
        } else {
            displayValue = (imperialValue * 16).toFixed(1); // Convert to tablespoons
            displayUnit = 'tbsp';
        }
    } else {
        // For weight measurements (ounces)
        if (imperialValue >= 16) {
            displayValue = (imperialValue / 16).toFixed(2); // Convert to pounds
            displayUnit = 'lb';
        } else if (imperialValue >= 1) {
            displayValue = imperialValue.toFixed(1);
            displayUnit = 'oz';
        } else {
            displayValue = imperialValue.toFixed(2);
            displayUnit = 'oz';
        }
    }
    
    // Clean up display value
    displayValue = displayValue.replace('.0', '').replace('.00', '');
    
    return {
        value: displayValue,
        unit: displayUnit,
        original: grams
    };
}

// Also update the original displayResults function for metric to be consistent
function displayResults(items) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');
    
    resultsBody.innerHTML = '';
    
    if (items.length === 0) {
        resultsBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No ingredients found to convert</td></tr>';
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
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
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Loading state management
function setLoading(isLoading) {
  const button = document.querySelector('.convert-button');
  const spinner = document.getElementById('loadingSpinner');
  const buttonText = document.getElementById('buttonText');
  
  if (isLoading) { 
    button.disabled = true; 
    spinner.style.display = 'inline-block'; 
    buttonText.textContent = 'Converting...'; 
  } else { 
    button.disabled = false; 
    spinner.style.display = 'none'; 
    buttonText.textContent = 'Magically Convert ✨'; 
  }
}

// Warning popup functions
function showWarning(message) {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('warningPopup');
  const messageEl = document.getElementById('warningMessage');
  
  messageEl.textContent = message;
  overlay.style.display = 'block';
  popup.style.display = 'block';
}

function closeWarning() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('warningPopup').style.display = 'none';
}

// Back to Top Button
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

// Top to Bottom Button
const ToptobackBtn = document.getElementById("Toptoback");
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

// Entry animations
document.addEventListener('DOMContentLoaded', () => {
    const animateEls = document.querySelectorAll('.input-section, .results-section');
    animateEls.forEach((el, i) => {
        el.style.animation = `fadeInUp .6s ease forwards ${i * 0.2}s`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
        }
        .warning-row {
            background-color: #fff3cd !important;
        }
        .note-text {
            color: #666;
            font-style: italic;
        }
        .ingredient-icon {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
    
    // Set active navigation
    setActiveNavigation();
});

// Set active navigation link
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

// Make functions available globally
window.convertRecipe = convertRecipe;
window.toggleUnits = toggleUnits;
window.closeWarning = closeWarning;
window.handleFileUpload = handleFileUpload;

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

    document.getElementById('recipeInput').value = testRecipe;
    convertRecipe();
}

// Uncomment the line below to auto-test when page loads
// document.addEventListener('DOMContentLoaded', testConverter);