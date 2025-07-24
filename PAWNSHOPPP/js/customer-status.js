// 📌 Function to initialize event listeners for toggle status buttons
function initStatusButtons() {
    document.querySelectorAll(".toggle-status").forEach(button => {
        button.addEventListener("click", function () {
            let customerID = this.dataset.id;
            let currentStatus = this.dataset.status;
            let newStatus = currentStatus === "Active" ? "Inactive" : "Active";

            updateCustomerStatus(customerID, newStatus);
        });
    });
}

// 📌 Function to update customer status
function updateCustomerStatus(customerID, newStatus) {
    fetch("http://localhost/PAWNSHOPPP/php/update_customer_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Customer_ID: customerID, Status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            fetchCustomers(); // Refresh the customer list
        } else {
            alert("❌ Error updating customer status.");
        }
    })
    .catch(error => {
        console.error("Error updating status:", error);
        alert("❌ Error updating customer status.");
    });
}
