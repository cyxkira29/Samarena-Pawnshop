document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Redeem Script Loaded!");

    // ✅ Handle clicking on update buttons to set correct data attributes
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("update-btn")) {
            let pawnticketId = event.target.getAttribute("data-pawnticket-id");
            let itemId = event.target.getAttribute("data-item-id");

            if (!pawnticketId || !itemId) {
                console.error("❌ Error: Missing Pawnticket ID or Item ID!");
                return;
            }

            console.log("✅ Update Button Clicked - Setting data-pawnticket-id:", pawnticketId);
            console.log("✅ Update Button Clicked - Setting data-item-id:", itemId);

            // Set attributes for redeem and renew buttons
            document.getElementById("confirmRedeemBtn").setAttribute("data-pawnticket-id", pawnticketId);
            document.getElementById("confirmRedeemBtn").setAttribute("data-item-id", itemId);
            document.getElementById("confirmRenewBtn").setAttribute("data-item-id", itemId);

            // Open selection modal
            var selectionModal = new bootstrap.Modal(document.getElementById("selectionModal"));
            selectionModal.show();
        }
    });

    // ✅ Open Redeem Modal after clicking "Redeem"
    document.getElementById("confirmRedeemBtn").addEventListener("click", function () {
        closeModal("selectionModal");

        let pawnticketId = this.getAttribute("data-pawnticket-id");
        let itemId = this.getAttribute("data-item-id");

        if (!pawnticketId || !itemId) {
            alert("❌ Error: Pawnticket ID or Item ID is missing!");
            return;
        }

        console.log("✅ Fetching redeem value for Pawnticket ID:", pawnticketId);

        // ✅ Fetch the redeem value based on item value + interest%
        fetch(`http://127.0.0.1/PAWNSHOPPP/php/get_pawnticket_by_item.php?item_id=${itemId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    let redeemValue = parseFloat(data.item_value) + (parseFloat(data.item_value) * (parseFloat(data.interest) / 100));
                    document.getElementById("RedeemValue").value = redeemValue.toFixed(2);
                } else {
                    alert("❌ Error fetching redeem value: " + data.message);
                }
            })
            .catch(error => console.error("❌ Fetch Error:", error));

        // Open the Redeem Modal
        setTimeout(() => {
            var RedeemModal = new bootstrap.Modal(document.getElementById("RedeemModal"));
            RedeemModal.show();
        }, 300);
    });

    // ✅ Handle Redeem Form Submission
    document.getElementById("redeemForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let pawnticketId = document.getElementById("confirmRedeemBtn").getAttribute("data-pawnticket-id");
        let RedeemValue = document.getElementById("RedeemValue").value.trim();

        if (!pawnticketId || !RedeemValue || isNaN(RedeemValue) || RedeemValue <= 0) {
            alert("❌ Error: Invalid Redeemed Value!");
            return;
        }

        console.log(`✅ Submitting Redeem Request - Pawnticket ID: ${pawnticketId}, Amount Paid: ${RedeemValue}`);

        // ✅ Send request to redeem.php
        fetch(`http://127.0.0.1/PAWNSHOPPP/php/redeem.php?pawnticket_id=${pawnticketId}&amount_paid=${RedeemValue}`)
            .then(response => response.json())
            .then(data => {
                console.log("🔄 Response from server:", data);
                if (data.status === "success") {
                    alert("✅ Item Redeemed Successfully!");
                    location.reload();
                } else {
                    alert("❌ " + data.message);
                }
            })
            .catch(error => console.error("❌ Error:", error));
    });

    // ✅ Function to close modal
    function closeModal(modalId) {
        var modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        if (modal) modal.hide();

        setTimeout(() => {
            if (!document.querySelector(".modal.show")) {
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.classList.remove('modal-open');
            }
        }, 300);
    }
});
