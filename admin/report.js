let orderHistory = JSON.parse(localStorage.getItem("OrderHistory")) || [];
let customers = JSON.parse(localStorage.getItem("Customers")) || [];
let cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];

function generateReport() {
    const month = document.getElementById("monthSelector").value;
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();
    const monthToUse = month || currentMonth;

    let totalSales = 0;
    let totalOrders = 0;
    let itemSales = {};
    let bestCustomer = { name: '', totalSpent: 0 };
    let bestCashier = { name: '', totalSales: 0 };
    let customerSalesData = {};
    let cashierSalesData = {};

    orderHistory.forEach(order => {
        const orderDate = new Date(order.date);
        if (String(orderDate.getMonth() + 1) === monthToUse && orderDate.getFullYear() === currentYear) {
            totalSales += order.totalPrice;
            totalOrders++;

            order.items.forEach(item => {
                itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
            });

            const customer = customers.find(c => c.id === order.customerId);
            if (customer) {
                customerSalesData[customer.name] = (customerSalesData[customer.name] || 0) + order.totalPrice;
                if (customerSalesData[customer.name] > bestCustomer.totalSpent) {
                    bestCustomer = { name: customer.name, totalSpent: customerSalesData[customer.name] };
                }
            }

            const cashier = cashiers.find(c => c.id === order.cashierId);
            if (cashier) {
                cashierSalesData[cashier.name] = (cashierSalesData[cashier.name] || 0) + order.totalPrice;
                if (cashierSalesData[cashier.name] > bestCashier.totalSales) {
                    bestCashier = { name: cashier.name, totalSales: cashierSalesData[cashier.name] };
                }
            }
        }
    });

    displayReport(totalSales, totalOrders, itemSales, bestCustomer, bestCashier, customerSalesData, cashierSalesData);
}

function displayReport(totalSales, totalOrders, itemSales, bestCustomer, bestCashier, customerSalesData, cashierSalesData) {
    const summaryContainer = document.getElementById("summary");
    summaryContainer.innerHTML = `
        <p><strong>Total Sales:</strong> LKR ${totalSales.toFixed(2)}</p>
        <p><strong>Total Orders:</strong> ${totalOrders}</p>
        <p class="winner">Best Customer: ${bestCustomer.name} (LKR ${bestCustomer.totalSpent.toFixed(2)})</p>
        <p class="winner">Best Cashier: ${bestCashier.name} (LKR ${bestCashier.totalSales.toFixed(2)})</p>
    `;

    const itemSalesBody = document.getElementById("itemSalesBody");
    itemSalesBody.innerHTML = '';
    for (const item in itemSales) {
        itemSalesBody.innerHTML += `
            <tr>
                <td>${item}</td>
                <td>${itemSales[item]}</td>
            </tr>
        `;
    }

    const customerSalesList = document.getElementById("customerSalesList");
    customerSalesList.innerHTML = '';
    for (const customer in customerSalesData) {
        customerSalesList.innerHTML += `<li class="list-group-item">${customer}: LKR ${customerSalesData[customer].toFixed(2)}</li>`;
    }

    const cashierSalesList = document.getElementById("cashierSalesList");
    cashierSalesList.innerHTML = '';
    for (const cashier in cashierSalesData) {
        cashierSalesList.innerHTML += `<li class="list-group-item">${cashier}: LKR ${cashierSalesData[cashier].toFixed(2)}</li>`;
    }

    const monthlySummary = document.getElementById("monthlySummary");
    monthlySummary.classList.remove("d-none");
    document.getElementById("bestCustomer").innerText = bestCustomer.name || "N/A";
    document.getElementById("bestCashier").innerText = bestCashier.name || "N/A";
    document.getElementById("totalSales").innerText = totalSales.toFixed(2);
    document.getElementById("bestSellingItem").innerText = Object.keys(itemSales).length > 0 ? Object.keys(itemSales).reduce((a, b) => itemSales[a] > itemSales[b] ? a : b) : "N/A";
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Monthly Sales Report", 14, 22);
    doc.setFontSize(12);

    doc.text("Summary:", 14, 35);
    doc.text(`Best Customer: ${document.getElementById("bestCustomer").innerText}`, 14, 42);
    doc.text(`Best Cashier: ${document.getElementById("bestCashier").innerText}`, 14, 49);
    doc.text(`Total Sales: LKR ${document.getElementById("totalSales").innerText}`, 14, 56);
    doc.text(`Best Selling Item: ${document.getElementById("bestSellingItem").innerText}`, 14, 63);

    doc.text("Item Sales Quantity:", 14, 73);
    const items = document.querySelectorAll("#itemSalesBody tr");
    let yPosition = 80;

    items.forEach((item, index) => {
        const itemName = item.cells[0].innerText;
        const quantitySold = item.cells[1].innerText;
        doc.text(`${index + 1}. ${itemName} - Quantity Sold: ${quantitySold}`, 14, yPosition);
        yPosition += 7;
    });

    doc.text("Customer Sales:", 14, yPosition);
    yPosition += 10;
    const customerSales = document.querySelectorAll("#customerSalesList li");
    customerSales.forEach((customer, index) => {
        doc.text(`${index + 1}. ${customer.innerText}`, 14, yPosition);
        yPosition += 7;
    });

    doc.text("Cashier Sales:", 14, yPosition);
    yPosition += 10;
    const cashierSales = document.querySelectorAll("#cashierSalesList li");
    cashierSales.forEach((cashier, index) => {
        doc.text(`${index + 1}. ${cashier.innerText}`, 14, yPosition);
        yPosition += 7;
    });

    doc.save('Monthly_Sales_Report.pdf');
}

window.onload = function() {
    document.getElementById("monthSelector").value = '';
    generateReport();
};
