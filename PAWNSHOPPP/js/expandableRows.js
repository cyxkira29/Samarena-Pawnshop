document.addEventListener("DOMContentLoaded", function () {
    // Hide all expandable rows initially
    document.querySelectorAll(".expandable-row").forEach(row => row.style.display = "none");

    // Add click event listener to each row in the table
    document.querySelectorAll("#pawnedItemsTable tr").forEach(mainRow => {
        mainRow.addEventListener("click", function () {
            let expandableRow = this.nextElementSibling;
            if (expandableRow && expandableRow.classList.contains("expandable-row")) {
                expandableRow.style.display = expandableRow.style.display === "none" ? "table-row" : "none";
            }
        });
    });
});
