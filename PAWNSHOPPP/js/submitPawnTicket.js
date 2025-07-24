document.addEventListener("DOMContentLoaded", function () {
    // ✅ Automatically set Maturity Date (30 days from today)
    const today = new Date();
    const maturityDate = new Date(today);
    maturityDate.setDate(today.getDate() + 30); // Add 30 days
    const formattedMaturityDate = maturityDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

    // ✅ Automatically set Expiry Date (90 days after Maturity Date)
    const expiryDate = new Date(maturityDate);
    expiryDate.setDate(maturityDate.getDate() + 90); // Add 90 days
    const formattedExpiryDate = expiryDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

    // ✅ Set values in the input fields
    document.getElementById("maturity_date").value = formattedMaturityDate;
    document.getElementById("expiry_date").value = formattedExpiryDate;
});

document.getElementById("pawnTicketForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("Submitting form...");

    const selectedCustomerID = document.getElementById("firstNameDropdown").value;
    if (!selectedCustomerID) {
        alert("Please select a customer first!");
        return;
    }

    const ticketNumberInput = document.getElementById("ticket_number").value.trim();

    // ✅ Auto-fetch values from the form (pre-filled)
    const formData = {
        customer_id: selectedCustomerID,
        ticket_number: ticketNumberInput !== "" ? ticketNumberInput : null,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        item_value: document.getElementById("item_value").value,
        interest: document.getElementById("interest").value,
        net_value: document.getElementById("net_value").value,
        maturity_date: document.getElementById("maturity_date").value, // ✅ Auto-set value
        expiry_date: document.getElementById("expiry_date").value // ✅ Auto-set value
    };

    try {
        const response = await fetch("http://127.0.0.1/PAWNSHOPPP/php/insert_pawn_ticket.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const text = await response.text();
        console.log("Raw Response:", text);

        let result;
        try {
            result = JSON.parse(text);
        } catch (error) {
            throw new Error("Invalid JSON response from server");
        }

        console.log(result);

        const responseMessage = document.getElementById("responseMessage");
        if (responseMessage) {
            responseMessage.textContent = result.message;
            responseMessage.style.color = result.status === "success" ? "green" : "red";
        } else {
            console.error("Error: Element with ID 'responseMessage' not found.");
        }

        // ✅ Automatically display the assigned Pawnticket Number
        if (result.status === "success" && result.pawnticket_id) {
            alert(`✅ Successfully Added!\nPawnticket Number: ${result.pawnticket_id}`);
            document.getElementById("ticket_number").value = result.pawnticket_id; // Update UI
        }

    } catch (error) {
        console.error("Fetch Error: ", error);
        alert("Network Error: Unable to submit data.");
    }
});
    