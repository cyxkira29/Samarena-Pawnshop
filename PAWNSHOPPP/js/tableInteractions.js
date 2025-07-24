document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Table Interaction Script Loaded!");

    document.querySelectorAll(".clickable-row").forEach(row => {
        row.addEventListener("click", function () {
            let rowId = this.getAttribute("data-id");
            let expandableRow = document.getElementById("expand-" + rowId);
            let extraInfoDiv = expandableRow.querySelector(".extra-info");
            let loadingText = expandableRow.querySelector(".loading-text");

            if (expandableRow.style.display === "none") {
                expandableRow.style.display = "table-row";
                loadingText.style.display = "block"; // Show "loading" message

                // Fetch additional details from PHP
                fetch(`http://127.0.0.1/PAWNSHOPPP/php/fetch_pawned_details.php?item_id=${rowId}`)
                    .then(response => response.json())
                    .then(data => {
                        loadingText.style.display = "none"; // Hide loading message

                        if (data.status === "success") {
                            extraInfoDiv.innerHTML = `
                                <ul>
                                    <li>Email: ${data.email || 'N/A'}</li>
                                    <li>Phone: ${data.phone || 'N/A'}</li>
                                    <li>Occupation: ${data.occupation || 'N/A'}</li>
                                </ul>
                            `;
                        } else {
                            extraInfoDiv.innerHTML = `<p class="text-danger">⚠ Failed to load details.</p>`;
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching details:", error);
                        loadingText.style.display = "none";
                        extraInfoDiv.innerHTML = `<p class="text-danger">⚠ Error loading data.</p>`;
                    });

            } else {
                expandableRow.style.display = "none"; // Hide row when clicked again
            }
        });
    });
});
