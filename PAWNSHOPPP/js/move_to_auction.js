let selectedItemId = null;

function openAuctionModal(itemId) {
    selectedItemId = itemId;
    console.log("Opening Auction Modal for Item ID:", itemId);
    let auctionModal = new bootstrap.Modal(document.getElementById("AuctionModal"));
    auctionModal.show();
}

document.getElementById("AuctionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const auctionPrice = document.getElementById("AuctionValue").value.trim();

    if (!auctionPrice || isNaN(auctionPrice) || auctionPrice <= 0) {
        alert("❌ Please enter a valid auction price.");
        return;
    }

    fetch("http://127.0.0.1/PAWNSHOPPP/php/move_to_auction.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: selectedItemId, auction_price: auctionPrice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("✅ Item moved to auction successfully!");
            location.reload();
        } else {
            alert("❌ Error: " + data.message);
        }
    })
    .catch(error => console.error("Move to auction error:", error));
});

function attachMoveToAuctionEventListeners() {
    document.querySelectorAll(".move-btn").forEach(button => {
        button.addEventListener("click", function () {
            openAuctionModal(this.getAttribute("data-item-id"));
        });
    });
}
