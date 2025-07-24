// STORE SELECTED ITEM ID
let selectedItemId = null;

// FUNCTION TO INITIALIZE SOLD BUTTONS
function initSoldButtons() {
    document.querySelectorAll(".sold-btn").forEach(button => {
        button.addEventListener("click", function () {
            selectedItemId = this.getAttribute("data-item-id");
            openSoldModal(selectedItemId);
        });
    });
}

// FUNCTION TO OPEN SOLD MODAL
function openSoldModal(itemId) {
    selectedItemId = itemId;
    let soldModal = new bootstrap.Modal(document.getElementById("SoldModal"));
    soldModal.show();
}

// SUBMIT SOLD FORM
document.getElementById("SoldForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const soldPrice = document.getElementById("SoldValue").value.trim();
    const customerId = document.getElementById("customerID").value;

    fetch("http://127.0.0.1/PAWNSHOPPP/php/move_to_sold.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: selectedItemId, sold_price: soldPrice, customer_id: customerId })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchAuctionedItems(); // Refresh the table after selling an item
    });
});
