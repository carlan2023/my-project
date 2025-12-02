script// Dummy stats (replace with backend fetch)
.document
  .getElementById("totalSales").textContent = "$12,500";
document.getElementById("totalOrders").textContent = "320";
document.getElementById("stockItems").textContent = "120";
document.getElementById("pendingDeliveries").textContent = "8";
// Sales Trend Chart
new Chart(document.getElementById("salesChart"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [2000, 2500, 4000, 3500, 5000, 4500],
        borderColor: "#ff6219",
        fill: true,
        backgroundColor: "rgba(255,98,25,0.2)",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
  },
});
// Top Products Chart
new Chart(document.getElementById("topProductsChart"), {
  type: "bar",
  data: {
    labels: ["Chairs", "Tables", "Beds", "Cupboards", "Shelves"],
    datasets: [
      {
        label: "Units Sold",
        data: [120, 90, 75, 60, 50],
        backgroundColor: "#ff6219",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
  },
});
