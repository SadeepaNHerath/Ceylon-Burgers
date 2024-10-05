let foodItems = JSON.parse(localStorage.getItem("Items")) || [];
let customers = JSON.parse(localStorage.getItem("Customers")) || [];
let cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];
let orderHistory = JSON.parse(localStorage.getItem("OrderHistory")) || [];

let currentOrder = [];
let totalSales = 0;
let totalOrders = 0;
let discountItemsCount = 0;
let currentCustomer = null;

function suggestItems() {
    let input = document.getElementById('itemInput').value.toLowerCase();
    let suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';

    if (input.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }

    let suggestions = foodItems.filter(item =>
        item.id.toLowerCase().startsWith(input) || item.name.toLowerCase().startsWith(input)
    );

    if (suggestions.length > 0) {
        suggestionsList.style.display = 'block';
        suggestions.forEach(item => {
            let suggestionItem = document.createElement('li');
            suggestionItem.classList.add('list-group-item');
            suggestionItem.textContent = `${item.name} (LKR ${item.price}, Quantity: ${item.quantity})`;

            suggestionItem.onclick = () => {
                document.getElementById('itemInput').value = item.name;
                suggestionsList.style.display = 'none'; 
            };

            suggestionsList.appendChild(suggestionItem);
        });
    } else {
        suggestionsList.style.display = 'none';
    }
}

function suggestCustomers() {
    let input = document.getElementById('customerPhone').value.toLowerCase();
    let suggestionsList = document.getElementById('customerSuggestions');
    suggestionsList.innerHTML = '';

     if (input.length === 0) {
        suggestionsList.style.display = 'none';
        return;
    }

    let suggestions = customers.filter(customer =>
        customer.phone.toLowerCase().startsWith(input) || customer.name.toLowerCase().startsWith(input)
    );

    if (suggestions.length > 0) {
        suggestionsList.style.display = 'block';
        suggestions.forEach(customer => {
            let suggestionItem = document.createElement('li');
            suggestionItem.classList.add('list-group-item');
            suggestionItem.textContent = `${customer.name} (Phone: ${customer.phone}, ID: ${customer.id})`;

            suggestionItem.onclick = () => {
                document.getElementById('customerPhone').value = customer.phone;
                currentCustomer = customer;
                suggestionsList.innerHTML = '';
                suggestionsList.style.display = 'none';
                document.getElementById('newCustomerForm').style.display = 'none';
                document.getElementById('newCustomerCheckbox').checked = false;
            };

            suggestionsList.appendChild(suggestionItem);
        });
    } else {
        suggestionsList.style.display = 'none';
    }
}

function toggleNewCustomerForm() {
    let newCustomerForm = document.getElementById('newCustomerForm');
    let isChecked = document.getElementById('newCustomerCheckbox').checked;

    if (isChecked) {
        newCustomerForm.style.display = 'block';
        currentCustomer = null;
    } else {
        newCustomerForm.style.display = 'none';
    }
}

function addNewCustomer() {
    let customerName = document.getElementById('customerName').value;
    let customerPhone = document.getElementById('customerPhoneNew').value;

    if (!customerName || !customerPhone) {
        alert("Please fill in customer name and phone.");
        return;
    }
    
    let customerId;
    if (customers.length > 0) {
        let lastCustomerId = customers[customers.length - 1].id;
        let lastIdNumber = parseInt(lastCustomerId.replace('CUS', ''), 10);
        customerId = `CUS${(lastIdNumber + 1).toString().padStart(3, '0')}`;
    } else {
        customerId = 'CUS001'; 
    }

    let newCustomer = {
        id: customerId,
        name: customerName,
        phone: customerPhone,
        orderCount: 0, 
        totalSpent: 0
    };

    customers.push(newCustomer);
    localStorage.setItem("Customers", JSON.stringify(customers));
    return newCustomer;
}


function incrementQuantity() {
    let quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function addItemToOrder() {
    let itemName = document.getElementById('itemInput').value;
    let item = foodItems.find(item => item.name === itemName);

    if (item) {
         const currentDate = new Date();
        const expirationDate = new Date(item.expiration_date);

        if (expirationDate < currentDate) {
            alert(`${item.name} is expired! You cannot add it to the order.`);
            return;  
        }

        let quantityInput = document.getElementById('quantity');
        let quantityToAdd = parseInt(quantityInput.value) || 1;

        if (item.quantity >= quantityToAdd) {
            let itemToAdd = { ...item, quantity: quantityToAdd };
            currentOrder.push(itemToAdd);
            totalSales += item.discount ? item.price * (1 - item.discount / 100) * quantityToAdd : item.price * quantityToAdd;
            totalOrders++;
            if (item.discount) discountItemsCount++;
            updateOrderList();
            document.getElementById('itemInput').value = '';
            quantityInput.value = '1';
        } else {
            alert(`Not enough quantity available! Only ${item.quantity} left.`);
        }
    } else {
        alert("Item not found! Please select an item from suggestions.");
    }
}


function updateOrderList() {
    let orderList = document.getElementById('order-summary');
    orderList.innerHTML = '';

    currentOrder.forEach((item, index) => {
        let orderItem = document.createElement('li');
        orderItem.classList.add('list-group-item');
        orderItem.textContent = `${item.name} (Quantity: ${item.quantity}) - LKR ${item.price * item.quantity}`;

        let quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = 1;
        quantityInput.style.width = '60px';
        quantityInput.classList.add('ms-2');

        let updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('btn', 'btn-info', 'ms-2');
        updateButton.onclick = () => updateItemQuantity(item.id, parseInt(quantityInput.value)); 

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('btn', 'btn-danger', 'ms-2');
        removeButton.onclick = () => removeItemFromOrder(index);

        orderItem.appendChild(quantityInput);
        orderItem.appendChild(updateButton);
        orderItem.appendChild(removeButton);
        orderList.appendChild(orderItem);
    });

    updateSummary();
}

function updateSummary() {
    let orderTotal = 0;

    currentOrder.forEach(orderItem => {
        let itemPrice = orderItem.discount ? orderItem.price * (1 - orderItem.discount / 100) : orderItem.price;
        let itemTotal = itemPrice * orderItem.quantity;
        orderTotal += itemTotal;
    });

    document.getElementById('order-total').textContent = orderTotal.toFixed(2);

    let amountGiven = parseFloat(document.getElementById('amountGiven').value) || 0;

    let changeAmount = amountGiven - orderTotal;
    document.getElementById('change-amount').textContent = changeAmount >= 0 ? changeAmount.toFixed(2) : "0.00";

    totalSales = orderTotal;
}

function updateItemQuantity(itemId, newQuantity) {
    let item = currentOrder.find(orderItem => orderItem.id === itemId);

    if (!item) {
        alert('Item not found in the current order.');
        return;
    }

    if (newQuantity <= item.quantity) { 
        totalSales -= item.price * item.quantity; 
        item.quantity = newQuantity; 
        totalSales += item.discount ? item.price * (1 - item.discount / 100) * newQuantity : item.price * newQuantity;
        updateOrderList(); 
    } else {
        alert(`Not enough quantity available! Only ${item.quantity} left in stock.`);
    }
}

function removeItemFromOrder(index) {
    let item = currentOrder[index];
    totalSales -= item.price * item.quantity;
    currentOrder.splice(index, 1);
    updateOrderList();
}

function placeOrder() {
    let amountGivenInput = document.getElementById('amountGiven');
    let amountGiven = parseFloat(amountGivenInput.value) || 0;
    let orderTotal = parseFloat(document.getElementById('order-total').textContent);
    let itemsOrdered = currentOrder.items || [];


    if (currentOrder.length === 0) {
        alert("Your order is empty!");
        return;
    }

    if (amountGiven < totalSales) {
        alert("Insufficient amount given!");
        return;
    }

    let customer = currentCustomer;

    if (!customer && document.getElementById('newCustomerCheckbox').checked) {
        customer = addNewCustomer(); 
    }

    if (!customer) {
        alert("Please select or add a customer.");
        return;
    }

    let orderId = `ORD${(orderHistory.length + 1).toString().padStart(3, '0')}`;
    let cashierId = 'CASH001';

    let availableItems = JSON.parse(localStorage.getItem("AvailableItems")) || [];

    currentOrder.forEach(orderItem => {
        let itemIndex = availableItems.findIndex(availableItem => availableItem.name === orderItem.name);

        if (itemIndex !== -1) {
            let availableItem = availableItems[itemIndex];

            if (availableItem.quantity >= orderItem.quantity) {
                availableItem.quantity -= orderItem.quantity; 
            } else {
                alert(`Not enough stock for ${orderItem.name}. Available quantity: ${availableItem.quantity}`);
                return; 
            }
        }
    });

    localStorage.setItem("AvailableItems", JSON.stringify(availableItems));

    let newOrder = {
        orderId,
        date: new Date().toISOString().split('T')[0], 
        customerId: customer.id,
        cashierId,
        items: currentOrder.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        })),
        totalPrice: totalSales,
    };

    customer.orderCount = (customer.orderCount || 0) + 1;
    customer.totalSpent += totalSales;

    let cashier = cashiers.find(cashier => cashier.id === cashierId);
    if (cashier) {
        cashier.orderCount = (cashier.orderCount || 0) + 1;
        cashier.totalSales += totalSales;
    }

    localStorage.setItem("Cashiers", JSON.stringify(cashiers)); 
    localStorage.setItem("Customers", JSON.stringify(customers)); 

    
    orderHistory.push(newOrder);
    localStorage.setItem("OrderHistory", JSON.stringify(orderHistory)); 

    reduceItemQuantities(itemsOrdered);

   
    currentOrder = [];
    totalSales = 0;
    totalOrders++;
    discountItemsCount = 0;

    updateDashboardTotals(); 
    updateTotals(orderTotal, itemsOrdered);
    clearForm(); 

    alert(`Order placed successfully! Order ID: ${orderId}`);
}

function clearForm() {
    document.getElementById('customerPhone').value = '';  
    document.getElementById('customerName').value = '';   
    document.getElementById('customerPhoneNew').value = ''; 
    document.getElementById('itemInput').value = '';      
    document.getElementById('quantity').value = 1;       
    document.getElementById('amountGiven').value = '';    
    document.getElementById('order-summary').innerHTML = ''; 
    document.getElementById('order-total').innerText = '0';  
    document.getElementById('change-amount').innerText = '0';
}

function updateDashboardTotals() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let totalSales = 0;
    let totalOrders = orders.length;
    let discountItems = 0;

    orders.forEach(order => {
        totalSales += order.totalPrice;
        order.items.forEach(item => {
            if (item.isDiscounted) {  
                discountItems += item.quantity;
            }
        });
    });

    document.getElementById('total-sales').innerText = 'LKR ' + totalSales.toFixed(2);
    document.getElementById('total-orders').innerText = totalOrders;
    document.getElementById('discount-items').innerText = discountItems;
}

function reduceItemQuantities(itemsOrdered) {
    let storedItems = JSON.parse(localStorage.getItem('Items')) || [];

    itemsOrdered.forEach(orderedItem => {
        let itemInStock = storedItems.find(item => item.id === orderedItem.id || item.name === orderedItem.name);

        if (itemInStock) {
            if (itemInStock.quantity >= orderedItem.quantity) {
                itemInStock.quantity -= orderedItem.quantity;
            } else {
                alert(`Insufficient stock for ${orderedItem.name}. Only ${itemInStock.quantity} left.`);
            }
        } else {
            alert(`Item ${orderedItem.name} not found in stock.`);
        }
    });

    localStorage.setItem('Items', JSON.stringify(storedItems));
}


function updateTotals() {
    const orders = JSON.parse(localStorage.getItem('OrderHistory')) || [];
    const selectedCashierId = sessionStorage.getItem('selectedCashier');
    const today = new Date().toISOString().split('T')[0];  

    let totalSales = 0;
    let totalOrders = 0;
    let discountItems = 0;

    orders.forEach(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];  

         if (order.cashierId === selectedCashierId && orderDate === today) {
            totalSales += order.totalPrice; 
            totalOrders++;  
            discountItems += order.items.filter(item => item.discount).length;  
        }
    });

     document.getElementById('total-sales').textContent = `LKR ${totalSales}`;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('discount-items').textContent = discountItems;
}



window.onload = function() {
    updateDashboardTotals(); 
    updateTotals();
};

document.getElementById('itemInput').addEventListener('input', suggestItems);
document.getElementById('customerPhone').addEventListener('input', suggestCustomers);
document.getElementById('newCustomerCheckbox').addEventListener('change', toggleNewCustomerForm);
document.getElementById('amountGiven').addEventListener('input', updateSummary);

