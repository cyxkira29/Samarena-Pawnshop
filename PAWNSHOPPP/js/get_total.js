fetch('http://127.0.0.1/PAWNSHOPPP/php/get_totals.php')
    .then(response => response.json())
    .then(data => {
        document.getElementById("totalPawned").innerText = data.total_pawned;
        document.getElementById("totalAuctioned").innerText = data.total_auctioned;
        document.getElementById("totalSold").innerText = data.total_sold;
    })
    .catch(error => console.error('Error fetching totals:', error));
