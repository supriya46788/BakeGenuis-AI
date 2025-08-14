// Show button when scrolled down 300px
window.onscroll = function () {
  document.getElementById("backToTop").style.display =
    document.documentElement.scrollTop > 0 ? "block" : "none";
};

// Scroll smoothly to top
document.getElementById("backToTop").onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const API_KEY = "API_KEY";
const API_URL = "API_URL";

// Ingredient icons mapping
const ingredientIcons = {
  flour: "🌾",
  sugar: "🍯",
  butter: "🧈",
  egg: "🥚",
  milk: "🥛",
  "baking powder": "🥄",
  "baking soda": "🥄",
  salt: "🧂",
  vanilla: "🌿",
  chocolate: "🍫",
  cocoa: "🍫",
  oil: "🫒",
  honey: "🍯",
  yeast: "🍞",
  default: "🥄",
};

// Unit conversion data (grams)
const unitConversions = {
  cup: {
    flour: 120,
    sugar: 200,
    butter: 225,
    milk: 240,
    oil: 240,
    cocoa: 75,
    default: 240,
  },
  tablespoon: {
    flour: 8,
    sugar: 12,
    butter: 14,
    oil: 14,
    default: 15,
  },
  teaspoon: {
    default: 5,
  },
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
    /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = line.trim().match(pattern);
    if (match) {
      if (match.length === 4) {
        return {
          amount: parseFloat(match[1]),
          unit: match[2].toLowerCase(),
          ingredient: match[3].trim(),
        };
      } else {
        return {
          amount: parseFloat(match[1]),
          unit: "unit",
          ingredient: match[2].trim(),
        };
      }
    }
  }

  return {
    amount: 1,
    unit: "unit",
    ingredient: line.trim(),
  };
}

function convertToGrams(amount, unit, ingredient) {
  const normalizedUnit = unit.toLowerCase();
  const normalizedIngredient = ingredient.toLowerCase();

  if (normalizedUnit.includes("cup")) {
    for (const [key, value] of Object.entries(unitConversions.cup)) {
      if (normalizedIngredient.includes(key)) {
        return Math.round(amount * value);
      }
    }
    return Math.round(amount * unitConversions.cup.default);
  }

  if (
    normalizedUnit.includes("tbsp") ||
    normalizedUnit.includes("tablespoon")
  ) {
    for (const [key, value] of Object.entries(unitConversions.tablespoon)) {
      if (normalizedIngredient.includes(key)) {
        return Math.round(amount * value);
      }
    }
    return Math.round(amount * unitConversions.tablespoon.default);
  }

  if (normalizedUnit.includes("tsp") || normalizedUnit.includes("teaspoon")) {
    return Math.round(amount * unitConversions.teaspoon.default);
  }

  return null; // Return null if no conversion available
}

function adjustLeavening(ingredient, originalAmount, scale) {
  const normalizedIngredient = ingredient.toLowerCase();
  if (
    normalizedIngredient.includes("baking powder") ||
    normalizedIngredient.includes("baking soda") ||
    normalizedIngredient.includes("yeast")
  ) {
    // For leavening agents, scale less aggressively
    const adjustedScale = Math.pow(scale, 0.7);
    return originalAmount * adjustedScale;
  }
  return originalAmount * scale;
}

async function scaleRecipe() {
  const currentServings = parseInt(
    document.getElementById("currentServings").value
  );
  const desiredServings = parseInt(
    document.getElementById("desiredServings").value
  );
  const recipeInput = document.getElementById("recipeInput").value.trim();
  const convertToGrams = document.getElementById("convertToGrams").checked;

  if (!currentServings || !desiredServings || !recipeInput) {
    alert("Please fill in all fields! 🥺");
    return;
  }

  if (currentServings <= 0 || desiredServings <= 0) {
    alert("Servings must be positive numbers! 😊");
    return;
  }

  // Show loading
  document.getElementById("loading").classList.add("show");
  document.getElementById("resultsContainer").classList.remove("show");

  try {
    const scale = desiredServings / currentServings;
    const lines = recipeInput.split("\n").filter((line) => line.trim());
    const scaledIngredients = [];

    for (const line of lines) {
      const parsed = parseIngredientLine(line);
      const scaledAmount = adjustLeavening(
        parsed.ingredient,
        parsed.amount,
        scale
      );

      let displayAmount, displayUnit;

      if (convertToGrams) {
        const gramsConversion = convertToGrams(
          scaledAmount,
          parsed.unit,
          parsed.ingredient
        );
        if (gramsConversion) {
          displayAmount = gramsConversion;
          displayUnit = "g";
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
        icon: getIngredientIcon(parsed.ingredient),
      });
    }

    // Display results
    displayResults(scaledIngredients, currentServings, desiredServings, scale);

    // Generate suggestions
    generateSuggestions(scale, desiredServings);
  } catch (error) {
    console.error("Error scaling recipe:", error);
    alert(
      "Oops! Something went wrong while scaling your recipe. Please try again! 🙈"
    );
  } finally {
    document.getElementById("loading").classList.remove("show");
  }
}

function displayResults(ingredients, currentServings, desiredServings, scale) {
  const resultsBody = document.getElementById("resultsBody");
  const scalingInfo = document.getElementById("scalingInfo");

  // Clear previous results
  resultsBody.innerHTML = "";

  // Add scaling info
  scalingInfo.innerHTML = `
                <div style="text-align: center; margin-bottom: 1rem; padding: 1rem; background: rgba(78, 205, 196, 0.1); border-radius: 10px;">
                    <h3 style="color: #4ECDC4; margin-bottom: 0.5rem;">Scaling Factor: ${scale.toFixed(
                      2
                    )}x</h3>
                    <p style="color: #333;">From ${currentServings} servings to ${desiredServings} servings</p>
                </div>
            `;

  // Initialize nutrition totals
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

  // Add ingredients and calculate nutrition
  ingredients.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>
                        <span class="ingredient-icon">${item.icon}</span>
                        ${item.ingredient}
                    </td>
                    <td>${item.original}</td>
                    <td><strong>${item.scaled}</strong></td>
                `;
    resultsBody.appendChild(row);

    // Extract grams from scaled amount for nutrition calculation
    let grams = 0;
    const scaledText = item.scaled.toLowerCase();
    
    // Try to extract grams from the scaled text
    if (scaledText.includes('g')) {
      const gramMatch = scaledText.match(/(\d+(?:\.\d+)?)\s*g/);
      if (gramMatch) {
        grams = parseFloat(gramMatch[1]);
      }
    } else {
      // Estimate grams for non-gram units
      const key = Object.keys(nutritionDB).find((k) => item.ingredient.toLowerCase().includes(k)) || "default";
      // Use a rough estimation based on common conversions
      if (scaledText.includes('cup')) {
        const cupMatch = scaledText.match(/(\d+(?:\.\d+)?)\s*cup/);
        if (cupMatch) {
          const cups = parseFloat(cupMatch[1]);
          grams = cups * (unitConversions.cup[key] || unitConversions.cup.default);
        }
      } else if (scaledText.includes('tbsp') || scaledText.includes('tablespoon')) {
        const tbspMatch = scaledText.match(/(\d+(?:\.\d+)?)\s*(?:tbsp|tablespoon)/);
        if (tbspMatch) {
          const tbsp = parseFloat(tbspMatch[1]);
          grams = tbsp * (unitConversions.tablespoon[key] || unitConversions.tablespoon.default);
        }
      } else if (scaledText.includes('tsp') || scaledText.includes('teaspoon')) {
        const tspMatch = scaledText.match(/(\d+(?:\.\d+)?)\s*(?:tsp|teaspoon)/);
        if (tspMatch) {
          const tsp = parseFloat(tspMatch[1]);
          grams = tsp * (unitConversions.teaspoon[key] || unitConversions.teaspoon.default);
        }
      } else {
        // Default estimation
        grams = 50;
      }
    }

    // Calculate nutrition
    const nutritionKey = Object.keys(nutritionDB).find((k) => item.ingredient.toLowerCase().includes(k)) || "default";
    const nutri = nutritionDB[nutritionKey];
    const factor = grams / 100;
    
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

  document.getElementById("resultsContainer").classList.add("show");
}

function generateSuggestions(scale, servings) {
  const suggestions = document.getElementById("suggestions");
  let tips = [];

  if (scale > 2) {
    tips.push(
      "🍳 For large batches, consider using multiple pans to ensure even baking."
    );
    tips.push(
      "⏰ Increase baking time by 10-15% and check doneness with a toothpick."
    );
    tips.push("🔥 Lower oven temperature by 25°F to prevent over-browning.");
  } else if (scale < 0.5) {
    tips.push("🥧 Use a smaller pan size to maintain proper depth.");
    tips.push("⏰ Reduce baking time by 20-30% and check frequently.");
    tips.push("🔥 Increase oven temperature by 25°F for better rise.");
  } else {
    tips.push("✨ This scaling factor is perfect for most recipes!");
    tips.push("🎯 Keep original baking time and temperature.");
  }

  if (servings > 20) {
    tips.push(
      "🎉 Consider making multiple batches for better quality control."
    );
  }

  tips.push("📏 Always measure ingredients by weight for best results!");

  suggestions.innerHTML = tips.map((tip) => `<p>${tip}</p>`).join("");
}

function clearInputs() {
  document.getElementById("currentServings").value = "6";
  document.getElementById("desiredServings").value = "12";
  document.getElementById("recipeInput").value = "";
  document.getElementById("convertToGrams").checked = false;
  document.getElementById("resultsContainer").classList.remove("show");
}

// Add some example recipes on page load
window.addEventListener("load", function () {
  const examples = [
    "2 cups all-purpose flour\n1 cup sugar\n1/2 cup butter\n2 eggs\n1 tsp baking powder\n1/2 tsp salt\n1 cup milk",
    "3 cups flour\n1 cup cocoa powder\n2 cups sugar\n1 tsp baking soda\n1/2 tsp salt\n2 eggs\n1 cup buttermilk",
    "4 cups flour\n1/2 cup sugar\n1 packet yeast\n1 tsp salt\n1/4 cup olive oil\n1 1/2 cups warm water",
  ];
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

fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
});
