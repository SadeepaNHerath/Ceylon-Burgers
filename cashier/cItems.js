const foodItems = JSON.parse(localStorage.getItem("Items")) || [];

let currentIndex = 0;
const itemsPerPage = 6;
let filteredItems = []; 

function showCategory(category) {
    currentIndex = 0; 
    const foodItemsContainer = document.getElementById('food-items');
    foodItemsContainer.innerHTML = ''; 

    if (category && category !== 'all') {
        filteredItems = foodItems.filter(item => item.id.substring(0, 3).toUpperCase() === category.substring(0, 3).toUpperCase());
    } else {
        filteredItems = [...foodItems]; 
    }

    loadMoreItems(); 

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
}

function loadMoreItems() {
    const foodItemsContainer = document.getElementById('food-items');
    const loadingSpinner = document.getElementById('loading');
    loadingSpinner.style.display = 'block'; 

    setTimeout(() => {
        const itemsToDisplay = filteredItems.slice(currentIndex, currentIndex + itemsPerPage);

        if (itemsToDisplay.length === 0) {
            window.removeEventListener('scroll', handleScroll);
        } else {
            itemsToDisplay.forEach(item => {
                const foodCard = `
                    <div class="col-lg-4 mb-4 food-item" data-aos="fade-up">
                        <div class="card">
                            <img src="${item.img_url}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px;" alt="${item.name}">
                            <div class="card-body">
                                <h2 class="fw-normal">${item.name}</h2>
                                <p class="card-text">Price: LKR ${item.price}</p>
                                <p class="card-text">Discount: ${item.discount !== null ? item.discount + '%' : 'None'}</p>
                                <p class="card-text">Quantity Available: ${item.quantity}</p>
                                <p class="card-text">Expiry Date: ${item.expiration_date}</p>
                            </div>
                        </div>
                    </div>
                `;
                foodItemsContainer.innerHTML += foodCard;
            });

            currentIndex += itemsToDisplay.length; 
        }

        loadingSpinner.style.display = 'none'; 
        AOS.init(); 
    }, 500);
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreItems(); 
    }
}

document.addEventListener('DOMContentLoaded', function () {
    showCategory('all'); 
});
