document.addEventListener("DOMContentLoaded", function () {
    fetchAuctionedItems();
});

// FUNCTION TO FETCH AUCTIONED ITEMS
function fetchAuctionedItems() {
    fetch("http://127.0.0.1/PAWNSHOPPP/php/fetch_auctioned_items.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success" && data.items.length > 0) {
                displayAuctionedItems(data.items);
            } else {
                document.querySelector("#auctioned-items-table tbody").innerHTML = 
                    "<tr><td colspan='4' style='text-align:center;'>No auctioned items found.</td></tr>";
            }
        })
        .catch(error => console.error("Error fetching auctioned items:", error));
}

// FUNCTION TO DISPLAY AUCTIONED ITEMS IN TABLE
function displayAuctionedItems(items) {
    const tableBody = document.querySelector("#auctioned-items-table tbody");
    tableBody.innerHTML = "";

    items.forEach(item => {
        const row = `
            <tr>
                <td>${item.Item_ID}</td>
                <td>${item.Description}</td>
                <td>${item.Item_Value}</td>
                <td>${item.Net_Value}</td>
                <td>
                    <button class="btn btn-warning sold-btn" data-item-id="${item.Item_ID}">SOLD</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    initSoldButtons();
}
