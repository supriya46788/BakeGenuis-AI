
// Note: API keys removed for security - implement server-side API calls in production
const GEMINI_API_KEY = null; // put your key here
const GEMINI_API_URL = null; // put your endpoint here


let currentUnit = 'metric';
let convertedData = [];

// Ingredient to emoji mapping
const ingredientEmojis = {
    'flour': '🌾',
    'sugar': '🍯',
    'butter': '🧈',
    'egg': '🥚',
    'milk': '🥛',
    'vanilla': '🌿',
    'baking powder': '⚡',
    'salt': '🧂',
    'chocolate': '🍫',
    'cocoa': '🍫',
    'oil': '🫒',
    'honey': '🍯',
    'cream': '🥛',
    'cheese': '🧀',
    'nuts': '🥜',
    'fruit': '🍓',
    'lemon': '🍋',
    'orange': '🍊',
    'cinnamon': '🌿',
    'default': '🥄'
};

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('recipeInput').value = e.target.result;
        };
        reader.readAsText(file);
    }
}

function getIngredientEmoji(ingredient) {
    const lower = ingredient.toLowerCase();
    for (const [key, emoji] of Object.entries(ingredientEmojis)) {
        if (lower.includes(key)) {
            return emoji;
        }
    }
    return ingredientEmojis.default;
}

// Mock/default conversion data for fallback
const defaultData = {
    "flour": 120,
    "sugar": 12,
    "butter": 14,
    "milk": 240,
    "egg": 50,
    "vanilla": 4,
    "baking powder": 5,
    "salt": 6
};

async function convertRecipe() {
    const recipeText = document.getElementById('recipeInput').value.trim();

    if (!recipeText) {
        showWarning('Please enter a recipe to convert!');
        return;
    }

    setLoading(true);

    try {
        // Only call Gemini if URL/key exist
        let aiResponse = '';
        if (GEMINI_API_URL && GEMINI_API_KEY) {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Convert this recipe to grams:\n${recipeText}`
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();
            aiResponse = data.candidates[0].content.parts[0].text;
        }

        let ingredients = [];
        if (aiResponse) {
            try {
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsedData = JSON.parse(jsonMatch[0]);
                    ingredients = applyFallbacks(parsedData.ingredients || []);
                } else {
                    ingredients = parseTextResponse(aiResponse);
                    ingredients = applyFallbacks(ingredients);
                }
            } catch (err) {
                console.error('Parse error:', err);
                ingredients = parseTextResponse(aiResponse);
                ingredients = applyFallbacks(ingredients);
            }
        } else {
            // Fallback if Gemini API not available
            ingredients = parseTextResponse(recipeText);
            ingredients = applyFallbacks(ingredients);
        }

        convertedData = ingredients;
        displayResults(convertedData);

    } catch (error) {
        console.error('Conversion error:', error);
        // Fallback in case of any error
        const ingredients = parseTextResponse(recipeText);
        convertedData = applyFallbacks(ingredients);
        displayResults(convertedData);
        showWarning('⚠️ Ingredient Not Found\nUsing default conversions for unknown items.');
    } finally {
        setLoading(false);
    }
}

// Apply default grams if unknown
function applyFallbacks(ingredients) {
    return ingredients.map(item => {
        let grams = item.grams;
        const name = item.ingredient.toLowerCase();

        if (!grams || isNaN(grams)) {
            if (defaultData[name]) grams = defaultData[name];
            else grams = 100; // general fallback
            item.notes = (item.notes || '') + ' (Estimated using default)';
            item.grams = grams;
        }

        return item;
    });
}

// Simple parser if no API response
function parseTextResponse(text) {
    const lines = text.split('\n').filter(l => l.trim());
    const ingredients = [];

    lines.forEach(line => {
        const parts = line.trim().split(' ');
        if (parts.length < 2) return;

        const amount = parts[0];
        const unit = parts[1];
        const name = parts.slice(2).join(' ');

        ingredients.push({
            ingredient: name,
            original: `${amount} ${unit}`,
            grams: defaultData[name.toLowerCase()] || null,
            notes: 'Estimated conversion'
        });
    });

    return ingredients;
}

function displayResults(ingredients) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsBody = document.getElementById('resultsBody');

    resultsBody.innerHTML = '';

    ingredients.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'ingredient-row';
        const emoji = getIngredientEmoji(item.ingredient);

        row.innerHTML = `
            <td>
                <span class="ingredient-icon">${emoji}</span>
                ${item.ingredient}
            </td>
            <td>${item.original}</td>
            <td class="tooltip" data-tooltip="${item.notes}">
                <strong>${item.grams}g</strong>
            </td>
            <td><small>${item.notes}</small></td>
        `;
        resultsBody.appendChild(row);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function toggleUnits(unit) {
    currentUnit = unit;
    document.querySelectorAll('.unit-toggle button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (convertedData.length > 0) displayResults(convertedData);
}

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

function showWarning(message) {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('warningPopup');
    const messageEl = document.getElementById('warningMessage');

    messageEl.textContent = message;
    overlay.style.display = 'block';
    popup.style.display = 'block';
}

function closeWarning() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('warningPopup');
    overlay.style.display = 'none';
    popup.style.display = 'none';
}

// Ctrl + Enter triggers conversion
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        convertRecipe();
    }
});

// Animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.input-section, .results-section');
    animateElements.forEach((el, index) => {
        el.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.2}s`;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
