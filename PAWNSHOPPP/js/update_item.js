function attachUpdateEventListeners() {
    document.querySelectorAll(".update-btn").forEach(button => {
        button.addEventListener("click", function () {
            let itemId = this.getAttribute("data-item-id");
            document.getElementById("confirmRenewBtn").setAttribute("data-item-id", itemId);
            let selectionModal = new bootstrap.Modal(document.getElementById("selectionModal"));
            selectionModal.show();
        });
    });
}

document.getElementById("confirmRenewBtn").addEventListener("click", function () {
    let itemId = this.getAttribute("data-item-id");
    fetch(`http://127.0.0.1/PAWNSHOPPP/php/get_pawnticket_by_item.php?item_id=${itemId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById("renewPawnticketId").value = data.pawnticket_id;
                let renewModal = new bootstrap.Modal(document.getElementById("renewModal"));
                renewModal.show();
            } else {
                alert("❌ Error: " + data.message);
            }
        })
        .catch(error => console.error("❌ Fetch Error:", error));
});
