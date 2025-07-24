document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Fetching Redeemed Items Script Loaded!");

    const searchBar = document.getElementById("searchBar");
    const categoryFilter = document.getElementById("categoryFilter");
    const clearFilters = document.getElementById("clearFilters");
    const tableBody = document.getElementById("redeemedItemsTable");

    function fetchRedeemedItems() {
        const searchValue = searchBar.value.trim().toLowerCase();
        const categoryValue = categoryFilter.value.toLowerCase();

        fetch("http://127.0.0.1/PAWNSHOPPP/php/fetch_redeemed_items.php")
            .then(response => response.json())
            .then(data => {
                console.log("Redeemed Items Data:", data);
                tableBody.innerHTML = "";

                if (data.status === "success" && Array.isArray(data.items) && data.items.length > 0) {
                    data.items.forEach((item, index) => {
                        const pawnTicketNumber = item.Pawnticket_ID ? item.Pawnticket_ID.toString().toLowerCase() : "";
                        const category = item.Category ? item.Category.toLowerCase() : "no category";
                        
                        const matchesSearch = searchValue === "" || pawnTicketNumber.includes(searchValue);
                        const matchesCategory = categoryValue === "" || category === categoryValue;

                        if (matchesSearch && matchesCategory) {
                            const row = document.createElement("tr");
                            row.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff"; 
                            row.innerHTML = `
                                <td>${item.Redeemed_ID}</td>
                                <td>${item.Pawnticket_ID}</td>
                                <td>₱${parseFloat(item.Item_Value).toFixed(2)}</td>
                                <td>${item.Description}</td>
                                <td>${item.Category}</td>
                                <td>₱${parseFloat(item.Redeemed_Value).toFixed(2)}</td>
                                <td>${new Date(item.Redeemed_Date).toLocaleString()}</td>
                            `;
                            tableBody.appendChild(row);
                        }
                    });
                } else {
                    tableBody.innerHTML = "<tr><td colspan='7' class='text-center'>No redeemed items found</td></tr>";
                }
            })
            .catch(error => console.error("❌ Error fetching redeemed items:", error));
    }

    // Event Listeners for Filters
    searchBar.addEventListener("input", fetchRedeemedItems);
    categoryFilter.addEventListener("change", fetchRedeemedItems);
    clearFilters.addEventListener("click", () => {
        searchBar.value = "";
        categoryFilter.value = "";
        fetchRedeemedItems();
    });

    fetchRedeemedItems();
});
