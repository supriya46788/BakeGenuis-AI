 // Note: API keys removed for security - implement server-side API calls in production
const API_KEY = null;
const API_URL = null;

        // Ingredient icons mapping
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

        // Unit conversion data (grams)
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

        function parseAmount(value) {
            if (value.includes('/')) {
                const [num, den] = value.split('/').map(Number);
                return num / den;
            }
            return parseFloat(value);
        }


        function convertToGrams(amount, unit, ingredient) {
            const normalizedUnit = unit.toLowerCase();
            const normalizedIngredient = ingredient.toLowerCase();
            
            if (normalizedUnit.includes('cup')) {
                for (const [key, value] of Object.entries(unitConversions.cup)) {
                    if (normalizedIngredient.includes(key)) {
                        return Math.round(amount * value);
                    }
                }
                return Math.round(amount * unitConversions.cup.default);
            }
            
            if (normalizedUnit.includes('tbsp') || normalizedUnit.includes('tablespoon')) {
                for (const [key, value] of Object.entries(unitConversions.tablespoon)) {
                    if (normalizedIngredient.includes(key)) {
                        return Math.round(amount * value);
                    }
                }
                return Math.round(amount * unitConversions.tablespoon.default);
            }
            
            if (normalizedUnit.includes('tsp') || normalizedUnit.includes('teaspoon')) {
                return Math.round(amount * unitConversions.teaspoon.default);
            }
            
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
            const convertToGrams = document.getElementById('convertToGrams').checked;

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

                for (const line of lines) {
                    const parsed = parseIngredientLine(line);
                    const scaledAmount = adjustLeavening(parsed.ingredient, parsed.amount, scale);
                    
                    let displayAmount, displayUnit;
                    
                    if (convertToGrams) {
                        const gramsConversion = convertToGrams(scaledAmount, parsed.unit, parsed.ingredient);
                        if (gramsConversion) {
                            displayAmount = gramsConversion;
                            displayUnit = 'g';
                        } else {
                            displayAmount = Math.round(scaledAmount * 100) / 100;
                            displayUnit = parsed.unit;
                        }
                    } else {
                        displayAmount = Math.round(scaledAmount * 100) / 100;
                        displayUnit = parsed.unit;
                    }

                    scaledIngredients.push({
                        ingredient: parsed.ingredient,
                        original: `${parsed.amount} ${parsed.unit}`,
                        scaled: `${displayAmount} ${displayUnit}`,
                        icon: getIngredientIcon(parsed.ingredient)
                    });
                }

                // Display results
                displayResults(scaledIngredients, currentServings, desiredServings, scale);
                
                // Generate suggestions
                generateSuggestions(scale, desiredServings);

            } catch (error) {
                console.error('Error scaling recipe:', error);
                alert('Oops! Something went wrong while scaling your recipe. Please try again! 🙈');
            } finally {
                document.getElementById('loading').classList.remove('show');
            }
        }

        function displayResults(ingredients, currentServings, desiredServings, scale) {
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

        // Add some example recipes on page load
        window.addEventListener('load', function() {
            const examples = [
                "2 cups all-purpose flour\n1 cup sugar\n1/2 cup butter\n2 eggs\n1 tsp baking powder\n1/2 tsp salt\n1 cup milk",
                "3 cups flour\n1 cup cocoa powder\n2 cups sugar\n1 tsp baking soda\n1/2 tsp salt\n2 eggs\n1 cup buttermilk",
                "4 cups flour\n1/2 cup sugar\n1 packet yeast\n1 tsp salt\n1/4 cup olive oil\n1 1/2 cups warm water"
            ];
            
          
        });

// about.js

// Add this new function to your file
function initNavbarScrollEffect() {
  const navbar = document.querySelector('.navbar');
  
  // Set a scroll threshold (e.g., 50px)
  const scrollThreshold = 50; 

  // Function to handle the scroll event
  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      // If scrolled past the threshold, add the class
      navbar.classList.add('navbar-scrolled');
    } else {
      // Otherwise, remove it
      navbar.classList.remove('navbar-scrolled');
    }
  };

  // Listen for the scroll event on the window
  window.addEventListener('scroll', handleScroll);
}


// --- Inside your DOMContentLoaded event listener, add the call to the new function ---
document.addEventListener('DOMContentLoaded', function() {
    // ... (your other functions like createSparkles, initMobileMenu, etc.)

    initNavbarScrollEffect(); // <-- Add this line here

    // ... (rest of your code)
});