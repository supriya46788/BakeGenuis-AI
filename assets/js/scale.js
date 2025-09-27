
// --- GLOBAL SCOPE: All logic and helpers ---
// Ingredient icons mapping (global)
const ingredientIcons = {
    'flour': '🌾',
    'sugar': '🍯',
    'butter': '🧈',
    'egg': '🥚',
    'milk': '🥛',
    'baking powder': '🥄',
    'baking soda': '🥄',
    'salt': '🧂',
    'vanilla': '🌿',
    'chocolate': '🍫',
    'cocoa': '🍫',
    'oil': '🫒',
    'honey': '🍯',
    'yeast': '🍞',
    'default': '🥄'
};

// Unit conversion data (grams) (global)
const unitConversions = {
    'cup': {
        'flour': 120,
        'sugar': 200,
        'butter': 225,
        'milk': 240,
        'oil': 240,
        'cocoa': 75,
        'default': 240
    },
    'tablespoon': {
        'flour': 8,
        'sugar': 12,
        'butter': 14,
        'oil': 14,
        'default': 15
    },
    'teaspoon': {
        'default': 5
    }
};

function getIngredientIcon(ingredient) {
    const normalizedIngredient = ingredient.toLowerCase();
    for (const [key, icon] of Object.entries(ingredientIcons)) {
        if (normalizedIngredient.includes(key)) {
            return icon;
        }
    }
    return ingredientIcons.default;
}

function parseIngredientLine(line) {
    // Enhanced regex to capture amount, unit, and ingredient
    const patterns = [
        /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(cups?|cup|tbsp|tablespoons?|tsp|teaspoons?|lbs?|pounds?|oz|ounces?|g|grams?|kg|kilograms?|ml|milliliters?|l|liters?)\s+(.+)$/i,
        /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(.+)$/i
    ];

    // Helper to parse fractions and mixed numbers (e.g., "1 1/2", "3/4", "2")
    function parseAmount(str) {
        str = str.trim();
        // Mixed number (e.g., "1 1/2")
        if (/^\d+ \d+\/\d+$/.test(str)) {
            const [whole, frac] = str.split(' ');
            const [num, denom] = frac.split('/');
            return parseInt(whole) + (parseInt(num) / parseInt(denom));
        }
        // Simple fraction (e.g., "1/2")
        if (/^\d+\/\d+$/.test(str)) {
            const [num, denom] = str.split('/');
            return parseInt(num) / parseInt(denom);
        }
        // Decimal or integer
        return parseFloat(str);
    }

    for (const pattern of patterns) {
        const match = line.trim().match(pattern);
        if (match) {
            if (match.length === 4) {
                return {
                    amount: parseAmount(match[1]),
                    unit: match[2].toLowerCase(),
                    ingredient: match[3].trim()
                };
            } else {
                return {
                    amount: parseAmount(match[1]),
                    unit: 'unit',
                    ingredient: match[2].trim()
                };
            }
        }
    }

    return {
        amount: 1,
        unit: 'unit',
        ingredient: line.trim()
    };
}

function correctIngredientTypos(ingredient) {
    // Add more corrections as needed
    const corrections = {
        'floor': 'flour',
        // Add more common typos here
    };
    let corrected = ingredient.toLowerCase().trim().replace(/\s+/g, ' ');
    Object.keys(corrections).forEach(typo => {
        if (corrected.includes(typo)) {
            corrected = corrected.replace(typo, corrections[typo]);
        }
    });
    // If ingredient is a single word and matches a key, use it
    if (Object.keys(ingredientIcons).includes(corrected)) {
        return corrected;
    }
    return corrected;
}

function convertToGrams(amount, unit, ingredient) {
    // Normalize unit and ingredient
    let normalizedUnit = unit.toLowerCase().trim().replace(/\s+/g, ' ');
    let normalizedIngredient = correctIngredientTypos(ingredient).toLowerCase().trim().replace(/\s+/g, ' ');
    // Debug log
    console.log('Converting:', { amount, normalizedUnit, normalizedIngredient });

    if (normalizedUnit.includes('cup')) {
        for (const [key, value] of Object.entries(unitConversions.cup)) {
            if (normalizedIngredient === key || normalizedIngredient.includes(key)) {
                console.log('Matched cup:', key, value);
                return Math.round(amount * value);
            }
        }
        return Math.round(amount * unitConversions.cup.default);
    }

    if (normalizedUnit.includes('tbsp') || normalizedUnit.includes('tablespoon')) {
        for (const [key, value] of Object.entries(unitConversions.tablespoon)) {
            if (normalizedIngredient === key || normalizedIngredient.includes(key)) {
                console.log('Matched tablespoon:', key, value);
                return Math.round(amount * value);
            }
        }
        return Math.round(amount * unitConversions.tablespoon.default);
    }

    if (normalizedUnit.includes('tsp') || normalizedUnit.includes('teaspoon')) {
        console.log('Matched teaspoon default');
        return Math.round(amount * unitConversions.teaspoon.default);
    }

    console.log('No match for:', { normalizedUnit, normalizedIngredient });
    return null; // Return null if no conversion available
}

function adjustLeavening(ingredient, originalAmount, scale) {
    const normalizedIngredient = ingredient.toLowerCase();
    if (normalizedIngredient.includes('baking powder') ||
        normalizedIngredient.includes('baking soda') ||
        normalizedIngredient.includes('yeast')) {
        // For leavening agents, scale less aggressively
        const adjustedScale = Math.pow(scale, 0.7);
        return originalAmount * adjustedScale;
    }
    return originalAmount * scale;
}

async function scaleRecipe() {
    const currentServings = parseInt(document.getElementById('currentServings').value);
    const desiredServings = parseInt(document.getElementById('desiredServings').value);
    const recipeInput = document.getElementById('recipeInput').value.trim();
    const shouldConvertToGrams = document.getElementById('convertToGrams').checked;

    if (!currentServings || !desiredServings || !recipeInput) {
        alert('Please fill in all fields! 🥺');
        return;
    }

    if (currentServings <= 0 || desiredServings <= 0) {
        alert('Servings must be positive numbers! 😊');
        return;
    }

    // Show loading
    document.getElementById('loading').classList.add('show');
    document.getElementById('resultsContainer').classList.remove('show');

    try {
        const scale = desiredServings / currentServings;
        const lines = recipeInput.split('\n').filter(line => line.trim());
        const scaledIngredients = [];

        let warnings = [];
        for (const line of lines) {
            const parsed = parseIngredientLine(line);
            if (isNaN(parsed.amount) || parsed.amount === null || parsed.amount === undefined) {
                warnings.push(`Could not parse amount for: "${line}"`);
                continue;
            }
            // Normalize and trim ingredient name
            parsed.ingredient = parsed.ingredient.trim().replace(/\s+/g, ' ');
            const scaledAmount = adjustLeavening(parsed.ingredient, parsed.amount, scale);

            let displayAmount, displayUnit, debugInfo = '';

            if (shouldConvertToGrams) {
                const gramsConversion = convertToGrams(scaledAmount, parsed.unit, parsed.ingredient);
                if (typeof gramsConversion === 'number' && !isNaN(gramsConversion)) {
                    displayAmount = gramsConversion;
                    displayUnit = 'g';
                } else {
                    displayAmount = Math.round(scaledAmount * 100) / 100;
                    displayUnit = parsed.unit;
                    debugInfo = `<span style='color:#b71c1c'>(No gram match for: "${parsed.ingredient}" as unit "${parsed.unit}")</span>`;
                }
            } else {
                displayAmount = Math.round(scaledAmount * 100) / 100;
                displayUnit = parsed.unit;
            }

            scaledIngredients.push({
                ingredient: parsed.ingredient,
                original: `${parsed.amount} ${parsed.unit}`,
                scaled: `${displayAmount} ${displayUnit} ${debugInfo}`,
                icon: getIngredientIcon(parsed.ingredient)
            });
        }

        // Display results
        displayResults(scaledIngredients, currentServings, desiredServings, scale, warnings);

        // Generate suggestions
        generateSuggestions(scale, desiredServings);

    } catch (error) {
        console.error('Error scaling recipe:', error);
        alert('Oops! Something went wrong while scaling your recipe. Please try again! 🙈');
    } finally {
        document.getElementById('loading').classList.remove('show');
    }
}

function displayResults(ingredients, currentServings, desiredServings, scale, warnings = []) {
    const resultsBody = document.getElementById('resultsBody');
    const scalingInfo = document.getElementById('scalingInfo');

    // Clear previous results
    resultsBody.innerHTML = '';

    // Add scaling info
    scalingInfo.innerHTML = `
        <div style="text-align: center; margin-bottom: 1rem; padding: 1rem; background: rgba(78, 205, 196, 0.1); border-radius: 10px;">
            <h3 style="color: #4ECDC4; margin-bottom: 0.5rem;">Scaling Factor: ${scale.toFixed(2)}x</h3>
            <p style="color: #333;">From ${currentServings} servings to ${desiredServings} servings</p>
        </div>
    `;

    // Add ingredients
    ingredients.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <span class="ingredient-icon">${item.icon}</span>
                ${item.ingredient}
            </td>
            <td>${item.original}</td>
            <td><strong>${item.scaled}</strong></td>
        `;
        resultsBody.appendChild(row);
    });

    // Show warnings if any
    if (warnings.length > 0) {
        const warnRow = document.createElement('tr');
        warnRow.innerHTML = `<td colspan="3" style="color: #b71c1c; background: #fff3e0; padding: 8px;">${warnings.join('<br>')}</td>`;
        resultsBody.appendChild(warnRow);
    }

    document.getElementById('resultsContainer').classList.add('show');
}

function generateSuggestions(scale, servings) {
    const suggestions = document.getElementById('suggestions');
    let tips = [];

    if (scale > 2) {
        tips.push('🍳 For large batches, consider using multiple pans to ensure even baking.');
        tips.push('⏰ Increase baking time by 10-15% and check doneness with a toothpick.');
        tips.push('🔥 Lower oven temperature by 25°F to prevent over-browning.');
    } else if (scale < 0.5) {
        tips.push('🥧 Use a smaller pan size to maintain proper depth.');
        tips.push('⏰ Reduce baking time by 20-30% and check frequently.');
        tips.push('🔥 Increase oven temperature by 25°F for better rise.');
    } else {
        tips.push('✨ This scaling factor is perfect for most recipes!');
        tips.push('🎯 Keep original baking time and temperature.');
    }

    if (servings > 20) {
        tips.push('🎉 Consider making multiple batches for better quality control.');
    }

    tips.push('📏 Always measure ingredients by weight for best results!');

    suggestions.innerHTML = tips.map(tip => `<p>${tip}</p>`).join('');
}

function clearInputs() {
    document.getElementById('currentServings').value = '6';
    document.getElementById('desiredServings').value = '12';
    document.getElementById('recipeInput').value = '';
    document.getElementById('convertToGrams').checked = false;
    document.getElementById('resultsContainer').classList.remove('show');
}

// --- DOMContentLoaded: Only UI setup ---
document.addEventListener("DOMContentLoaded", function () {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // Set active navigation link based on current page
    setActiveNavigation();
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
});

        // Scale Recipe Logic
        document.addEventListener("DOMContentLoaded", function () {
        const API_KEY = 'API_KEY';
        const API_URL = 'API_URL';



// Ingredient icons mapping (global)
const ingredientIcons = {
    'flour': '🌾',
    'sugar': '🍯',
    'butter': '🧈',
    'egg': '🥚',
    'milk': '🥛',
    'baking powder': '🥄',
    'baking soda': '🥄',
    'salt': '🧂',
    'vanilla': '🌿',
    'chocolate': '🍫',
    'cocoa': '🍫',
    'oil': '🫒',
    'honey': '🍯',
    'yeast': '🍞',
    'default': '🥄'
};

// Unit conversion data (grams) (global)
const unitConversions = {
    'cup': {
        'flour': 120,
        'sugar': 200,
        'butter': 225,
        'milk': 240,
        'oil': 240,
        'cocoa': 75,
        'default': 240
    },
    'tablespoon': {
        'flour': 8,
        'sugar': 12,
        'butter': 14,
        'oil': 14,
        'default': 15
    },
    'teaspoon': {
        'default': 5
    }
};

        function getIngredientIcon(ingredient) {
            const normalizedIngredient = ingredient.toLowerCase();
            for (const [key, icon] of Object.entries(ingredientIcons)) {
                if (normalizedIngredient.includes(key)) {
                    return icon;
                }
            }
            return ingredientIcons.default;
        }



        function parseIngredientLine(line) {
            // Enhanced regex to capture amount, unit, and ingredient
            const patterns = [
                /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(cups?|cup|tbsp|tablespoons?|tsp|teaspoons?|lbs?|pounds?|oz|ounces?|g|grams?|kg|kilograms?|ml|milliliters?|l|liters?)\s+(.+)$/i,
                /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(.+)$/i
            ];

            // Helper to parse fractions and mixed numbers (e.g., "1 1/2", "3/4", "2")
            function parseAmount(str) {
                str = str.trim();
                // Mixed number (e.g., "1 1/2")
                if (/^\d+ \d+\/\d+$/.test(str)) {
                    const [whole, frac] = str.split(' ');
                    const [num, denom] = frac.split('/');
                    return parseInt(whole) + (parseInt(num) / parseInt(denom));
                }
                // Simple fraction (e.g., "1/2")
                if (/^\d+\/\d+$/.test(str)) {
                    const [num, denom] = str.split('/');
                    return parseInt(num) / parseInt(denom);
                }
                // Decimal or integer
                return parseFloat(str);
            }

            for (const pattern of patterns) {
                const match = line.trim().match(pattern);
                if (match) {
                    if (match.length === 4) {
                        return {
                            amount: parseAmount(match[1]),
                            unit: match[2].toLowerCase(),
                            ingredient: match[3].trim()
                        };
                    } else {
                        return {
                            amount: parseAmount(match[1]),
                            unit: 'unit',
                            ingredient: match[2].trim()
                        };
                    }
                }
            }

            return {
                amount: 1,
                unit: 'unit',
                ingredient: line.trim()
            };
        }

    // Move to global scope
    window.correctIngredientTypos = function correctIngredientTypos(ingredient) {
            // Add more corrections as needed
            const corrections = {
                'floor': 'flour',
                // Add more common typos here
            };
            let corrected = ingredient.toLowerCase().trim().replace(/\s+/g, ' ');
            Object.keys(corrections).forEach(typo => {
                if (corrected.includes(typo)) {
                    corrected = corrected.replace(typo, corrections[typo]);
                }
            });
            // If ingredient is a single word and matches a key, use it
            if (Object.keys(ingredientIcons).includes(corrected)) {
                return corrected;
            }
            return corrected;
        }

    // Move to global scope
    window.convertToGrams = function convertToGrams(amount, unit, ingredient) {
            // Normalize unit and ingredient
            let normalizedUnit = unit.toLowerCase().trim().replace(/\s+/g, ' ');
            let normalizedIngredient = correctIngredientTypos(ingredient).toLowerCase().trim().replace(/\s+/g, ' ');
            // Debug log
            console.log('Converting:', { amount, normalizedUnit, normalizedIngredient });

            if (normalizedUnit.includes('cup')) {
                for (const [key, value] of Object.entries(unitConversions.cup)) {
                    if (normalizedIngredient === key || normalizedIngredient.includes(key)) {
                        console.log('Matched cup:', key, value);
                        return Math.round(amount * value);
                    }
                }
                return Math.round(amount * unitConversions.cup.default);
            }

            if (normalizedUnit.includes('tbsp') || normalizedUnit.includes('tablespoon')) {
                for (const [key, value] of Object.entries(unitConversions.tablespoon)) {
                    if (normalizedIngredient === key || normalizedIngredient.includes(key)) {
                        console.log('Matched tablespoon:', key, value);
                        return Math.round(amount * value);
                    }
                }
                return Math.round(amount * unitConversions.tablespoon.default);
            }

            if (normalizedUnit.includes('tsp') || normalizedUnit.includes('teaspoon')) {
                console.log('Matched teaspoon default');
                return Math.round(amount * unitConversions.teaspoon.default);
            }

            console.log('No match for:', { normalizedUnit, normalizedIngredient });
            return null; // Return null if no conversion available
        }

        function adjustLeavening(ingredient, originalAmount, scale) {
            const normalizedIngredient = ingredient.toLowerCase();
            if (normalizedIngredient.includes('baking powder') ||
                normalizedIngredient.includes('baking soda') ||
                normalizedIngredient.includes('yeast')) {
                // For leavening agents, scale less aggressively
                const adjustedScale = Math.pow(scale, 0.7);
                return originalAmount * adjustedScale;
            }
            return originalAmount * scale;
        }

    async function scaleRecipe() {
            const currentServings = parseInt(document.getElementById('currentServings').value);
            const desiredServings = parseInt(document.getElementById('desiredServings').value);
            const recipeInput = document.getElementById('recipeInput').value.trim();
            const shouldConvertToGrams = document.getElementById('convertToGrams').checked;

            if (!currentServings || !desiredServings || !recipeInput) {
                alert('Please fill in all fields! 🥺');
                return;
            }

            if (currentServings <= 0 || desiredServings <= 0) {
                alert('Servings must be positive numbers! 😊');
                return;
            }

            // Show loading
            document.getElementById('loading').classList.add('show');
            document.getElementById('resultsContainer').classList.remove('show');

            try {
                const scale = desiredServings / currentServings;
                const lines = recipeInput.split('\n').filter(line => line.trim());
                const scaledIngredients = [];


                let warnings = [];
                for (const line of lines) {
                    const parsed = parseIngredientLine(line);
                    if (isNaN(parsed.amount) || parsed.amount === null || parsed.amount === undefined) {
                        warnings.push(`Could not parse amount for: "${line}"`);
                        continue;
                    }
                    // Normalize and trim ingredient name
                    parsed.ingredient = parsed.ingredient.trim().replace(/\s+/g, ' ');
                    const scaledAmount = adjustLeavening(parsed.ingredient, parsed.amount, scale);

                    let displayAmount, displayUnit, debugInfo = '';

                    if (shouldConvertToGrams) {
                        const gramsConversion = window.convertToGrams(scaledAmount, parsed.unit, parsed.ingredient);
                        if (typeof gramsConversion === 'number' && !isNaN(gramsConversion)) {
                            displayAmount = gramsConversion;
                            displayUnit = 'g';
                        } else {
                            displayAmount = Math.round(scaledAmount * 100) / 100;
                            displayUnit = parsed.unit;
                            debugInfo = `<span style='color:#b71c1c'>(No gram match for: "${parsed.ingredient}" as unit "${parsed.unit}")</span>`;
                        }
                    } else {
                        displayAmount = Math.round(scaledAmount * 100) / 100;
                        displayUnit = parsed.unit;
                    }

                    scaledIngredients.push({
                        ingredient: parsed.ingredient,
                        original: `${parsed.amount} ${parsed.unit}`,
                        scaled: `${displayAmount} ${displayUnit} ${debugInfo}`,
                        icon: getIngredientIcon(parsed.ingredient)
                    });
                }

                // Display results

                displayResults(scaledIngredients, currentServings, desiredServings, scale, warnings);

                // Generate suggestions
                generateSuggestions(scale, desiredServings);

            } catch (error) {
                console.error('Error scaling recipe:', error);
                alert('Oops! Something went wrong while scaling your recipe. Please try again! 🙈');
            } finally {
                document.getElementById('loading').classList.remove('show');
            }
        }

    function displayResults(ingredients, currentServings, desiredServings, scale, warnings = []) {
            const resultsBody = document.getElementById('resultsBody');
            const scalingInfo = document.getElementById('scalingInfo');

            // Clear previous results
            resultsBody.innerHTML = '';

            // Add scaling info
            scalingInfo.innerHTML = `
                <div style="text-align: center; margin-bottom: 1rem; padding: 1rem; background: rgba(78, 205, 196, 0.1); border-radius: 10px;">
                    <h3 style="color: #4ECDC4; margin-bottom: 0.5rem;">Scaling Factor: ${scale.toFixed(2)}x</h3>
                    <p style="color: #333;">From ${currentServings} servings to ${desiredServings} servings</p>
                </div>
            `;


            // Add ingredients
            ingredients.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <span class="ingredient-icon">${item.icon}</span>
                        ${item.ingredient}
                    </td>
                    <td>${item.original}</td>
                    <td><strong>${item.scaled}</strong></td>
                `;
                resultsBody.appendChild(row);
            });

            // Show warnings if any
            if (warnings.length > 0) {
                const warnRow = document.createElement('tr');
                warnRow.innerHTML = `<td colspan="3" style="color: #b71c1c; background: #fff3e0; padding: 8px;">${warnings.join('<br>')}</td>`;
                resultsBody.appendChild(warnRow);
            }

            document.getElementById('resultsContainer').classList.add('show');
        }

        function generateSuggestions(scale, servings) {
            const suggestions = document.getElementById('suggestions');
            let tips = [];

            if (scale > 2) {
                tips.push('🍳 For large batches, consider using multiple pans to ensure even baking.');
                tips.push('⏰ Increase baking time by 10-15% and check doneness with a toothpick.');
                tips.push('🔥 Lower oven temperature by 25°F to prevent over-browning.');
            } else if (scale < 0.5) {
                tips.push('🥧 Use a smaller pan size to maintain proper depth.');
                tips.push('⏰ Reduce baking time by 20-30% and check frequently.');
                tips.push('🔥 Increase oven temperature by 25°F for better rise.');
            } else {
                tips.push('✨ This scaling factor is perfect for most recipes!');
                tips.push('🎯 Keep original baking time and temperature.');
            }

            if (servings > 20) {
                tips.push('🎉 Consider making multiple batches for better quality control.');
            }

            tips.push('📏 Always measure ingredients by weight for best results!');

            suggestions.innerHTML = tips.map(tip => `<p>${tip}</p>`).join('');
        }

    function clearInputs() {
            document.getElementById('currentServings').value = '6';
            document.getElementById('desiredServings').value = '12';
            document.getElementById('recipeInput').value = '';
            document.getElementById('convertToGrams').checked = false;
            document.getElementById('resultsContainer').classList.remove('show');
        }
        
        // Back to Top Button Logic
        const backToTopBtn = document.getElementById("backToTop");
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

        //Top to Bottom Button Logic
        const ToptobackBtn = document.getElementById("Toptoback");
        window.addEventListener("scroll", () => {
            if (window.scrollY < 100) {
                ToptobackBtn.classList.add("show");
            } else {
                ToptobackBtn.classList.remove("show");
            }
        });
        ToptobackBtn.addEventListener("click", () => {
            window.scrollTo({ top: 10000, behavior: "smooth" });
        });

        // Add some example recipes on page load
        window.addEventListener('load', function () {
            const examples = [
                "2 cups all-purpose flour\n1 cup sugar\n1/2 cup butter\n2 eggs\n1 tsp baking powder\n1/2 tsp salt\n1 cup milk",
                "3 cups flour\n1 cup cocoa powder\n2 cups sugar\n1 tsp baking soda\n1/2 tsp salt\n2 eggs\n1 cup buttermilk",
                "4 cups flour\n1/2 cup sugar\n1 packet yeast\n1 tsp salt\n1/4 cup olive oil\n1 1/2 cups warm water"
            ];
        });

        // Expose functions to global scope for HTML onclick
        window.scaleRecipe = scaleRecipe;
        window.clearInputs = clearInputs;

        });
