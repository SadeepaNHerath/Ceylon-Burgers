// Initialize data stores if they don't exist
if (JSON.parse(localStorage.getItem("Items")) == null) {
    let foodItems = [
            {
                "id": "BUR001",
                "name": "Classic Burger (Large)",
                "quantity": 15,
                "price": 1500,
                "discount": null,
                "img_url": "../img/BUR001.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR002",
                "name": "Classic Burger (Regular)",
                "quantity": 15,
                "price": 750,
                "discount": 15,
                "img_url": "../img/BUR002.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR003",
                "name": "Turkey Burger",
                "quantity": 10,
                "price": 1600,
                "discount": null,
                "img_url": "../img/BUR003.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR004",
                "name": "Chicken Burger (Large)",
                "quantity": 15,
                "price": 1400,
                "discount": null,
                "img_url": "../img/BUR004.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR005",
                "name": "Chicken Burger (Regular)",
                "quantity": 15,
                "price": 800,
                "discount": 20,
                "img_url": "../img/BUR005.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR006",
                "name": "Cheese Burger (Large)",
                "quantity": 10,
                "price": 1000,
                "discount": null,
                "img_url": "../img/BUR006.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR007",
                "name": "Cheese Burger (Regular)",
                "quantity": 20,
                "price": 600,
                "discount": null,
                "img_url": "../img/BUR007.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR008",
                "name": "Bacon Burger",
                "quantity": 15,
                "price": 650,
                "discount": 15,
                "img_url": "../img/BUR008.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR009",
                "name": "Shawarma Burger",
                "quantity": 15,
                "price": 800,
                "discount": null,
                "img_url": "../img/BUR009.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR010",
                "name": "Olive Burger",
                "quantity": 15,
                "price": 1800,
                "discount": null,
                "img_url": "../img/BUR010.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR011",
                "name": "Double-Cheese Burger",
                "quantity": 15,
                "price": 1250,
                "discount": 20,
                "img_url": "../img/BUR011.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR012",
                "name": "Crispy Chicken Burger (Regular)",
                "quantity": 15,
                "price": 1200,
                "discount": null,
                "img_url": "../img/BUR012.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR013",
                "name": "Crispy Chicken Burger (Large)",
                "quantity": 15,
                "price": 1600,
                "discount": 10,
                "img_url": "../img/BUR013.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "BUR014",
                "name": "Paneer Burger",
                "quantity": 15,
                "price": 900,
                "discount": null,
                "img_url": "../img/BUR014.webp",
                "expiration_date": "2025-07-04"
            },
            {
                "id": "SUB001",
                "name": "Crispy Chicken Submarine (Large)",
                "quantity": 15,
                "price": 2000,
                "discount": null,
                "img_url": "../img/SUB001.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB002",
                "name": "Crispy Chicken Submarine (Regular)",
                "quantity": 15,
                "price": 1500,
                "discount": null,
                "img_url": "../img/SUB002.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB003",
                "name": "Chicken Submarine (Large)",
                "quantity": 15,
                "price": 1800,
                "discount":30,
                "img_url": "../img/SUB003.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB004",
                "name": "Chicken Submarine (Regular)",
                "quantity": 15,
                "price": 1400,
                "discount": null,
                "img_url": "../img/SUB004.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB005",
                "name": "Grinder Submarine",
                "quantity": 15,
                "price": 2300,
                "discount": null,
                "img_url": "../img/SUB005.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB006",
                "name": "Cheese Submarine",
                "quantity": 15,
                "price": 2200,
                "discount": null,
                "img_url": "../img/SUB006.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB007",
                "name": "Double Cheese n Chicken Submarine",
                "quantity": 15,
                "price": 1900,
                "discount": 16,
                "img_url": "../img/SUB007.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB008",
                "name": "Special Horgie Submarine",
                "quantity": 15,
                "price": 2800,
                "discount": null,
                "img_url": "../img/SUB008.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "SUB009",
                "name": "BQ Special Submarine",
                "quantity": 15,
                "price": 3000,
                "discount": null,
                "img_url": "../img/SUB009.webp",
                "expiration_date": "2025-07-15"
            },
            {
                "id": "FRI001",
                "name": "Steak Fries (Large)",
                "quantity": 10,
                "price": 1200,
                "discount": null,
                "img_url": "../img/FRI001.webp",
                "expiration_date": "2025-07-20"
            },
            {
                "id": "FRI002",
                "name": "Steak Fries (Medium)",
                "quantity": 10,
                "price": 600,
                "discount": null,
                "img_url": "../img/FRI002.webp",
                "expiration_date": "2025-07-20"
            },
            {
                "id": "FRI003",
                "name": "FrIench Fries (Large)",
                "quantity": 10,
                "price": 800,
                "discount": null,
                "img_url": "../img/FRI003.webp",
                "expiration_date": "2025-07-20"
            },
            {
                "id": "FRI004",
                "name": "FrIench Fries (Medium)",
                "quantity": 10,
                "price": 650,
                "discount": null,
                "img_url": "../img/FRI004.webp",
                "expiration_date": "2025-07-20"
            },
            {
                "id": "FRI005",
                "name": "FrIench Fries (Small)",
                "quantity": 10,
                "price": 450,
                "discount": null,
                "img_url": "../img/FRI005.webp",
                "expiration_date": "2025-07-20"
            },
            {
                "id": "FRI006",
                "name": "Sweet Potato Fries (Large)",
                "quantity": 10,
                "price": 600,
                "discount": null,
                "img_url": "../img/FRI006.webp",
                "expiration_date": "2025-07-20"
            },
            {
                "id": "PAS001",
                "name": "Chicken n Cheese Pasta",
                "quantity": 5,
                "price": 1600,
                "discount": 15,
                "img_url": "../img/PAS001.webp",
                "expiration_date": "2025-07-02"
            },
            {
                "id": "PAS002",
                "name": "Chicken Penne Pasta",
                "quantity": 5,
                "price": 1700,
                "discount": null,
                "img_url": "../img/PAS002.webp",
                "expiration_date": "2025-07-02"
            },
            {
                "id": "PAS003",
                "name": "Ground Turkey Pasta Bake",
                "quantity": 5,
                "price": 2900,
                "discount": 10,
                "img_url": "../img/PAS003.webp",
                "expiration_date": "2025-07-02"
            },
            {
                "id": "PAS004",
                "name": "Creamy Shrimp Pasta",
                "quantity": 5,
                "price": 2000,
                "discount": null,
                "img_url": "../img/PAS004.webp",
                "expiration_date": "2025-07-02"
            },
            {
                "id": "PAS005",
                "name": "Lemon Butter Pasta",
                "quantity": 5,
                "price": 1950,
                "discount": null,
                "img_url": "../img/PAS005.webp",
                "expiration_date": "2025-07-02"
            },
            {
                "id": "PAS006",
                "name": "Tagliatelle Pasta",
                "quantity": 5,
                "price": 2400,
                "discount":10,
                "img_url": "../img/PAS006.webp",
                "expiration_date": "2025-07-02"
            },
            {
                "id": "SAL001",
                "name": "Caesar Salad",
                "quantity": 20,
                "price": 700,
                "discount": null,
                "img_url": "../img/SAL001.webp",
                "expiration_date": "2025-07-10"
            },
            {
                "id": "SAL002",
                "name": "Garden Salad",
                "quantity": 20,
                "price": 600,
                "discount": null,
                "img_url": "../img/SAL002.webp",
                "expiration_date": "2025-07-10"
            },
            {
                "id": "SAL003",
                "name": "Greek Salad",
                "quantity": 20,
                "price": 800,
                "discount": null,
                "img_url": "../img/SAL003.webp",
                "expiration_date": "2025-07-10"
            },
            {
                "id": "SAL004",
                "name": "Quinoa Salad",
                "quantity": 20,
                "price": 850,
                "discount": null,
                "img_url": "../img/SAL004.webp",
                "expiration_date": "2025-07-10"
            },
            {
                "id": "SAL005",
                "name": "Cobb Salad",
                "quantity": 20,
                "price": 900,
                "discount": null,
                "img_url": "../img/SAL005.png",
                "expiration_date": "2025-07-10"
            },
            {
                "id": "DES001",
                "name": "Chocolate Cake",
                "quantity": 30,
                "price": 500,
                "discount": null,
                "img_url": "../img/DES001.webp",
                "expiration_date": "2025-07-25"
            },
            {
                "id": "DES002",
                "name": "Cheesecake",
                "quantity": 30,
                "price": 600,
                "discount": null,
                "img_url": "../img/DES002.webp",
                "expiration_date": "2025-07-25"
            },
            {
                "id": "DES003",
                "name": "Brownie",
                "quantity": 30,
                "price": 400,
                "discount": null,
                "img_url": "../img/DES003.webp",
                "expiration_date": "2025-07-25"
            },
            {
                "id": "DES004",
                "name": "Ice Cream Sundae",
                "quantity": 30,
                "price": 700,
                "discount": null,
                "img_url": "../img/DES004.webp",
                "expiration_date": "2025-07-25"
            },
            {
                "id": "DES005",
                "name": "FrIuit Tart",
                "quantity": 30,
                "price": 650,
                "discount": null,
                "img_url": "../img/DES005.webp",
                "expiration_date": "2025-07-25"
            },
            {
                "id": "SID001",
                "name": "Garlic Bread",
                "quantity": 25,
                "price": 400,
                "discount": null,
                "img_url": "../img/SID001.webp",
                "expiration_date": "2025-07-18"
            },
            {
                "id": "SID002",
                "name": "Onion Rings",
                "quantity": 25,
                "price": 450,
                "discount": null,
                "img_url": "../img/SID002.webp",
                "expiration_date": "2025-07-18"
            },
            {
                "id": "SID003",
                "name": "Coleslaw",
                "quantity": 25,
                "price": 350,
                "discount": null,
                "img_url": "../img/SID003.webp",
                "expiration_date": "2025-07-18"
            },
            {
                "id": "SID004",
                "name": "Potato Wedges",
                "quantity": 25,
                "price": 550,
                "discount": null,
                "img_url": "../img/SID004.webp",
                "expiration_date": "2025-07-18"
            },
            {
                "id": "SID005",
                "name": "Stuffed Mushrooms",
                "quantity": 25,
                "price": 600,
                "discount": null,
                "img_url": "../img/SID005.webp",
                "expiration_date": "2025-07-18"
            },
            {
                "id": "BEV001",
                "name": "Soft Drink (Coke)",
                "quantity": 100,
                "price": 200,
                "discount": null,
                "img_url": "../img/BEV001.webp",
                "expiration_date": "2025-08-01"
            },
            {
                "id": "BEV002",
                "name": "Lemonade",
                "quantity": 100,
                "price": 250,
                "discount": null,
                "img_url": "../img/BEV002.webp",
                "expiration_date": "2025-08-01"
            },
            {
                "id": "BEV003",
                "name": "Iced Tea",
                "quantity": 100,
                "price": 300,
                "discount": null,
                "img_url": "../img/BEV003.webp",
                "expiration_date": "2025-08-01"
            },
            {
                "id": "BEV004",
                "name": "Coffee",
                "quantity": 100,
                "price": 400,
                "discount": null,
                "img_url": "../img/BEV004.webp",
                "expiration_date": "2025-08-01"
            },
            {
                "id": "BEV005",
                "name": "Milkshake",
                "quantity": 100,
                "price": 500,
                "discount": null,
                "img_url": "../img/BEV005.webp",
                "expiration_date": "2025-08-01"
            }
    ];
    localStorage.setItem("Items", JSON.stringify(foodItems));
}

if (JSON.parse(localStorage.getItem("Customers")) == null) {
    const customers = [
        { 
            id: "CUS001", 
            name: "Nimal Perera", 
            phone: "0712345678",
            orderCount: 0,          
            totalSpent: 0          
        },
        { 
            id: "CUS002", 
            name: "Kamal Fernando", 
            phone: "0723456789",
            orderCount: 0,
            totalSpent: 0 
        },
        { 
            id: "CUS003", 
            name: "Anula Silva", 
            phone: "0745678901",
            orderCount: 0,
            totalSpent: 0 
        },
        { 
            id: "CUS004", 
            name: "Sunil Jayasinghe", 
            phone: "0756789012",
            orderCount: 0,
            totalSpent: 0 
        },
        { 
            id: "CUS005", 
            name: "Mala Rathnayake", 
            phone: "0767890123",
            orderCount: 0,
            totalSpent: 0 
        }
    ];
    
localStorage.setItem("Customers", JSON.stringify(customers));
}

if (JSON.parse(localStorage.getItem("Cashiers")) == null) {
    const cashiers = [
        {
            id: "CASH001",
            name: "Sarath Kumara",
            phone: "0712345671",
            address: "No. 10, Galle Road, Colombo 3",
            nic: "198712345V",
            photo: "../img/Sarath.webp",
            orderCount: 0,    
            totalSales: 0     
        },
        {
            id: "CASH002",
            name: "Ruwan Dias",
            phone: "0723456782",
            address: "No. 15, Kandy Road, Kegalle",
            nic: "199003456V",
            photo: "../img/ruwan.webp",
            orderCount: 0,     
            totalSales: 0     
        } 
    ];
    
localStorage.setItem("Cashiers", JSON.stringify(cashiers));
}

if (JSON.parse(localStorage.getItem("OrderHistory")) == null) {
    const orders = [
        {
            orderId: "ORD001",
            date: "2024-10-01",
            customerId: "CUS001",
            cashierId: "CASH001",
            items: [
                { name: "Cheeseburger", price: 500, quantity: 2 },
                { name: "Fries", price: 200, quantity: 1 }
            ],
            totalPrice: 1200
        },
        {
            orderId: "ORD002",
            date: "2024-10-01",
            customerId: "CUS002",
            cashierId: "CASH001",
            items: [
                { name: "Chicken Submarine", price: 750, quantity: 1 },
                { name: "Coca Cola", price: 150, quantity: 2 }
            ],
            totalPrice: 1050
        },
        {
            orderId: "ORD003",
            date: "2024-10-02",
            customerId: "CUS003",
            cashierId: "CASH002",
            items: [
                { name: "Veggie Burger", price: 400, quantity: 1 },
                { name: "Orange Juice", price: 250, quantity: 1 }
            ],
            totalPrice: 650
        },
        {
            orderId: "ORD004",
            date: "2024-10-02",
            customerId: "CUS004",
            cashierId: "CASH001",
            items: [
                { name: "Fish Sandwich", price: 550, quantity: 2 },
                { name: "Sprite", price: 150, quantity: 1 }
            ],
            totalPrice: 1250
        },
        {
            orderId: "ORD005",
            date: "2024-10-02",
            customerId: "CUS005",
            cashierId: "CASH002",
            items: [
                { name: "Beef Burger", price: 600, quantity: 2 },
                { name: "Water Bottle", price: 100, quantity: 1 }
            ],
            totalPrice: 1300
        },
        {
            orderId: "ORD006",
            date: "2024-10-03",
            customerId: "CUS001",
            cashierId: "CASH001",
            items: [
                { name: "Cheeseburger", price: 500, quantity: 1 },
                { name: "Fries", price: 200, quantity: 1 }
            ],
            totalPrice: 700
        },
        {
            orderId: "ORD007",
            date: "2024-10-03",
            customerId: "CUS002",
            cashierId: "CASH002",
            items: [
                { name: "Chicken Submarine", price: 750, quantity: 2 },
                { name: "Coca Cola", price: 150, quantity: 1 }
            ],
            totalPrice: 1650
        },
        {
            orderId: "ORD008",
            date: "2024-10-03",
            customerId: "CUS003",
            cashierId: "CASH001",
            items: [
                { name: "Veggie Burger", price: 400, quantity: 2 },
                { name: "Orange Juice", price: 250, quantity: 1 }
            ],
            totalPrice: 1050
        },
        {
            orderId: "ORD009",
            date: "2024-10-03",
            customerId: "CUS004",
            cashierId: "CASH002",
            items: [
                { name: "Fish Sandwich", price: 550, quantity: 1 },
                { name: "Sprite", price: 150, quantity: 2 }
            ],
            totalPrice: 850
        },
        {
            orderId: "ORD010",
            date: "2024-10-04",
            customerId: "CUS005",
            cashierId: "CASH001",
            items: [
                { name: "Beef Burger", price: 600, quantity: 1 },
                { name: "Water Bottle", price: 100, quantity: 2 }
            ],
            totalPrice: 800
        }
    ];
    localStorage.setItem("OrderHistory", JSON.stringify(orders));
}

if (JSON.parse(localStorage.getItem("UserCredentials")) == null) {
    const credentials = {
        admin: {
            password: "CBA@2004",
            role: "admin"
        },
        cashier1: {
            password: "CBC@2004",
            role: "cashier",
            cashierId: "CASH001"
        },
        cashier2: {
            password: "CBC@2004",
            role: "cashier",
            cashierId: "CASH002"
        }
    };
    localStorage.setItem("UserCredentials", JSON.stringify(credentials));
}

// Initialize session management
if (localStorage.getItem("ActiveSessions") == null) {
    localStorage.setItem("ActiveSessions", JSON.stringify({}));
}

const cashier = JSON.parse(localStorage.getItem("Cashiers")) || [];
const customer = JSON.parse(localStorage.getItem("Customers")) || [];
const orders = JSON.parse(localStorage.getItem("OrderHistory")) || [];
const credentials = JSON.parse(localStorage.getItem("UserCredentials")) || {};

// Call our security utilities functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize secure credentials with hashed passwords
    if (window.ceylonBurgerUtils) {
        window.ceylonBurgerUtils.initializeSecureCredentials();
        window.ceylonBurgerUtils.checkHttps();
    }
});

function updatePasswordPlaceholder() {
    const role = document.getElementById('roleSelect').value;
    const passwordInput = document.getElementById('password');
    
    if (role === 'admin') {
        passwordInput.placeholder = 'Enter admin password';
    } else if (role === 'cashier') {
        const cashierSelect = document.getElementById('cashierSelect');
        cashierSelect.style.display = 'block';
        document.getElementById('cashierLabel').style.display = 'block';
        passwordInput.placeholder = 'Enter cashier password';
    } else {
        passwordInput.placeholder = 'Enter password';
    }
}

function checkLogin() {
    const role = document.getElementById('roleSelect').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = '';

    if (!window.ceylonBurgerUtils) {
        // Fallback to original login if security utilities not available
        if (role === 'admin' && password === credentials.admin.password) {
            window.location.href = 'admin/report.html';
        } else if (role === 'cashier') {
            const selectedCashier = document.getElementById('cashierSelect').value;
            
            if (selectedCashier && credentials[selectedCashier] && 
                credentials[selectedCashier].password === password) {
                
                sessionStorage.setItem('selectedCashier', credentials[selectedCashier].cashierId);
                window.location.href = 'cashier/placeOrder.html';
            } else {
                errorMessage.textContent = 'Invalid credentials. Please try again.';
            }
        } else {
            errorMessage.textContent = 'Invalid role or password. Please try again.';
        }
        return;
    }

    // Use secure authentication with password hashing
    const secureCredentials = JSON.parse(localStorage.getItem("SecureUserCredentials")) || {};
    
    if (role === 'admin') {
        if (window.ceylonBurgerUtils.verifyPassword(password, secureCredentials.admin.passwordHash)) {
            // Generate and store session token
            const sessionToken = window.ceylonBurgerUtils.generateSessionToken('admin');
            const sessions = JSON.parse(localStorage.getItem("ActiveSessions")) || {};
            sessions['admin'] = {
                token: sessionToken,
                expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
            };
            localStorage.setItem("ActiveSessions", JSON.stringify(sessions));
            
            // Store the token in session storage
            sessionStorage.setItem('authToken', sessionToken);
            sessionStorage.setItem('userRole', 'admin');
            
            window.location.href = 'admin/report.html';
        } else {
            errorMessage.textContent = 'Invalid password. Please try again.';
        }
    } else if (role === 'cashier') {
        const selectedCashier = document.getElementById('cashierSelect').value;
        
        if (selectedCashier && secureCredentials[selectedCashier] && 
            window.ceylonBurgerUtils.verifyPassword(password, secureCredentials[selectedCashier].passwordHash)) {
            
            // Generate and store session token
            const sessionToken = window.ceylonBurgerUtils.generateSessionToken(selectedCashier);
            const sessions = JSON.parse(localStorage.getItem("ActiveSessions")) || {};
            sessions[selectedCashier] = {
                token: sessionToken,
                expires: new Date().getTime() + (12 * 60 * 60 * 1000) // 12 hours
            };
            localStorage.setItem("ActiveSessions", JSON.stringify(sessions));
            
            // Store the token and user info in session storage
            sessionStorage.setItem('authToken', sessionToken);
            sessionStorage.setItem('userRole', 'cashier');
            sessionStorage.setItem('selectedCashier', secureCredentials[selectedCashier].cashierId);
            
            window.location.href = 'cashier/placeOrder.html';
        } else {
            errorMessage.textContent = 'Invalid credentials. Please try again.';
        }
    } else {
        errorMessage.textContent = 'Please select a role.';
    }
}

document.getElementById('password').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkLogin();
    }
});

function updateCashiersAndCustomers(orders, cashiers, customers) {
    orders.forEach(order => {
        const cashier = cashiers.find(cashier => cashier.id === order.cashierId);
        if (cashier) {
            cashier.orderCount++;
            cashier.totalSales += order.totalPrice;
        }

        const customer = customers.find(customer => customer.id === order.customerId);
        if (customer) {
            customer.orderCount++;
            customer.totalSpent += order.totalPrice; 
        }
    });

    localStorage.setItem('Cashiers', JSON.stringify(cashiers));
    localStorage.setItem('Customers', JSON.stringify(customers));
}

window.onload = function() {
    updateCashiersAndCustomers(orders, cashier, customer);
    updatePasswordPlaceholder();
    
    // Populate cashier selection dropdown
    const cashierSelect = document.getElementById('cashierSelect');
    if (cashierSelect) {
        cashierSelect.innerHTML = '<option value="">Choose...</option>';
        
        const secureCredentials = JSON.parse(localStorage.getItem("SecureUserCredentials")) || credentials;
        
        Object.keys(secureCredentials).forEach(username => {
            if ((secureCredentials[username].role || secureCredentials[username].userRole) === 'cashier') {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = username;
                cashierSelect.appendChild(option);
            }
        });
    }
    
    // Show password strength meter when typing in password field
    const passwordInput = document.getElementById('password');
    if (passwordInput && window.ceylonBurgerUtils) {
        const strengthMeter = document.createElement('div');
        strengthMeter.id = 'password-strength';
        strengthMeter.style.height = '5px';
        strengthMeter.style.marginTop = '5px';
        strengthMeter.style.transition = 'all 0.3s ease';
        
        const strengthLabel = document.createElement('div');
        strengthLabel.id = 'strength-label';
        strengthLabel.style.fontSize = '12px';
        strengthLabel.style.marginTop = '3px';
        
        passwordInput.parentNode.insertBefore(strengthMeter, passwordInput.nextSibling);
        passwordInput.parentNode.insertBefore(strengthLabel, strengthMeter.nextSibling);
        
        passwordInput.addEventListener('input', function() {
            if (this.value) {
                const strength = window.ceylonBurgerUtils.checkPasswordStrength(this.value);
                strengthMeter.style.backgroundColor = strength.feedback.color;
                strengthMeter.style.width = ((strength.score / 5) * 100) + '%';
                strengthLabel.textContent = 'Password strength: ' + strength.feedback.message;
                strengthLabel.style.color = strength.feedback.color;
            } else {
                strengthMeter.style.width = '0';
                strengthLabel.textContent = '';
            }
        });
    }
};