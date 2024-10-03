document.addEventListener('DOMContentLoaded', function () {
    loadItems();
    setupSearch();
});

const addItemBtn = document.getElementById('addItemBtn');
const addItemForm = document.getElementById('addItemForm');
const itemForm = document.getElementById('itemForm');
let editMode = false; 
let editingItemId = null;

function toggleAddItemForm() {
    addItemForm.classList.toggle('d-none');
    addItemBtn.classList.toggle('d-none');

    if (addItemForm.classList.contains('d-none')) {
        resetForm(); 
    } else {
        if (!editMode) {
            generateItemId(); 
        }
        window.scrollTo(0, 0); 
    }
}

function generateItemId() {
    const category = document.getElementById('itemCategory').value;
    let items = JSON.parse(localStorage.getItem('Items')) || [];
    const prefix = category.slice(0, 3).toUpperCase(); 
    let nextId = 1;

    items.forEach(item => {
        if (item.id.startsWith(prefix)) {
            const num = parseInt(item.id.slice(3));
            if (num >= nextId) {
                nextId = num + 1;
            }
        }
    });

    const newId = `${prefix}${String(nextId).padStart(3, '0')}`;
    document.getElementById('itemId').value = newId;
}

function loadItems() {
    const itemsTableBody = document.getElementById('itemsTableBody');
    itemsTableBody.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('Items')) || [];

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.discount + '%' || 'No Discount'}</td>
            <td>${item.expiration_date || 'N/A'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteItem('${item.id}')">Delete</button>
            </td>
        `;
        itemsTableBody.appendChild(row);
    });
}

function addItem() {
    const itemId = document.getElementById('itemId').value;
    const itemName = document.getElementById('itemName').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemDiscount = document.getElementById('itemDiscount').value;
    const itemImageUrl = document.getElementById('itemImageUrl').value;
    const itemExpiration = document.getElementById('itemExpiration').value;

    if (!itemName || !itemQuantity || !itemPrice) {
        alert('Please fill in all required fields.');
        return;
    }

    const newItem = {
        id: itemId,
        name: itemName,
        category: itemCategory,
        quantity: parseInt(itemQuantity),
        price: parseFloat(itemPrice),
        discount: itemDiscount || null, 
        img_url: itemImageUrl || '../img/items.jpeg', 
        expiration_date: itemExpiration || 'N/A'
    };

    let items = JSON.parse(localStorage.getItem('Items')) || [];

    if (editMode) {
        items = items.map(item => (item.id === editingItemId ? newItem : item));
        alert('Item updated successfully!');
    } else {
        items.push(newItem);
        alert('Item added successfully!');
    }

    localStorage.setItem('Items', JSON.stringify(items));
    loadItems();
    resetForm(); 
    toggleAddItemForm(); 
}

function editItem(itemId) {
    const items = JSON.parse(localStorage.getItem('Items')) || [];
    const item = items.find(item => item.id === itemId);

    if (item) {
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category; 
        document.getElementById('itemQuantity').value = item.quantity;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemDiscount').value = item.discount || ''; 
        document.getElementById('itemImageUrl').value = item.img_url; 
        document.getElementById('itemExpiration').value = item.expiration_date === 'N/A' ? '' : item.expiration_date;

        editMode = true; 
        editingItemId = itemId; 

        toggleAddItemForm(); 
    }
}

function confirmDeleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        deleteItem(itemId);
    }
}

function deleteItem(itemId) {
    let items = JSON.parse(localStorage.getItem('Items')) || [];
    items = items.filter(item => item.id !== itemId);
    localStorage.setItem('Items', JSON.stringify(items));
    loadItems();
    alert('Item deleted successfully!');
}

function resetForm() {
    itemForm.reset();
    document.getElementById('itemId').value = '';
    editMode = false; 
    editingItemId = null; 
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);
}

function filterItems() {
    const itemsTableBody = document.getElementById('itemsTableBody');
    const items = JSON.parse(localStorage.getItem('Items')) || [];

    itemsTableBody.innerHTML = ''; 

    const categoryFilter = document.getElementById('categoryFilter').value; 
    const categoryPrefix = categoryFilter.slice(0, 3).toUpperCase(); 

    const filteredItems = items.filter(item => {
        const matchesCategory = categoryFilter === '' || item.id.startsWith(categoryPrefix);
        return matchesCategory;
    });

    filteredItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.discount || 'No Discount'}</td>
            <td>${item.expiration_date || 'N/A'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteItem('${item.id}')">Delete</button>
            </td>
        `;
        itemsTableBody.appendChild(row);
    });
}
