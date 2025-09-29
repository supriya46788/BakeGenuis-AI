// This file is for quick testing of the convertToGrams and ingredient parsing logic.
// It will not affect your main app.

function testConvertToGrams() {
    // Simulate the functions from scale.js
    const unitConversions = {
        'cup': { 'flour': 120, 'sugar': 200, 'butter': 225, 'milk': 240, 'oil': 240, 'cocoa': 75, 'default': 240 },
        'tablespoon': { 'flour': 8, 'sugar': 12, 'butter': 14, 'oil': 14, 'default': 15 },
        'teaspoon': { 'default': 5 }
    };
    function correctIngredientTypos(ingredient) {
        const corrections = { 'floor': 'flour' };
        let corrected = ingredient.toLowerCase().trim().replace(/\s+/g, ' ');
        Object.keys(corrections).forEach(typo => {
            if (corrected.includes(typo)) corrected = corrected.replace(typo, corrections[typo]);
        });
        return corrected;
    }
    function convertToGrams(amount, unit, ingredient) {
        const normalizedUnit = unit.toLowerCase();
        const normalizedIngredient = correctIngredientTypos(ingredient);
        if (normalizedUnit.includes('cup')) {
            for (const [key, value] of Object.entries(unitConversions.cup)) {
                if (normalizedIngredient === key || normalizedIngredient.includes(key)) return Math.round(amount * value);
            }
            return Math.round(amount * unitConversions.cup.default);
        }
        if (normalizedUnit.includes('tbsp') || normalizedUnit.includes('tablespoon')) {
            for (const [key, value] of Object.entries(unitConversions.tablespoon)) {
                if (normalizedIngredient === key || normalizedIngredient.includes(key)) return Math.round(amount * value);
            }
            return Math.round(amount * unitConversions.tablespoon.default);
        }
        if (normalizedUnit.includes('tsp') || normalizedUnit.includes('teaspoon')) {
            return Math.round(amount * unitConversions.teaspoon.default);
        }
        return null;
    }
    // Test cases
    const tests = [
        { amount: 1, unit: 'tablespoon', ingredient: 'sugar', expected: 12 },
        { amount: 2, unit: 'cup', ingredient: 'flour', expected: 240 },
        { amount: 1, unit: 'tablespoon', ingredient: 'floor', expected: 8 },
        { amount: 1, unit: 'tablespoon', ingredient: 'butter', expected: 14 },
        { amount: 1, unit: 'tablespoon', ingredient: 'unknown', expected: 15 },
    ];
    tests.forEach(test => {
        const result = convertToGrams(test.amount, test.unit, test.ingredient);
        console.log(`${test.amount} ${test.unit} ${test.ingredient} => ${result}g (expected: ${test.expected}g)`);
    });
}

testConvertToGrams();
