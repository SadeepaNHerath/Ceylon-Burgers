function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("OrderHistory")) || [];
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; 

    orders.forEach((order, index) => {
        const card = document.createElement('div');
        card.classList.add('col');

        card.innerHTML = `
            <div class="card order-card bg-warning text-dark clickable" onclick="toggleOrderDetails(${index})" style="border: 2px solid #ffcc00;">
                <div class="card-body">
                    <h5 class="card-title">🍔 Order ID: ${order.orderId}</h5>
                    <p class="card-text">📅 Date: ${order.date}</p>
                    <p class="card-text fw-bold">💰 Total Price: LKR ${order.totalPrice}</p>
                </div>
                <div id="order-details-${index}" class="card-footer d-none bg-light text-dark">
                    <h6 class="fw-bold">Order Items:</h6>
                    <ul class="list-unstyled">
                        ${order.items.map(item => `<li>🍔 ${item.name} - Qty: ${item.quantity}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        ordersContainer.appendChild(card);
    });
}

function toggleOrderDetails(orderIndex) {
    const orderDetails = document.getElementById(`order-details-${orderIndex}`);
    orderDetails.classList.toggle('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach(card => {
        card.style.cursor = 'pointer';
    });
});
