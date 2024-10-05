let orderHistory = JSON.parse(localStorage.getItem("OrderHistory")) || [];
let customers = JSON.parse(localStorage.getItem("Customers")) || [];
let cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];

function loadOrders() {
    const filterDate = document.getElementById('filterDate').value;
    const filterCustomer = document.getElementById('filterCustomer').value;
    const filterCashier = document.getElementById('filterCashier').value;

    const filteredOrders = orderHistory
        .filter(order => {
            const orderDate = new Date(order.date).toISOString().split('T')[0];  
            const matchesDate = !filterDate || orderDate === filterDate;
            const matchesCustomer = !filterCustomer || order.customerId === filterCustomer;
            const matchesCashier = !filterCashier || order.cashierId === filterCashier;
            return matchesDate && matchesCustomer && matchesCashier;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));  

    displayOrders(filteredOrders);
}

function displayOrders(orders) {
    const ordersTableBody = document.getElementById('ordersTableBody');
    ordersTableBody.innerHTML = '';

    orders.forEach(order => {
        const itemList = order.items.map(item => `${item.name} (${item.quantity})`).join(', ');

        const row = `
            <tr>
                <td>${order.orderId}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.customerId}</td>
                <td>${order.cashierId}</td>
                <td>${itemList}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
            </tr>
        `;
        ordersTableBody.innerHTML += row;
    });
}

function populateDropdowns() {
    const customerFilter = document.getElementById('filterCustomer');
    const cashierFilter = document.getElementById('filterCashier');

    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.id;
        customerFilter.appendChild(option);
    });

    cashiers.forEach(cashier => {
        const option = document.createElement('option');
        option.value = cashier.id;
        option.textContent = cashier.id;
        cashierFilter.appendChild(option);
    });
}


function filterOrders() {
    loadOrders();
}

window.onload = function () {
    populateDropdowns();
    loadOrders();
};
