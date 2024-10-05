function loadCashiers() {
    const cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];
    const cashiersContainer = document.getElementById('cashiersContainer');
    cashiersContainer.innerHTML = ''; 
    cashiers.forEach((cashier, index) => {
        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card text-center">
                <img src="${cashier.photo || '../img/cashier.jpg'}" class="card-img-top" style="height: 100px; width: auto; margin: auto;">
                <div class="card-body">
                    <h5 class="card-title">${cashier.name}</h5>
                    <p class="card-text">ID: ${cashier.id}<br>Phone: ${cashier.phone}<br>Address: ${cashier.address}<br>NIC: ${cashier.nic}</p>
                    <button class="btn btn-warning" onclick="editCashier(${index})">Edit</button>
                    <button class="btn btn-danger" onclick="confirmDeleteCashier(${index})">Delete</button>
                </div>
            </div>
        `;
        cashiersContainer.appendChild(card);
    });
}

function toggleAddCashierForm() {
    const form = document.getElementById('addCashierForm');
    const addCashierBtn = document.getElementById('addCashierBtn');
    form.classList.toggle('d-none');

    if (!form.classList.contains('d-none')) {
        document.getElementById('cashierForm').reset();  
        document.getElementById('cashierId').value = generateCashierId(); 
        addCashierBtn.classList.add('btn-danger');
        addCashierBtn.innerText = "Cancel";
        resetFormForAdd();
    } else {
        addCashierBtn.classList.remove('btn-danger');
        addCashierBtn.innerText = "Add Cashier";
    }
}

function generateCashierId() {
    const cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];
    if (cashiers.length === 0) {
        return 'CASH001';
    }
    const lastCashierId = cashiers[cashiers.length - 1].id;
    const newIdNumber = parseInt(lastCashierId.slice(4)) + 1;
    return `CASH${String(newIdNumber).padStart(3, '0')}`;
}

function addCashier() {
    if (confirm("Are you sure you want to add this cashier?")) {
        const cashierId = document.getElementById('cashierId').value;
        const cashierName = document.getElementById('cashierName').value;
        const cashierPhone = document.getElementById('cashierPhone').value;
        const cashierAddress = document.getElementById('cashierAddress').value;
        const cashierNic = document.getElementById('cashierNic').value;
        const cashierPhoto = document.getElementById('cashierPhoto').value || '../img/cashier.jpg';

        const newCashier = {
            id: cashierId,
            name: cashierName,
            phone: cashierPhone,
            address: cashierAddress,
            nic: cashierNic,
            photo: cashierPhoto,
            orderCount: 0,
            totalSales: 0
        };

        const cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];
        cashiers.push(newCashier);
        localStorage.setItem("Cashiers", JSON.stringify(cashiers));

        loadCashiers();
        toggleAddCashierForm(); 
    }
}

function editCashier(index) {
    toggleAddCashierForm();
    const cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];
    const cashier = cashiers[index];

    document.getElementById('cashierId').value = cashier.id; 
    document.getElementById('cashierName').value = cashier.name;
    document.getElementById('cashierPhone').value = cashier.phone;
    document.getElementById('cashierAddress').value = cashier.address;
    document.getElementById('cashierNic').value = cashier.nic;
    document.getElementById('cashierPhoto').value = cashier.photo;

    document.getElementById('addCashierForm').scrollIntoView({ behavior: 'smooth' });

    const confirmButton = document.querySelector('#addCashierForm .btn-primary');
    confirmButton.innerText = 'Update';
    confirmButton.setAttribute('onclick', `confirmUpdateCashier(${index})`);
}

function confirmUpdateCashier(index) {
    if (confirm("Are you sure you want to update this cashier?")) {
        updateCashier(index);
    }
}

function updateCashier(index) {
    const cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];

    cashiers[index] = {
        id: document.getElementById('cashierId').value,  
        name: document.getElementById('cashierName').value,
        phone: document.getElementById('cashierPhone').value,
        address: document.getElementById('cashierAddress').value,
        nic: document.getElementById('cashierNic').value,
        photo: document.getElementById('cashierPhoto').value || '../img/cashier.jpg',
        orderCount: cashiers[index].orderCount,
        totalSales: cashiers[index].totalSales
    };

    localStorage.setItem("Cashiers", JSON.stringify(cashiers));
    loadCashiers();

    document.getElementById('cashierForm').reset();
    const confirmButton = document.querySelector('#addCashierForm .btn-primary');
    confirmButton.innerText = 'Confirm Add';
    confirmButton.setAttribute('onclick', 'addCashier()');
}

function confirmDeleteCashier(index) {
    if (confirm("Are you sure you want to delete this cashier?")) {
        deleteCashier(index);
    }
}

function deleteCashier(index) {
    const cashiers = JSON.parse(localStorage.getItem("Cashiers")) || [];
    cashiers.splice(index, 1); 

    localStorage.setItem("Cashiers", JSON.stringify(cashiers));
    loadCashiers();
}

function resetFormForAdd() {
    const confirmButton = document.querySelector('#addCashierForm .btn-primary');
    confirmButton.innerText = 'Confirm Add';
    confirmButton.setAttribute('onclick', 'addCashier()');
}

document.addEventListener('DOMContentLoaded', loadCashiers);
