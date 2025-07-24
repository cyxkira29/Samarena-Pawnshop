document.addEventListener("DOMContentLoaded", function () {
    // ✅ Check if user is logged in, if not, redirect to index.html
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "index.html"; // Redirect to login page
    }

    // ✅ Logout Functionality
    document.getElementById("logout").addEventListener("click", function (event) {
        event.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("loggedIn"); // Remove login status
            alert("You have been logged out.");
            window.location.href = "index.html"; // ✅ Redirect to login page
        }
    });
});