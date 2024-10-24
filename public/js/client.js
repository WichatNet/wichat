document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignupLink = document.getElementById("show-signup");
    const showLoginLink = document.getElementById("show-login");

    // Toggle between login and signup forms
    showSignupLink.addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    });

    showLoginLink.addEventListener("click", function (e) {
        e.preventDefault();
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const username = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        const avatarFile = signupForm.querySelector('input[type="file"]').files[0];

        // Simple validation checks
        if (!validateEmail(email)) {
            alert("Please enter a valid email.");
            return;
        }
        if (password.length < 6) {
            alert("Password should be at least 6 characters long.");
            return;
        }

        // Create a FormData object to send the form data and avatar file
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('avatar', avatarFile);

        try {
            // Send data to the server to handle user creation
            const response = await fetch('/create_user', {
                method: 'POST',
                body: formData // Send the formData with file
            });

            if (response.ok) {
                alert("Signup successful! You can now log in.");
                signupForm.reset();
                signupForm.classList.add("hidden");
                document.getElementById("login-form").classList.remove("hidden");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Signup failed. Please try again later.");
        }
    });

    // Utility function to validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
});
