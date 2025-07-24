document.getElementById("lastNameSearch").addEventListener("input", function () {
    let lastName = this.value.trim();
    if (lastName.length > 1) {
        fetch("http://127.0.0.1/PAWNSHOPPP/php/get_customer_id.php?last_name=" + encodeURIComponent(lastName))
            .then(response => response.json())
            .then(data => {
                let dropdown = document.getElementById("firstNameDropdown");
                dropdown.innerHTML = '<option value="">Select First Name</option>';

                data.forEach(customer => {
                    let option = document.createElement("option");
                    option.value = customer.Customer_ID;
                    option.textContent = customer.Customer_FirstName;
                    dropdown.appendChild(option);
                });
            })
            .catch(error => console.error("Error fetching customers:", error));
    }
});

document.getElementById("firstNameDropdown").addEventListener("change", function () {
    document.getElementById("customerID").value = this.value;
});
    