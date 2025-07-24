document.getElementById("pawnForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    let customerData = {
        firstname: document.getElementById("firstname").value.trim(),
        middle_initial: document.getElementById("middle_initial").value.trim(),
        lastname: document.getElementById("lastname").value.trim(),
        birthday: document.getElementById("birthday").value.trim(),
        address: document.getElementById("address").value.trim(),
        nationality: document.getElementById("nationality").value.trim(),
        gender: document.getElementById("gender").value
    };

    fetch("http://localhost/PAWNSHOPPP/php/add_customer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    })
    .then(response => response.text()) // Get raw response first
    .then(text => {
        console.log("Raw Response:", text); // Log raw response
        try {
            let data = JSON.parse(text); // Try to parse JSON
            console.log("Parsed JSON:", data);
            if (data.status === "success") {
                alert("✅ " + data.message);
                document.getElementById("pawnForm").reset();
            } else {
                alert("❌ " + data.message);
            }
        } catch (e) {
            console.error("JSON Parse Error:", e);
            alert("❌ JSON Parse Error. Check console.");
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("❌ Fetch Error. Check console.");
    });
    
});