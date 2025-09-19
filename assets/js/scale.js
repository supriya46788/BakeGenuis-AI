        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        const darkModeIcon = darkModeToggle.querySelector('i');

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            body.classList.add('dark-mode');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        }

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            // Update icon
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

        // Mobile Navigation Toggle
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

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

        // Scale Recipe Logic
        const API_KEY = 'API_KEY';
        const API_URL = 'API_URL';



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
                            amount: parseFloat(match[1]),
                            unit: match[2].toLowerCase(),
                            ingredient: match[3].trim()
                        };
                    } else {
                        return {
                            amount: parseFloat(match[1]),
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
        // Dual Scroll Buttons
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const scrollBottomBtn = document.getElementById('scrollBottomBtn');

        window.addEventListener('scroll', () => {
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

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });


        // Function to update login state
        function updateLoginState() {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const loginBtn = document.getElementById("openLoginModal");
            const logoutBtn = document.getElementById("logoutBtn");

            if (isLoggedIn) {
                loginBtn.style.display = "none";
                logoutBtn.style.display = "flex";
            } else {
                loginBtn.style.display = "flex";
                logoutBtn.style.display = "none";
            }
        }

        // Logout functionality
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                updateLoginState();
                alert("You have been logged out successfully!");
            });
        }

        // Check login state on page load
        document.addEventListener("DOMContentLoaded", () => {
            updateLoginState();
        });

        // Add some example recipes on page load
        window.addEventListener('load', function () {
            const examples = [
                "2 cups all-purpose flour\n1 cup sugar\n1/2 cup butter\n2 eggs\n1 tsp baking powder\n1/2 tsp salt\n1 cup milk",
                "3 cups flour\n1 cup cocoa powder\n2 cups sugar\n1 tsp baking soda\n1/2 tsp salt\n2 eggs\n1 cup buttermilk",
                "4 cups flour\n1/2 cup sugar\n1 packet yeast\n1 tsp salt\n1/4 cup olive oil\n1 1/2 cups warm water"
            ];


        });

        function generateChecklist(ingredients) {
    let checklistContainer = document.getElementById('checklist');
    if (!checklistContainer) return; // if checklist div not added, skip
    checklistContainer.innerHTML = '';
    const savedState = JSON.parse(localStorage.getItem('checklistState') || '{}');

    ingredients.forEach(item => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = savedState[item.ingredient] || false;
        checkbox.addEventListener('change', () => {
            const state = JSON.parse(localStorage.getItem('checklistState') || '{}');
            state[item.ingredient] = checkbox.checked;
            localStorage.setItem('checklistState', JSON.stringify(state));
        });
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(' ' + item.ingredient));
        checklistContainer.appendChild(li);
    });
}

const substitutions = {
    'buttermilk': 'milk + lemon juice',
    'milk': 'water + milk powder',
    'sugar': 'honey or maple syrup',
    'butter': 'margarine or coconut oil',
    'egg': 'flaxseed + water'
};

function generateSubstitutions() {
    const suggestionsBox = document.getElementById('suggestions');
    const lines = document.getElementById('recipeInput').value.split('\n');
    let tips = [];

    lines.forEach(line => {
        for (const key in substitutions) {
            if (line.toLowerCase().includes(key)) {
                tips.push(`🔄 You can substitute ${key} with ${substitutions[key]}.`);
            }
        }
    });

    suggestionsBox.innerHTML += tips.map(t => `<p>${t}</p>`).join('');
}
const scaleSlider = document.getElementById('scaleRange');
const scaleValueDisplay = document.getElementById('scaleValue');

if (scaleSlider) {
    scaleSlider.addEventListener('input', () => {
        const value = parseFloat(scaleSlider.value);
        if (scaleValueDisplay) scaleValueDisplay.textContent = value.toFixed(1) + 'x';
        scaleRecipe(value); // call your existing scaleRecipe function with slider value
    });
}
document.getElementById('recipeInput').addEventListener('input', () => {
    const liveResults = document.getElementById('liveResults');
    if (!liveResults) return;
    const lines = document.getElementById('recipeInput').value.split('\n');
    liveResults.innerHTML = '';
    lines.forEach(line => {
        if (!line.trim()) return;
        const parsed = parseIngredientLine(line);
        const grams = convertToGrams(parsed.amount, parsed.unit, parsed.ingredient);
        if (grams) liveResults.innerHTML += `<p>${parsed.amount} ${parsed.unit} ${parsed.ingredient} → ${grams} g</p>`;
    });
});


