(function () {
  document.getElementById("year").textContent = new Date().getFullYear();
  const user = Auth.currentUser();
  const action = document.getElementById("header-action");
  if (user) {
    action.innerHTML = `<a class="btn btn-amber" href="${user.role === "admin" ? "admin.html" : "pos.html"}">Back to ${user.role === "admin" ? "admin" : "POS"}</a>`;
  } else {
    action.innerHTML = '<a class="btn btn-ghost" href="login.html">Staff login</a>';
  }

  const lkr = (n) => "LKR " + Number(n || 0).toLocaleString("en-LK");
  const root = document.getElementById("menu");
  root.innerHTML = Store.publicMenu()
    .map((group) => {
      const cards = group.items
        .map((item) => {
          const sale = Store.salePrice(item);
          return `<article class="menu-card">
            <img src="${Store.asset(item.image)}" alt="${item.name}">
            <div class="pad">
              <h3>${item.name}</h3>
              <div class="price-row">
                <strong>${lkr(sale)}</strong>
                ${item.discount_pct ? `<span class="old-price">${lkr(item.price)}</span><span class="chip">${item.discount_pct}% off</span>` : ""}
              </div>
            </div>
          </article>`;
        })
        .join("");
      return `<h2>${group.category}</h2><div class="menu-grid">${cards}</div>`;
    })
    .join("");
})();
