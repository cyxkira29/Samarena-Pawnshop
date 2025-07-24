document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Event Listeners Script Loaded!");

    // Ensure all update buttons work
    document.querySelectorAll(".update-btn").forEach(button => {
        button.addEventListener("click", function () {
            const itemId = this.getAttribute("data-item-id");
            console.log(`✅ Update Button Clicked - Item ID: ${itemId}`);

            document.getElementById("confirmRenewBtn").setAttribute("data-item-id", itemId);

            let selectionModalEl = document.getElementById("selectionModal");
            let selectionModal = new bootstrap.Modal(selectionModalEl);
            selectionModal.show();
        });
    });

    // Ensure the backdrop is removed when modal closes
    document.getElementById("renewModal").addEventListener("hidden.bs.modal", function () {
        document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
        document.body.classList.remove("modal-open");
    });
});

// Function to close modal
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
