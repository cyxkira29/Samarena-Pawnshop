document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Renew Script Loaded!");

    // Ensure Renew Button Fetches Correct Data
    document.getElementById("confirmRenewBtn").addEventListener("click", function () {
        const itemId = this.getAttribute("data-item-id");
        console.log(`✅ Renew Button Clicked - Item ID: ${itemId}`);

        if (!itemId) {
            alert("❌ Error: Missing Item ID.");
            return;
        }

        fetch(`http://127.0.0.1/PAWNSHOPPP/php/get_pawnticket_by_item.php?item_id=${itemId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById("renewPawnticketId").value = data.pawnticket_id;

                    let selectionModalEl = document.getElementById("selectionModal");
                    let selectionModal = bootstrap.Modal.getInstance(selectionModalEl);
                    if (selectionModal) selectionModal.hide();

                    setTimeout(() => {
                        document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
                        document.body.classList.remove("modal-open");

                        let renewModalEl = document.getElementById("renewModal");
                        let oldInstance = bootstrap.Modal.getInstance(renewModalEl);
                        if (oldInstance) oldInstance.dispose();

                        let renewModal = new bootstrap.Modal(renewModalEl);
                        renewModal.show();

                        // ✅ Automatically Set Date Paid to Today
                        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
                        document.getElementById("datePaid").value = today;

                    }, 300);
                } else {
                    alert("❌ Error: " + data.message);
                }
            })
            .catch(error => {
                console.error("❌ Fetch Error:", error);
                alert("❌ Network error. Please try again.");
            });
    });

    // Ensure form validation and submission
    document.getElementById("renewForm").addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("🔍 Checking input values before submission:");
        console.log("amount_Paid:", document.getElementById("amount_Paid").value.trim());

        const renewData = {
            pawnticket_id: document.getElementById("renewPawnticketId").value.trim(),
            new_principal: document.getElementById("newPrincipal").value.trim(),
            maturity_date: document.getElementById("maturityDate").value.trim(),
            expiration_date: document.getElementById("expirationDate").value.trim(),
            penalty: document.getElementById("penalty").value.trim(),
            date_paid: document.getElementById("datePaid").value.trim(), // ✅ Auto-filled Date Paid
            amount_paid: document.getElementById("amount_Paid").value.trim() || "0",
            payment_type: document.getElementById("paymentType").value.trim()
        };

        let emptyFields = Object.entries(renewData).filter(([key, value]) => !value);
        if (emptyFields.length > 0) {
            alert("❌ Please fill in all required fields: " + emptyFields.map(([key]) => key).join(", "));
            return;
        }

        fetch("http://127.0.0.1/PAWNSHOPPP/php/process_renew.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(renewData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert(`✅ Renewal successful! New Pawn Ticket ID: ${data.new_pawnticket_id}`);
                let renewModalEl = document.getElementById("renewModal");
                let renewModal = bootstrap.Modal.getInstance(renewModalEl);
                if (renewModal) renewModal.hide();
                setTimeout(() => location.reload(), 300);
            } else {
                alert("❌ Error: " + data.message);
            }
        })
        .catch(error => console.error("❌ Error:", error));
    });
});
