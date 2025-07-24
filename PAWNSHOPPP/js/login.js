        // ✅ If already logged in, redirect to dashboard
        if (localStorage.getItem("loggedIn")) {
            window.location.href = "dashboard.html";
        }

        document.getElementById("loginForm").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form submission

            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;

            // ✅ Replace with actual credentials or backend validation
            const adminUsername = "admin";
            const adminPassword = "123";

            if (username === adminUsername && password === adminPassword) {
                localStorage.setItem("loggedIn", "true"); // Store login session
                alert("Login successful! Redirecting to dashboard...");
                window.location.href = "dashboard.html"; // Navigate to dashboard
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });