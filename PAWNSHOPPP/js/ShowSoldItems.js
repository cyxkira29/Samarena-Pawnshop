document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost/PAWNSHOPPP/php/get_sold_items.php")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("soldItemsTable");
            tableBody.innerHTML = "";

            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.Sold_ID}</td>
                    <td>${item.Item_ID}</td>
                    <td>₱${parseFloat(item.Sale_Price).toFixed(2)}</td>
                    <td>${new Date(item.Sold_Date).toLocaleDateString()}</td>
                    <td>${item.Customer_Name}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching sold items:", error));
});