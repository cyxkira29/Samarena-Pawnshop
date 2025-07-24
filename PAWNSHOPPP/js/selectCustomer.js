document.getElementById('firstNameDropdown').addEventListener('change', function () {
    let selectedOption = this.options[this.selectedIndex];
    let customerIDField = document.getElementById('customerID');

    if (selectedOption.value) {
        customerIDField.textContent = selectedOption.value; // Set the text inside the span
    } else {
        customerIDField.textContent = "Customer ID"; // Reset if no selection
    }
});
