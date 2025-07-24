// 📌 Load customer data when the "View Customers" tab is activated
document.getElementById("viewCustomersTab").addEventListener("click", function () {
    fetchCustomers();
});

// 📌 Fetch customer data from the server
function fetchCustomers() {
    fetch("http://localhost/PAWNSHOPPP/php/fetch_customers.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayCustomers(data.data);
            } else {
                alert("❌ Error fetching customer data.");
            }
        })
        .catch(error => {
            console.error("Error fetching customers:", error);
            alert("❌ Error fetching customer data.");
        });
}

// 📌 Display customers in the table
function displayCustomers(customers) {
    const customerTableBody = document.getElementById("customerTable");
    customerTableBody.innerHTML = ""; // Clear previous data

    customers.forEach(customer => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${customer.Customer_ID}</td>
            <td>${customer.Customer_LastName}</td>
            <td>${customer.Customer_FirstName}</td>
            <td>${customer.Customer_MiddleInitial}</td>
            <td>${customer.Customer_Gender}</td>
            <td>${customer.Customer_Address}</td>
            <td>${customer.Customer_Birthday}</td>
            <td>${customer.Customer_Nationality}</td>
            <td>${customer.Status}</td> 
            <td>
                <button class="btn btn-${customer.Status === 'Active' ? 'success' : 'danger'} btn-sm toggle-status"
                        data-id="${customer.Customer_ID}"
                        data-status="${customer.Status}">
                    ${customer.Status === 'Active' ? 'Inactive' : 'Active'}
                </button>
            </td>
        `;

        customerTableBody.appendChild(row);
    });

    // 📌 Initialize event listeners for status buttons
    initStatusButtons();
}
