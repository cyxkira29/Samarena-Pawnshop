document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Fetching Pawned Items Script Loaded!");

    const searchBar = document.getElementById("searchBar");
    const categoryFilter = document.getElementById("categoryFilter");
    const clearFilters = document.getElementById("clearFilters");
    const tableBody = document.getElementById("pawnedItemsTable");

    function fetchFilteredItems() {
        const searchValue = searchBar.value.trim().toLowerCase();
        const categoryValue = categoryFilter.value.toLowerCase();

        fetch("http://127.0.0.1/PAWNSHOPPP/php/fetch_pawned_items.php")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data);

                if (data.status === "success" && Array.isArray(data.items)) {
                    tableBody.innerHTML = "";

                    data.items.forEach((item, index) => {
                        const pawnTicketNumber = item.Pawnticket_ID ? item.Pawnticket_ID.toString().toLowerCase() : "";
                        const itemId = item.Item_ID || "N/A";
                        const category = item.Category || "No Category";
                        const maturityDate = item.Maturity_Date ? new Date(item.Maturity_Date).toLocaleDateString() : "No Date";
                        const expiryDate = item.Expiry_Date ? new Date(item.Expiry_Date).toLocaleDateString() : "No Date";
                        const interest = item.Interest !== null ? `${item.Interest}%` : "No Interest";

                        const matchesSearch = searchValue === "" || pawnTicketNumber.includes(searchValue);
                        const matchesCategory = categoryValue === "" || category.toLowerCase() === categoryValue;

                        if (matchesSearch && matchesCategory) {
                            const row = document.createElement("tr");
                            row.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff"; 
                            row.innerHTML = `
                                <td>${itemId}</td>
                                <td>${pawnTicketNumber}</td>
                                <td>${category}</td>
                                <td>${item.Description || 'N/A'}</td>
                                <td>${item.Item_Value || 'N/A'}</td>
                                <td>${interest}</td>
                                <td>${item.Net_Value || 'N/A'}</td>
                                <td>${maturityDate}</td>
                                <td>${expiryDate}</td>
                                <td>
                                    <button class="btn btn-warning move-btn" 
                                        data-item-id="${item.Item_ID}" 
                                        data-pawnticket-id="${item.Pawnticket_ID}">
                                        Move to Auction
                                    </button>

                                    <button class="btn btn-primary update-btn" 
                                        data-item-id="${item.Item_ID}" 
                                        data-pawnticket-id="${item.Pawnticket_ID}"  
                                        data-bs-toggle="modal" data-bs-target="#updateModal">
                                        Update
                                    </button>
                                </td>   
                            `;
                            tableBody.appendChild(row);

                            const expandableRow = document.createElement("tr");
                            expandableRow.classList.add("expandable-row");
                            expandableRow.id = "expand-" + itemId;
                            expandableRow.style.display = "none";
                            expandableRow.innerHTML = `
                                <td colspan="10" class="text-center text-muted">🔄 Loading details...</td>
                            `;
                            tableBody.appendChild(expandableRow);

                            row.addEventListener("click", function () {
                                let expandableRow = document.getElementById("expand-" + itemId);
                                if (expandableRow.style.display === "none") {
                                    expandableRow.style.display = "table-row";
                                    fetch(`http://127.0.0.1/PAWNSHOPPP/php/fetch_pawned_details.php?item_id=${itemId}`)
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.status === "success") {
                                                expandableRow.innerHTML = `
                                                    <td>${data.item_id || 'N/A'}</td>
                                                    <td>${data.pawnticket_id || 'N/A'}</td>
                                                    <td>${data.category || 'N/A'}</td>
                                                    <td>${data.description || 'N/A'}</td>
                                                    <td>${data.item_value || 'N/A'}</td>
                                                    <td>${data.interest || 'N/A'}%</td>
                                                    <td>${data.net_value || 'N/A'}</td>
                                                    <td>${data.maturity_date ? new Date(data.maturity_date).toLocaleDateString() : 'N/A'}</td>
                                                    <td>${data.expiry_date ? new Date(data.expiry_date).toLocaleDateString() : 'N/A'}</td>
                                                `;
                                            } else {
                                                expandableRow.innerHTML = `<td colspan="10" class="text-center text-danger">❌ No additional details found.</td>`;
                                            }
                                        })
                                        .catch(error => {
                                            console.error("Error fetching details:", error);
                                            expandableRow.innerHTML = `<td colspan="10" class="text-center text-danger">❌ Error fetching details.</td>`;
                                        });
                                } else {
                                    expandableRow.style.display = "none";
                                }
                            });
                        }
                    });

                    attachMoveToAuctionEventListeners();
                    attachUpdateEventListeners();
                } else {
                    tableBody.innerHTML = "<tr><td colspan='10' class='text-center'>No items found.</td></tr>";
                }
            })
            .catch(error => console.error("Error fetching pawned items:", error));
    }

    searchBar.addEventListener("input", fetchFilteredItems);
    categoryFilter.addEventListener("change", fetchFilteredItems);
    clearFilters.addEventListener("click", () => {
        searchBar.value = "";
        categoryFilter.value = "";
        fetchFilteredItems();
    });

    fetchFilteredItems();
});
