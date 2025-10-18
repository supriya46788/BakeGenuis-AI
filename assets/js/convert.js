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
    
     
    // Liquids - ADD ML CONVERSIONS
    'water': { grams: 236, note: '1 cup = 236g' },
    'milk': { grams: 245, note: '1 cup = 245g' },
    'heavy cream': { grams: 238, note: '1 cup = 238g' },
    'vanilla extract': { grams: 4.2, note: '1 teaspoon = 4.2g' },
    
    'ml water': { grams: 1, note: '1 ml = 1g' },
    'ml milk': { grams: 1.03, note: '1 ml = 1.03g' },
    'ml heavy cream': { grams: 1.04, note: '1 ml = 1.04g' },
    'ml vanilla': { grams: 0.84, note: '1 ml vanilla = 0.84g' },
    'ml vanilla extract': { grams: 0.84, note: '1 ml vanilla extract = 0.84g' },
    'ml oil': { grams: 0.92, note: '1 ml oil = 0.92g' },
    'ml vegetable oil': { grams: 0.92, note: '1 ml vegetable oil = 0.92g' },
    'ml olive oil': { grams: 0.92, note: '1 ml olive oil = 0.92g' },
    'ml honey': { grams: 1.42, note: '1 ml honey = 1.42g' },
    // Eggs
    'egg': { grams: 50, note: '1 egg = 50g' },
    'eggs': { grams: 50, note: '1 egg = 50g' },
    'large egg': { grams: 50, note: '1 large egg = 50g' },
    'large eggs': { grams: 50, note: '1 large egg = 50g' },
    'egg white': { grams: 30, note: '1 egg white = 30g' },
    'egg yolk': { grams: 18, note: '1 egg yolk = 18g' },
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
    'milliliter': 'direct', 'milliliters': 'direct', 'ml': 'direct',
    'liter': 4.226, 'liters': 4.226, 'l': 4.226,
    
    // Small quantity direct multipliers (for ingredients under 10g per cup)
    'pinch': 1/48, 'dash': 1/24, 'drop': 1/360
};
// Global variables
let currentUnit = 'metric';
let convertedData = [];

// MAIN CONVERSION FUNCTION
// COMPREHENSIVE RECIPE NORMALIZATION FUNCTION
function normalizeRecipeText(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';
    
    let text = rawText.trim();
    
    // Step 1: Handle different line endings and normalize to array of lines
    let lines = text.split(/\r\n|\n|\r/).map(line => line.trim()).filter(line => line);
    
    // Step 2: Process each line to extract structured ingredients
    const structuredIngredients = [];
    
    for (const line of lines) {
        const normalizedLine = normalizeIngredientLine(line);
        if (normalizedLine) {
            structuredIngredients.push(normalizedLine);
        }
    }
    
    return structuredIngredients.join('\n');
}
function normalizeIngredientLine(line) {
    if (!line || line.length < 2) return null;
    
    let cleanLine = line.trim();
    
    // ===== CHANGED: IMPROVED INSTRUCTION HANDLING =====
    
    // Separate instruction words into two categories:
    const mixingInstructions = [
        'mix', 'stir', 'combine', 'whisk', 'beat', 'blend', 'fold', 'knead',
        'add', 'pour', 'sprinkle', 'garnish'
    ];
    
    const cookingInstructions = [
        'bake', 'cook', 'heat', 'preheat', 'grease', 'line', 'sift',
        'spread', 'decorate', 'cool', 'chill', 'refrigerate',
        'microwave', 'boil', 'simmer', 'fry', 'roast', 'grill', 'broil'
    ];
    
    const firstWord = cleanLine.toLowerCase().split(' ')[0];
    
    // Skip only actual cooking instructions, not mixing instructions
    if (cookingInstructions.includes(firstWord)) {
        return null; // Skip cooking instruction lines
    }
    
    // If line starts with mixing instruction, try to extract ingredients from it
    if (mixingInstructions.includes(firstWord)) {
        // Remove the mixing instruction word and process the rest
        const remainingLine = cleanLine.substring(firstWord.length).trim();
        
        // If there's content left after removing instruction word, process it
        if (remainingLine.length > 2) {
            // Recursively process the remaining line
            return normalizeIngredientLine(remainingLine);
        } else {
            return null; // No meaningful content after instruction word
        }
    }

    // ===== ADD INSTRUCTION + QUANTITY PATTERNS HERE =====
       // Pattern for "word number unit ingredient" (e.g., "one and a half cup milk")
    const wordNumberPattern1 = /^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+and\s+(a\s+)?(half|quarter|third)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i;
    const wordNumberMatch1 = cleanLine.match(wordNumberPattern1);
    
    if (wordNumberMatch1) {
        const numberWord = wordNumberMatch1[1];
        const fractionWord = wordNumberMatch1[3];
        const unit = wordNumberMatch1[4].toLowerCase();
        const ingredient = wordNumberMatch1[5].trim();
        
        // Convert word numbers to digits
        const numberMap = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            'eleven': '11', 'twelve': '12'
        };
        const fractionMap = {
            'half': '1/2', 'quarter': '1/4', 'third': '1/3'
        };
        
        const number = numberMap[numberWord.toLowerCase()] || '1';
        const fraction = fractionMap[fractionWord.toLowerCase()] || '1/2';
        
        return `${number} ${fraction} ${unit} ${ingredient}`;
    }
    
    // Pattern for simple word numbers (e.g., "two cups milk")
    const wordNumberPattern2 = /^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i;
    const wordNumberMatch2 = cleanLine.match(wordNumberPattern2);
    
    if (wordNumberMatch2) {
        const numberWord = wordNumberMatch2[1];
        const unit = wordNumberMatch2[2].toLowerCase();
        const ingredient = wordNumberMatch2[3].trim();
        
        const numberMap = {
            'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            'eleven': '11', 'twelve': '12'
        };
        
        const number = numberMap[numberWord.toLowerCase()] || '1';
        return `${number} ${unit} ${ingredient}`;
    }
    // Pattern for "instruction quantity unit ingredient" (e.g., "mix 2 cups flour")
    const instructionPattern1 = /^(mix|stir|combine|whisk|beat|blend|add|pour)\s+(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i;
    const instructionMatch1 = cleanLine.match(instructionPattern1);
    
    if (instructionMatch1) {
        const amount = instructionMatch1[2];
        const unit = instructionMatch1[3].toLowerCase();
        const ingredient = instructionMatch1[4].trim();
        return `${amount} ${unit} ${ingredient}`;
    }
    
    // Pattern for "instruction quantity ingredient" (e.g., "add 3 eggs")
    const instructionPattern2 = /^(mix|stir|combine|whisk|beat|blend|add|pour)\s+(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(.+)$/i;
    const instructionMatch2 = cleanLine.match(instructionPattern2);
    
    if (instructionMatch2) {
        const amount = instructionMatch2[2];
        const ingredient = instructionMatch2[3].trim();
        return `${amount} ${ingredient}`;
    }

    // ===== RANGE HANDLING PATTERNS =====
    
    // PATTERN FOR RANGES: "number-number unit ingredient" (e.g., "1-2 cups flour")
    const rangePattern1 = /^(\d+)\s*-\s*(\d+)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i;
    const rangeMatch1 = cleanLine.match(rangePattern1);
    
    if (rangeMatch1) {
        const amount = rangeMatch1[1]; // Take first number
        const unit = rangeMatch1[3].toLowerCase();
        const ingredient = rangeMatch1[4].trim();
        return `${amount} ${unit} ${ingredient}`;
    }
    
    // PATTERN FOR RANGES: "number-number ingredient" (e.g., "2-3 eggs")
    const rangePattern2 = /^(\d+)\s*-\s*(\d+)\s+([a-zA-Z].+)$/i;
    const rangeMatch2 = cleanLine.match(rangePattern2);
    
    if (rangeMatch2) {
        const amount = rangeMatch2[1]; // Take first number
        const ingredient = rangeMatch2[3].trim();
        return `${amount} ${ingredient}`;
    }
    
    // PATTERN FOR RANGES: "fraction-number unit ingredient" (e.g., "1/2-1 cup sugar")
    const rangePattern3 = /^(\d+\/\d+)\s*-\s*(\d+)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i;
    const rangeMatch3 = cleanLine.match(rangePattern3);
    
    if (rangeMatch3) {
        const amount = rangeMatch3[1]; // Take first fraction
        const unit = rangeMatch3[3].toLowerCase();
        const ingredient = rangeMatch3[4].trim();
        return `${amount} ${unit} ${ingredient}`;
    }
    
    // PATTERN FOR RANGES: "fraction-fraction unit ingredient" (e.g., "1/4-1/2 tsp salt")
    const rangePattern4 = /^(\d+\/\d+)\s*-\s*(\d+\/\d+)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i;
    const rangeMatch4 = cleanLine.match(rangePattern4);
    
    if (rangeMatch4) {
        const amount = rangeMatch4[1]; // Take first fraction
        const unit = rangeMatch4[3].toLowerCase();
        const ingredient = rangeMatch4[4].trim();
        return `${amount} ${unit} ${ingredient}`;
    }
    // Pattern for "quantity large ingredient" (e.g., "2 large eggs")
    const largePattern = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+large\s+([a-zA-Z].+)$/i;
    const largeMatch = cleanLine.match(largePattern);
    
    if (largeMatch) {
        const amount = largeMatch[1];
        const ingredient = largeMatch[2].trim();
        return `${amount} ${ingredient}`;
    }
    
    
    // PATTERN 1: "ingredient quantity unit" format (e.g., "flour 2 tbsp sugar")
    const pattern1 = /^([a-zA-Z]+)\s+(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(tbsp|tsp|cup|cups|ml)\s+([a-zA-Z\s]*)(?:\s+.*)?$/i;
    const match1 = cleanLine.match(pattern1);
    
    if (match1) {
        const ingredient = match1[1].trim();
        const amount = match1[2];
        const unit = match1[3].toLowerCase();
        return `${amount} ${unit} ${ingredient}`;
    }
    
    // PATTERN 2: "ingredient quantity unit extract/essence" (e.g., "vanilla 2 tsp extract")
    const pattern2 = /^([a-zA-Z]+)\s+(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(tbsp|tsp|cup|cups|ml)\s+(extract|essence)(?:\s+.*)?$/i;
    const match2 = cleanLine.match(pattern2);
    
    if (match2) {
        const ingredient = match2[1].trim();
        const amount = match2[2];
        const unit = match2[3].toLowerCase();
        return `${amount} ${unit} ${ingredient} ${match2[4]}`;
    }
    
    // Step 1: Normalize number formats
    cleanLine = normalizeNumbers(cleanLine);
    
    // Step 2: Normalize units and abbreviations
    cleanLine = normalizeUnits(cleanLine);
    
    // Step 3: Extract quantity, unit, and ingredient
    const parsed = parseIngredientQuantity(cleanLine);
    
    return parsed;
}

function normalizeNumbers(line) {
    let result = line;
    
    console.log(`🔢 Normalizing numbers in: "${line}"`); // DEBUG
    
    // Map of number words to numbers/fractions
    const numberWords = {
        // Whole numbers
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
        'eleven': '11', 'twelve': '12', 'a dozen': '12', 'dozen': '12',
        
        // Fractions
        'half': '1/2', 'halves': '1/2', 'quarter': '1/4', 'quarters': '1/4',
        'third': '1/3', 'thirds': '1/3', 'fourth': '1/4', 'fourths': '1/4',
        'eighth': '1/8', 'eighths': '1/8',
        
        // Combined words
        'one half': '1/2', 'one quarter': '1/4', 'one third': '1/3', 'one fourth': '1/4',
        'three quarters': '3/4', 'three fourths': '3/4', 'two thirds': '2/3'
    };
    
    // Replace number words (case insensitive)
    for (const [word, replacement] of Object.entries(numberWords)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        result = result.replace(regex, replacement);
        if (result !== line) {
            console.log(`✅ Replaced "${word}" with "${replacement}": "${result}"`); // DEBUG
        }
    }
    
    // IMPROVED: Handle "and a half" patterns more comprehensively
    result = result.replace(/(\d+)\s+and\s+(a\s+)?half/gi, '$1 1/2');
    result = result.replace(/(\d+)\s+and\s+(a\s+)?quarter/gi, '$1 1/4');
    result = result.replace(/(\d+)\s+and\s+(a\s+)?third/gi, '$1 1/3');
    
    // Handle "one and a half" specifically
    result = result.replace(/\bone and a half\b/gi, '1 1/2');
    result = result.replace(/\btwo and a half\b/gi, '2 1/2');
    result = result.replace(/\bthree and a half\b/gi, '3 1/2');
    
    // Handle decimal fractions
    result = result.replace(/(\d+)\.5\b/g, '$1 1/2');
    result = result.replace(/(\d+)\.25\b/g, '$1 1/4');
    result = result.replace(/(\d+)\.75\b/g, '$1 3/4');
    result = result.replace(/(\d+)\.33\b/g, '$1 1/3');
    result = result.replace(/(\d+)\.67\b/g, '$1 2/3');
    
    console.log(`🔢 After normalization: "${result}"`); // DEBUG
    
    return result;
}

function normalizeUnits(line) {
    let result = line;
    
    // Comprehensive unit mapping
    const unitMap = {
        // Volume
        'tablespoon': 'tbsp', 'tablespoons': 'tbsp', 'tbs': 'tbsp', 'tbl': 'tbsp',
        'teaspoon': 'tsp', 'teaspoons': 'tsp', 
        'cup': 'cup', 'cups': 'cup', 'c': 'cup',
        'pint': 'pint', 'pints': 'pint', 'pt': 'pint',
        'quart': 'quart', 'quarts': 'quart', 'qt': 'quart',
        'gallon': 'gallon', 'gallons': 'gallon', 'gal': 'gallon',
        'milliliter': 'ml', 'milliliters': 'ml', 'millilitre': 'ml', 'millilitres': 'ml',
        'liter': 'l', 'liters': 'l', 'litre': 'l', 'litres': 'l',
        
        // Weight
        'ounce': 'oz', 'ounces': 'oz', 'ozs': 'oz',
        'pound': 'lb', 'pounds': 'lb', 'lbs': 'lb',
        'gram': 'g', 'grams': 'g', 'gramme': 'g', 'grammes': 'g',
        'kilogram': 'kg', 'kilograms': 'kg', 'kilo': 'kg', 'kilos': 'kg',
        
        // Small quantities
        'pinch': 'pinch', 'pinches': 'pinch',
        'dash': 'dash', 'dashes': 'dash',
        'drop': 'drop', 'drops': 'drop',
        'sprinkle': 'sprinkle'
    };
    
    // Replace units (case insensitive)
    for (const [unit, replacement] of Object.entries(unitMap)) {
        const regex = new RegExp(`\\b${unit}\\b`, 'gi');
        result = result.replace(regex, replacement);
    }
    
    // Handle common abbreviations without spaces
    result = result.replace(/(\d)([tT])([bspSP])/g, '$1 t$3'); // 2tsp -> 2 tsp
    result = result.replace(/(\d)([cC])(?!\w)/g, '$1 cup');    // 2c -> 2 cup
    
    return result;
}
function parseIngredientQuantity(line) {
    // Remove extra spaces and punctuation
    let cleanLine = line.replace(/[.,;:!?]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // REMOVED: Don't skip instruction words here - we already handle them in normalizeIngredientLine
    // The instruction detection above is causing "2 large eggs" to be skipped

    // Patterns to match different ingredient formats - IMPROVED
    const patterns = [
        // Format: "ingredient: quantity unit" (e.g., "Flour: 2 cups")
        /^([a-zA-Z\s]+):\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s*(tbsp|tsp|cup|cups|pint|quart|gallon|oz|lb|g|kg|ml|l)?$/i,
        
        // Format: "ingredient - quantity unit" (e.g., "Flour - 2 cups")
        /^([a-zA-Z\s]+)\s*-\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s*(tbsp|tsp|cup|cups|pint|quart|gallon|oz|lb|g|kg|ml|l)?$/i,
        
        // Format: "ingredient quantity unit" (e.g., "Flour 2 cups")
        /^([a-zA-Z\s]+)\s+(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(tbsp|tsp|cup|cups|pint|quart|gallon|oz|lb|g|kg|ml|l)$/i,
        
        // Format: "quantity unit ingredient" (e.g., "2 cups flour")
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(tbsp|tsp|cup|cups|pint|quart|gallon|oz|lb|g|kg|ml|l)\s+(.+)$/i,
        
        // Format: "quantity ingredient" (e.g., "2 eggs", "1/2 onion")
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(.+)$/i
    ];
        
    for (const pattern of patterns) {
        const match = cleanLine.match(pattern);
        if (match) {
            let amount, unit, ingredient;
            
            if (pattern.source.includes('^([a-zA-Z')) {
                // Formats where ingredient comes first
                ingredient = match[1].trim();
                amount = parseFraction(match[2]);
                unit = match[3] ? match[3].toLowerCase() : 'unit';
            } else {
                // Formats where quantity comes first
                amount = parseFraction(match[1]);
                unit = match[2] ? match[2].toLowerCase() : 'unit';
                ingredient = match[3] ? match[3].trim() : '';
            }
            
            // Clean up ingredient - remove extra spaces and common words
            ingredient = cleanIngredientName(ingredient);
            
            if (!ingredient || ingredient.trim().length < 2) {
                return null;
            }
            
            // Format the final string consistently
            if (unit === 'unit') {
                return `${amount} ${ingredient}`.trim();
            } else {
                return `${amount} ${unit} ${ingredient}`.trim();
            }
        }
    }
    
    // If no pattern matches but line looks like an ingredient, return as-is
    if (cleanLine.length > 2 && 
        !isInstructionLine(cleanLine)) {
        return cleanLine;
    }
    
    return null;
}

// Helper function to clean ingredient names - IMPROVED
function cleanIngredientName(ingredient) {
    if (!ingredient) return '';
    
    const wordsToRemove = [
        'mix', 'stir', 'combine', 'whisk', 'beat', 'blend', 'fold', 'knead',
        'add', 'pour', 'sprinkle', 'garnish', 'decorate', 'cool', 'chill',
        'well', 'until', 'smooth', 'creamy', 'fluffy', 'softened', 'melted',
        'divided', 'optional', 'to taste', 'as needed'
    ];
    
    let words = ingredient.split(/\s+/);
    let filteredWords = [];
    
    for (let word of words) {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
        if (!wordsToRemove.includes(cleanWord) && cleanWord.length > 1) {
            filteredWords.push(word);
        }
    }
    
    let result = filteredWords.join(' ').trim();
    
    // SPECIAL FIX: If we have multiple ingredients like "flour sugar", take only the first one
    if (result.split(' ').length > 1) {
        const commonIngredients = ['flour', 'sugar', 'butter', 'egg', 'vanilla', 'salt', 'baking', 'milk', 'water', 'oil', 'chocolate', 'extract'];
        const firstWord = result.split(' ')[0];
        const secondWord = result.split(' ')[1];
        
        // If first word is a common ingredient, use it
        if (commonIngredients.some(ing => firstWord.toLowerCase().includes(ing))) {
            result = firstWord;
        } 
        // If second word is a common ingredient and first isn't, use second
        else if (commonIngredients.some(ing => secondWord.toLowerCase().includes(ing))) {
            result = secondWord;
        }
    }
    
    return result;
}

// Helper function to check if a line is an instruction
function isInstructionLine(line) {
    const instructionIndicators = [
        'instruction', 'method', 'step', 'preheat', 'bake', 'cook', 'heat',
        'mix', 'stir', 'combine', 'whisk', 'beat', 'blend', 'fold', 'knead',
        'add', 'pour', 'sprinkle', 'garnish', 'decorate'
    ];
    
    const firstWords = line.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
    return instructionIndicators.some(indicator => firstWords.includes(indicator));
}



// NEW FUNCTION: Split multiple ingredients in one line
function splitMultipleIngredients(normalizedText) {
    const lines = normalizedText.split('\n');
    const result = [];
    
    for (const line of lines) {
        // Check if line contains multiple ingredients (has "and" or multiple quantity patterns)
        if (line.includes(' and ') || line.match(/\d+\s+\w+\s+[a-z]+\s+\d+\s+\w+\s+[a-z]+/i)) {
            // Simple splitting logic for now - you can enhance this
            const parts = line.split(/\s+and\s+|\s*,\s*|\s+or\s+/i);
            parts.forEach(part => {
                if (part.trim().length > 0) {
                    result.push(part.trim());
                }
            });
        } else {
            result.push(line);
        }
    }
    
    return result.join('\n');
}

// Update your normalizeRecipeText function to use this:
function normalizeRecipeText(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';
    
    let text = rawText.trim();
    
    // Step 1: Handle different line endings and normalize to array of lines
    let lines = text.split(/\r\n|\n|\r/).map(line => line.trim()).filter(line => line);
    
    // Step 2: Process each line to extract structured ingredients
    const structuredIngredients = [];
    
    for (const line of lines) {
        const normalizedLine = normalizeIngredientLine(line);
        if (normalizedLine) {
            structuredIngredients.push(normalizedLine);
        }
    }
    
    const result = structuredIngredients.join('\n');
    
    // Step 3: Split multiple ingredients in single lines
    return splitMultipleIngredients(result);
}
function convertRecipe(){
    const rawText = document.getElementById('recipeInput').value.trim();
    if (!rawText) { 
        showWarning('Please enter a recipe to convert!'); 
        return; 
    }

    // Use the new comprehensive normalization
    const recipeText = normalizeRecipeText(rawText);
  
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
    if (!cleanLine) {
        console.log(`❌ Empty line: "${line}"`);
        return null;
    }
    
    console.log(`🔍 Parsing: "${cleanLine}"`);
    
    // Common patterns for recipe lines - IMPROVED
    const patterns = [
        // Format: "mixed number unit ingredient" (e.g., "1 1/2 cups milk")
        /^(\d+\s+\d+\/\d+)\s+(cups?|tbsp|tsp|ml|oz|lb|g|kg)\s+(.+)$/i,
        
        // Format: "quantity unit ingredient" (e.g., "2 cups flour")
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(tbsp|tsp|cups?|tablespoons?|teaspoons?|pints?|quarts?|ounces?|pounds?|oz|lb|pinch|dash|drop)\s+(.+)$/i,
        
        // Format: "quantity ingredient" (e.g., "2 eggs", "1/2 onion")
        /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+)\s+(.+)$/i
    ];
    
    for (const pattern of patterns) {
        const match = cleanLine.match(pattern);
        if (match) {
            console.log(`✅ Pattern matched:`, match);
            
            let amount, unit, ingredient;
            
            if (match[3] && pattern.source.includes('mixed number')) {
                // Mixed number pattern (e.g., "1 1/2 cups milk")
                amount = parseFraction(match[1]);
                unit = match[2].toLowerCase();
                ingredient = match[3].trim();
            } else if (match[3]) {
                // Has unit and ingredient
                amount = parseFraction(match[1]);
                unit = match[2].toLowerCase();
                ingredient = match[3].trim();
            } else {
                // No unit specified
                amount = parseFraction(match[1]);
                unit = 'unit';
                ingredient = match[2].trim();
            }
            
            console.log(`📊 Parsed values: amount=${amount}, unit=${unit}, ingredient="${ingredient}"`);
            
            return { 
                amount, 
                unit, 
                ingredient, 
                original: cleanLine 
            };
        }
    }
    
    console.log(`❌ No pattern matched for: "${cleanLine}"`);
    
    // If no pattern matches, return as ingredient only
    return { 
        amount: 1, 
        unit: 'unit', 
        ingredient: cleanLine, 
        original: cleanLine 
    };
}
// Parse fractions and mixed numbers - IMPROVED
function parseFraction(str) {
    const cleanStr = str.toString().trim();
    console.log(`🔢 Parsing fraction: "${cleanStr}"`); // DEBUG
    
    // Handle mixed numbers like "1 1/2"
    if (cleanStr.includes(' ')) {
        const parts = cleanStr.split(' ');
        let total = 0;
        for (const part of parts) {
            total += parseSingleFraction(part);
        }
        console.log(`🔢 Mixed number result: ${total}`); // DEBUG
        return total;
    }
    
    const result = parseSingleFraction(cleanStr);
    console.log(`🔢 Single fraction result: ${result}`); // DEBUG
    return result;
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
    
    console.log(`🔍 Converting: "${cleanIngredient}"`); // DEBUG LINE
    
    // IMPROVED: Multiple matching strategies with priority
    const matchingStrategies = [
        // Strategy 1: Exact match
        () => {
            if (conversionDatabase[cleanIngredient]) {
                console.log(`✅ Exact match: "${cleanIngredient}"`); // DEBUG
                return { match: conversionDatabase[cleanIngredient], key: cleanIngredient };
            }
            return null;
        },
        
        // Strategy 2: Singular version (remove 's')
        () => {
            let singular = cleanIngredient;
            if (cleanIngredient.endsWith('s') && !cleanIngredient.endsWith('ss')) {
                singular = cleanIngredient.slice(0, -1);
            }
            if (conversionDatabase[singular]) {
                console.log(`✅ Singular match: "${singular}" from "${cleanIngredient}"`); // DEBUG
                return { match: conversionDatabase[singular], key: singular };
            }
            return null;
        },
        
        // Strategy 3: Database key is contained in ingredient (e.g., "egg" in "large eggs")
        () => {
            for (const [key, data] of Object.entries(conversionDatabase)) {
                if (cleanIngredient.includes(key) && key.length > 2) {
                    console.log(`✅ Contains match: "${cleanIngredient}" contains "${key}"`); // DEBUG
                    return { match: data, key: key };
                }
            }
            return null;
        },
        
        // Strategy 4: Ingredient is contained in database key
        () => {
            for (const [key, data] of Object.entries(conversionDatabase)) {
                if (key.includes(cleanIngredient) && cleanIngredient.length > 2) {
                    console.log(`✅ Reverse contains: "${key}" contains "${cleanIngredient}"`); // DEBUG
                    return { match: data, key: key };
                }
            }
            return null;
        },
        
        // Strategy 5: Word-based matching (for "large eggs" -> "egg")
        () => {
            const words = cleanIngredient.split(' ');
            for (const word of words) {
                if (word.length > 2 && conversionDatabase[word]) {
                    console.log(`✅ Word match: "${word}" from "${cleanIngredient}"`); // DEBUG
                    return { match: conversionDatabase[word], key: word };
                }
            }
            return null;
        }
    ];
    
    // Try each strategy in order
    for (const strategy of matchingStrategies) {
        const result = strategy();
        if (result) {
            bestMatch = result.match;
            matchedKey = result.key;
            break;
        }
    }
    
    if (bestMatch) {
        console.log(` Matched "${cleanIngredient}" to database key "${matchedKey}"`); // DEBUG
        
        // Convert to the appropriate base unit first
                // Convert to the appropriate base unit first
        let baseAmount = amount;
        
        if (unitConversions[unit]) {
            if (unitConversions[unit] === 'direct') {
                // For ML units, use direct multiplication (no cup conversion needed)
                baseAmount = amount;
                console.log(`⚖️ Using direct ML conversion for ${amount}${unit}`); // DEBUG
            } else {
                // For other volume units, convert to cups first
                baseAmount = amount * unitConversions[unit];
                console.log(`⚖️ Converted ${amount}${unit} to ${baseAmount} cups`); // DEBUG
            }
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
        console.log(`❌ No match found for: "${cleanIngredient}"`); // DEBUG
        
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



// COMPREHENSIVE TEST SUITE - ALL CASES
function runCompleteTestSuite() {
    console.log("=== COMPLETE RECIPE CONVERTER TEST SUITE ===\n");
    
    const testCases = [
        {
            name: "1. Standard format",
            input: `2 cups all-purpose flour
1 cup white sugar
1/2 cup butter
2 large eggs
1 tsp vanilla extract
1 tsp baking powder
1/4 tsp salt`,
            expected: "All ingredients should convert properly"
        },
        {
            name: "2. Problematic ingredient-first format",
            input: "flour 2 tbsp sugar mix well",
            expected: "Should convert to '2 tbsp flour' without ambiguous warning"
        },
        {
            name: "3. Range quantities",
            input: `1-2 cups flour
2-3 eggs
1/2-1 cup sugar
1/4-1/2 tsp salt`,
            expected: "Should take first number from ranges and convert"
        },
        {
            name: "4. Punctuation and special characters",
            input: `Sugar - 1 cup;
Butter, 1/2 cup.
Eggs: 2 large,
Vanilla extract - 1 tsp!`,
            expected: "Should handle punctuation and convert properly"
        },
        {
            name: "5. Instruction lines with ingredients",
            input: `mix 2 cups flour
combine 1 cup sugar and 1/2 cup butter
add 1 tsp vanilla last
stir in 3 eggs`,
            expected: "Should extract ingredients from mixing instructions"
        },
        {
            name: "6. Word numbers and fractions",
            input: `two cups flour
one half cup sugar
three tbsp butter
one teaspoon vanilla
quarter teaspoon salt
one and a half cups milk`,
            expected: "Should convert word numbers to digits/fractions"
        },
        {
            name: "7. ML conversions",
            input: `2.5 ml vanilla extract
250 ml milk
500 ml water
15 ml oil`,
            expected: "Should handle milliliter conversions"
        },
        {
            name: "8. Complex real recipe with instructions",
            input: `Chocolate Chip Cookies:
2 1/4 cups all-purpose flour
1 teaspoon baking soda
1 teaspoon salt
1 cup butter, softened
3/4 cup granulated sugar
3/4 cup packed brown sugar
1 teaspoon vanilla extract
2 large eggs
2 cups chocolate chips

Instructions:
Preheat oven to 375°F
Mix dry ingredients separately
Cream butter and sugars until fluffy`,
            expected: "Should extract only ingredients, skip cooking instructions"
        },
        {
            name: "9. No units (countable items)",
            input: `3 eggs
2 bananas
1 apple
1/2 lemon`,
            expected: "Should handle items without units"
        },
        {
            name: "10. Multiple ingredient formats mixed",
            input: `Flour: 2 cups
Sugar - 1 cup
Butter 1/2 cup
3 eggs
vanilla extract 1 tsp
chocolate 1/2 cup chips`,
            expected: "Should handle all different formats in one recipe"
        },
        {
            name: "11. Decimal numbers",
            input: `1.5 cups flour
0.5 cup sugar
2.5 ml vanilla
0.25 tsp salt`,
            expected: "Should handle decimal numbers"
        },
        {
            name: "12. Edge cases - plurals and extracts",
            input: `vanilla 2 tsp extract
chocolate 1/2 cup chips
brown sugars 1 cup packed
eggs 3 large`,
            expected: "Should handle ingredient-first patterns with extracts/plurals"
        },
        {
            name: "13. Cooking instructions (should be skipped)",
            input: `preheat oven to 350°F
bake for 30 minutes
grease the pan
cook until golden brown`,
            expected: "Should skip all cooking instructions"
        },
        {
            name: "14. Your original problematic case",
            input: `Sugar - 1 cup;
Butter, 1/2 cup.
Eggs: 2 large,
Vanilla extract - 1 tsp!
flour 2 tbsp sugar mix well`,
            expected: "All ingredients should convert without ambiguous warnings"
        }
    ];

    let totalTests = testCases.length;
    let passedTests = 0;
    let failedTests = 0;

    testCases.forEach((test, index) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`TEST ${index + 1}/${totalTests}: ${test.name}`);
        console.log(`${'='.repeat(60)}`);
        console.log('INPUT:');
        console.log(test.input);
        
        console.log('\nEXPECTED:', test.expected);
        
        try {
            // Set the test input
            document.getElementById('recipeInput').value = test.input;
            
            // Convert and check results
            convertRecipe();
            
            // Wait for conversion to complete
            setTimeout(() => {
                const resultsSection = document.getElementById('resultsSection');
                const warningPopup = document.getElementById('warningPopup');
                
                if (resultsSection.style.display !== 'none') {
                    console.log('✅ TEST PASSED - Conversion successful');
                    passedTests++;
                } else if (warningPopup.style.display !== 'none') {
                    const warningMsg = document.getElementById('warningMessage').textContent;
                    console.log('❌ TEST FAILED - Warning:', warningMsg);
                    failedTests++;
                } else {
                    console.log('❌ TEST FAILED - No results shown');
                    failedTests++;
                }
                
                // Show final results after last test
                if (index === testCases.length - 1) {
                    setTimeout(showFinalResults, 500);
                }
            }, 2000);
            
        } catch (error) {
            console.log('❌ TEST FAILED - Error:', error.message);
            failedTests++;
        }
    });

    function showFinalResults() {
        console.log(`\n${'='.repeat(60)}`);
        console.log('FINAL TEST RESULTS');
        console.log(`${'='.repeat(60)}`);
        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (failedTests === 0) {
            console.log('\n🎉 ALL TESTS PASSED! Your converter is working perfectly!');
        } else {
            console.log('\n🔧 Some tests failed. Check the failed cases above.');
        }
    }
}

// INDIVIDUAL TEST FUNCTION FOR SPECIFIC CASES
function testSpecificCase(testName, input) {
    console.log(`\n🔍 TESTING: ${testName}`);
    console.log('Input:', input);
    
    document.getElementById('recipeInput').value = input;
    convertRecipe();
    
    // Also show normalization details
    setTimeout(() => {
        console.log('Normalization details:');
        const normalized = normalizeRecipeText(input);
        console.log('Normalized output:');
        console.log(normalized);
        
        const lines = normalized.split('\n');
        lines.forEach((line, i) => {
            if (line.trim()) {
                console.log(`Line ${i + 1}: "${line}"`);
                const parsed = parseIngredientLine(line);
                console.log('Parsed:', parsed);
            }
        });
    }, 1000);
}

// QUICK TEST FOR KNOWN PROBLEMATIC CASES
function quickProblemTest() {
    console.log("🚨 QUICK TEST FOR KNOWN PROBLEMS");
    
    const problemCases = [
        { name: "flour 2 tbsp sugar", input: "flour 2 tbsp sugar mix well" },
        { name: "range quantities", input: "2-3 eggs" },
        { name: "instruction lines", input: "mix 2 cups flour" },
        { name: "punctuation", input: "Sugar - 1 cup;" },
        { name: "ML conversion", input: "2.5 ml vanilla" },
        { name: "ingredient-first", input: "vanilla 2 tsp extract" }
    ];
    
    problemCases.forEach(test => {
        testSpecificCase(test.name, test.input);
        
        // Add delay between tests
        setTimeout(() => {}, 1500);
    });
}

// Make functions available globally
window.runCompleteTestSuite = runCompleteTestSuite;
window.testSpecificCase = testSpecificCase;
window.quickProblemTest = quickProblemTest;

// COMPREHENSIVE DEBUG FUNCTION
function debugEggIssue() {
    console.log("=== COMPREHENSIVE EGG DEBUG ===");
    
    const testInput = `2 cups all-purpose flour
1 cup white sugar
1/2 cup butter
2 large eggs
1 tsp vanilla extract
1 tsp baking powder
1/4 tsp salt`;
    
    console.log("ORIGINAL INPUT:");
    console.log(testInput);
    
    console.log("\nSTEP 1: Normalize recipe text");
    const normalized = normalizeRecipeText(testInput);
    console.log("Normalized output:");
    console.log(normalized);
    
    console.log("\nSTEP 2: Parse each line");
    const lines = normalized.split('\n');
    lines.forEach((line, index) => {
        console.log(`\nLine ${index + 1}: "${line}"`);
        
        if (line.trim()) {
            const parsed = parseIngredientLine(line);
            console.log("Parsed:", parsed);
            
            if (parsed) {
                console.log("STEP 3: Convert ingredient");
                const converted = convertIngredient(parsed);
                console.log("Converted:", converted);
            } else {
                console.log("❌ Could not parse this line");
            }
        }
    });
    
    console.log("\nSTEP 4: Check database entries");
    console.log("Database has 'egg':", conversionDatabase['egg']);
    console.log("Database has 'eggs':", conversionDatabase['eggs']);
    console.log("Database has 'large egg':", conversionDatabase['large egg']);
    console.log("Database has 'large eggs':", conversionDatabase['large eggs']);
}

// Add to global scope
window.debugEggIssue = debugEggIssue;
// Uncomment the line below to auto-test when page loads
// document.addEventListener('DOMContentLoaded', testConverter);

function downloadResults() {
  const table = document.getElementById('resultsTable');
  let text = 'Ingredient\tOriginal\tGrams\tNotes\n';
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const line = Array.from(cells).map(cell => cell.innerText).join('\t');
    text += line + '\n';
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'converted_recipe.txt';
  link.click();
}
