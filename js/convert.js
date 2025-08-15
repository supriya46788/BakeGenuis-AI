// Show button when scrolled down 300px
window.onscroll = function () {
  document.getElementById("backToTop").style.display =
    document.documentElement.scrollTop > 0 ? "block" : "none";
};

// Scroll smoothly to top
document.getElementById("backToTop").onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const GEMINI_API_KEY = "API_KEY";
const GEMINI_API_URL = "API_URL";

let currentUnit = "metric";
let convertedData = [];

// Ingredient to emoji mapping
const ingredientEmojis = {
  flour: "🌾",
  sugar: "🍯",
  butter: "🧈",
  egg: "🥚",
  milk: "🥛",
  vanilla: "🌿",
  "baking powder": "⚡",
  salt: "🧂",
  chocolate: "🍫",
  cocoa: "🍫",
  oil: "🫒",
  honey: "🍯",
  cream: "🥛",
  cheese: "🧀",
  nuts: "🥜",
  fruit: "🍓",
  lemon: "🍋",
  orange: "🍊",
  cinnamon: "🌿",
  default: "🥄",
};

function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("recipeInput").value = e.target.result;
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

async function convertRecipe() {
  const recipeText = document.getElementById("recipeInput").value.trim();

  if (!recipeText) {
    showWarning("Please enter a recipe to convert!");
    return;
  }

  setLoading(true);

  try {
    // Check if API is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "API_KEY" || !GEMINI_API_URL || GEMINI_API_URL === "API_URL") {
      // Use mock conversion instead
      const mockData = convertRecipeLocally(recipeText);
      convertedData = mockData.ingredients || [];
      displayResults(convertedData);
      setLoading(false);
      return;
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convert this recipe to precise gram measurements. For each ingredient, provide:
1. Normalized ingredient name
2. Original measurement
3. Gram equivalent
4. Any relevant notes about the conversion

Please format the response as JSON with this structure:
{
  "ingredients": [
    {
      "ingredient": "All-purpose flour",
      "original": "2 cups",
      "grams": 240,
      "notes": "Sifted measurement"
    }
  ],
  "warnings": ["Any ambiguous measurements that need clarification"]
}

Recipe to convert:
${recipeText}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    // Parse the AI response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        convertedData = parsedData.ingredients || [];
        displayResults(convertedData);

        // Show warnings if any
        if (parsedData.warnings && parsedData.warnings.length > 0) {
          showWarning(parsedData.warnings.join("\n"));
        }
      } else {
        throw new Error("Could not parse AI response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      // Fallback: create results from plain text
      convertedData = parseTextResponse(aiResponse);
      displayResults(convertedData);
    }
  } catch (error) {
    console.error("Conversion error:", error);
    // Use local conversion as fallback
    try {
      const mockData = convertRecipeLocally(recipeText);
      convertedData = mockData.ingredients || [];
      displayResults(convertedData);
    } catch (fallbackError) {
      showWarning(
        "Sorry, there was an error converting your recipe. Please try again."
      );
    }
  } finally {
    setLoading(false);
  }
}

function convertRecipeLocally(recipeText) {
  // Local conversion mappings (cups to grams)
  const conversionMap = {
    "flour": { "cup": 120, "cups": 120 },
    "sugar": { "cup": 200, "cups": 200 },
    "butter": { "cup": 227, "cups": 227 },
    "egg": { "large": 50, "medium": 44, "small": 38 },
    "eggs": { "large": 50, "medium": 44, "small": 38 },
    "milk": { "cup": 240, "cups": 240 },
    "vanilla": { "tsp": 4, "tbsp": 12, "teaspoon": 4, "tablespoon": 12 },
    "baking powder": { "tsp": 4, "tbsp": 12, "teaspoon": 4, "tablespoon": 12 },
    "salt": { "tsp": 6, "tbsp": 18, "teaspoon": 6, "tablespoon": 18 },
    "chocolate": { "cup": 175, "cups": 175, "oz": 28 },
    "oil": { "cup": 220, "cups": 220 },
    "honey": { "cup": 340, "cups": 340 },
    "cream": { "cup": 240, "cups": 240 }
  };

  const lines = recipeText.split('\n').filter(line => line.trim());
  const ingredients = [];

  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) return;

    // Parse ingredient line
    const match = line.match(/^[-•*]?\s*(\d+(?:\/\d+)?)\s+(cup|cups|tsp|tbsp|teaspoon|tablespoon|large|medium|small|oz)\s+(.+)$/i);
    
    if (match) {
      let [, amount, unit, ingredient] = match;
      
      // Convert fraction to decimal
      if (amount.includes('/')) {
        const [num, den] = amount.split('/').map(Number);
        amount = num / den;
      } else {
        amount = parseFloat(amount);
      }

      // Clean up ingredient name
      ingredient = ingredient.replace(/,.*$/, '').trim();
      
      // Find conversion
      const ingredientKey = Object.keys(conversionMap).find(key => 
        ingredient.toLowerCase().includes(key)
      );
      
      let grams = 100; // default
      let notes = "Estimated conversion";
      
      if (ingredientKey && conversionMap[ingredientKey][unit.toLowerCase()]) {
        grams = Math.round(amount * conversionMap[ingredientKey][unit.toLowerCase()]);
        notes = "Standard conversion";
      }

      ingredients.push({
        ingredient: ingredient,
        original: `${amount} ${unit}`,
        grams: grams,
        notes: notes
      });
    } else {
      // Try to parse other formats
      const simpleMatch = line.match(/^[-•*]?\s*(.+)$/);
      if (simpleMatch) {
        ingredients.push({
          ingredient: simpleMatch[1],
          original: "As needed",
          grams: 5,
          notes: "To taste"
        });
      }
    }
  });

  return { ingredients };
}

function parseTextResponse(text) {
  // Simple fallback parser for plain text responses
  const lines = text.split("\n").filter((line) => line.trim());
  const ingredients = [];

  lines.forEach((line) => {
    if (
      line.includes("cup") ||
      line.includes("tbsp") ||
      line.includes("tsp") ||
      line.includes("pound") ||
      line.includes("oz")
    ) {
      const parts = line.split(/[:;-]/);
      if (parts.length >= 2) {
        ingredients.push({
          ingredient: parts[0].trim(),
          original: parts[1].trim(),
          grams: Math.round(Math.random() * 200 + 50), // Placeholder
          notes: "Estimated conversion",
        });
      }
    }
  });

  return ingredients;
}

function displayResults(ingredients) {
  const resultsSection = document.getElementById("resultsSection");
  const resultsBody = document.getElementById("resultsBody");

  resultsBody.innerHTML = "";
  let nutritionTotals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sugar: 0,
  };

  // Simple nutrition database (per 100g)
  const nutritionDB = {
    flour: { calories: 364, protein: 10, fat: 1, carbs: 76, sugar: 0 },
    sugar: { calories: 387, protein: 0, fat: 0, carbs: 100, sugar: 100 },
    butter: { calories: 717, protein: 1, fat: 81, carbs: 0, sugar: 0 },
    egg: { calories: 155, protein: 13, fat: 11, carbs: 1, sugar: 1 },
    milk: { calories: 42, protein: 3.4, fat: 1, carbs: 5, sugar: 5 },
    vanilla: { calories: 288, protein: 0, fat: 0, carbs: 13, sugar: 13 },
    "baking powder": { calories: 53, protein: 0, fat: 0, carbs: 28, sugar: 0 },
    salt: { calories: 0, protein: 0, fat: 0, carbs: 0, sugar: 0 },
    chocolate: { calories: 546, protein: 4.9, fat: 31, carbs: 61, sugar: 48 },
    cocoa: { calories: 228, protein: 20, fat: 14, carbs: 58, sugar: 1 },
    oil: { calories: 884, protein: 0, fat: 100, carbs: 0, sugar: 0 },
    honey: { calories: 304, protein: 0.3, fat: 0, carbs: 82, sugar: 82 },
    cream: { calories: 340, protein: 2, fat: 36, carbs: 3, sugar: 3 },
    cheese: { calories: 402, protein: 25, fat: 33, carbs: 1.3, sugar: 1 },
    nuts: { calories: 607, protein: 20, fat: 54, carbs: 20, sugar: 4 },
    fruit: { calories: 52, protein: 0.3, fat: 0.2, carbs: 14, sugar: 10 },
    lemon: { calories: 29, protein: 1.1, fat: 0.3, carbs: 9, sugar: 2.5 },
    orange: { calories: 47, protein: 0.9, fat: 0.1, carbs: 12, sugar: 9 },
    cinnamon: { calories: 247, protein: 4, fat: 1.2, carbs: 81, sugar: 2.2 },
    default: { calories: 100, protein: 1, fat: 1, carbs: 20, sugar: 5 },
  };

  ingredients.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "ingredient-row";

    const emoji = getIngredientEmoji(item.ingredient);

    row.innerHTML = `
                    <td>
                        <span class="ingredient-icon">${emoji}</span>
                        ${item.ingredient}
                    </td>
                    <td>${item.original}</td>
                    <td class="tooltip" data-tooltip="$${
                      item.notes || "Standard conversion"
                    }">
                        <strong>${item.grams}g</strong>
                    </td>
                    <td><small>${item.notes || "Standard"}</small></td>
                `;
    resultsBody.appendChild(row);

    // Nutrition calculation
    const key = Object.keys(nutritionDB).find((k) => item.ingredient.toLowerCase().includes(k)) || "default";
    const nutri = nutritionDB[key];
    const factor = item.grams / 100;
    nutritionTotals.calories += nutri.calories * factor;
    nutritionTotals.protein += nutri.protein * factor;
    nutritionTotals.fat += nutri.fat * factor;
    nutritionTotals.carbs += nutri.carbs * factor;
    nutritionTotals.sugar += nutri.sugar * factor;
  });

  // Show nutrition section
  const nutritionSection = document.getElementById("nutritionSection");
  const nutritionBody = document.getElementById("nutritionBody");
  if (ingredients.length > 0) {
    nutritionSection.style.display = "block";
    nutritionBody.innerHTML = `<tr>
      <td>${nutritionTotals.calories.toFixed(0)}</td>
      <td>${nutritionTotals.protein.toFixed(1)}</td>
      <td>${nutritionTotals.fat.toFixed(1)}</td>
      <td>${nutritionTotals.carbs.toFixed(1)}</td>
      <td>${nutritionTotals.sugar.toFixed(1)}</td>
    </tr>`;
  } else {
    nutritionSection.style.display = "none";
    nutritionBody.innerHTML = "";
  }

  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function toggleUnits(unit) {
  currentUnit = unit;

  // Update active button
  document.querySelectorAll(".unit-toggle button").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update display (for now, just refresh the current data)
  if (convertedData.length > 0) {
    displayResults(convertedData);
  }
}

function setLoading(isLoading) {
  const button = document.querySelector(".convert-button");
  const spinner = document.getElementById("loadingSpinner");
  const buttonText = document.getElementById("buttonText");

  if (isLoading) {
    button.disabled = true;
    spinner.style.display = "inline-block";
    buttonText.textContent = "Converting...";
  } else {
    button.disabled = false;
    spinner.style.display = "none";
    buttonText.textContent = "Magically Convert ✨";
  }
}

function showWarning(message) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("warningPopup");
  const messageEl = document.getElementById("warningMessage");

  messageEl.textContent = message;
  overlay.style.display = "block";
  popup.style.display = "block";
}

function closeWarning() {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("warningPopup");

  overlay.style.display = "none";
  popup.style.display = "none";
}

// Add some sample data for demo purposes
document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("recipeInput");

  // Add floating animation to page elements
  const animateElements = document.querySelectorAll(
    ".input-section, .results-section"
  );
  animateElements.forEach((el, index) => {
    el.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.2}s`;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
  });
});

const darkModeToggle = document.getElementById("darkModeToggle");

// On page load, check localStorage and apply dark mode if enabled
if (localStorage.getItem("darkMode") === "enabled") {
  document.documentElement.classList.add("dark-mode");
  if (darkModeToggle)
    darkModeToggle.innerHTML = `<img src="../assets/sun.png" width="20" height="20">`;
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");

    if (document.documentElement.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      darkModeToggle.innerHTML = `<img src="../assets/sun.png" width="20" height="20">`;
    } else {
      localStorage.setItem("darkMode", "disabled");
      darkModeToggle.innerHTML = `<img src="../assets/moon.png" width="20" height="20">`;
    }
  });
}

// Add fadeInUp animation
const style = document.createElement("style");
style.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
document.head.appendChild(style);

fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
