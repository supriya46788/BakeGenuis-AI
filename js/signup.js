// Password strength checker
const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("password-strength");
let currentStrength = "Weak"; // Track current strength

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  let strength = "Weak";
  let color = "red";

  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  if (value.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) {
    strength = "Strong";
    color = "green";
  } else if (value.length >= 6 && ((hasLower && hasUpper) || (hasNumber && hasSpecial))) {
    strength = "Medium";
    color = "orange";
  }

  currentStrength = strength; // Update current strength
  strengthText.textContent = `Password strength: ${strength}`;
  strengthText.style.color = color;
});

// Signup form submit
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = passwordInput.value;

  // Check password strength before allowing signup
  if (currentStrength !== "Strong") {
    alert("Password must be strong! Please include uppercase, lowercase, number, special character, and minimum 8 characters.");
    return; // Stop form submission
  }

  // For demo purposes - actual signup not implemented
  alert("Email/password signup not implemented yet. Please use Google Sign-Up below.");
});
