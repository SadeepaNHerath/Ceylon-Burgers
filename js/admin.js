(function () {
  const user = Auth.requireRole("admin");
  if (!user) return;

  const titles = {
    dashboard: "Dashboard",
    menu: "Menu",
    cashiers: "Cashiers",
    customers: "Customers",
    orders: "Orders",
    reports: "Reports",
  };

  function lkr(n) {
    return "LKR " + Number(n || 0).toLocaleString("en-LK");
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  document.getElementById("user-label").textContent = user.displayName;
  document.getElementById("btn-logout").addEventListener("click", Auth.logout);
  document.getElementById("item-category").innerHTML = Store.CATEGORIES.map(
    (c) => `<option value="${c}">${c}</option>`
  ).join("");

  function show(page) {
    const name = titles[page] ? page : "dashboard";
    document.querySelectorAll(".admin-panel").forEach((el) => {
      el.classList.toggle("active", el.dataset.panel === name);
    });
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.classList.toggle("active", el.dataset.nav === name);
    });
    document.getElementById("page-title").textContent = titles[name];
    if (name === "dashboard") renderDashboard();
    if (name === "menu") renderMenu();
    if (name === "cashiers") renderCashiers();
    if (name === "customers") renderCustomers();
    if (name === "orders") renderOrders();
    if (name === "reports") renderReports();
  }

  function renderDashboard() {
    const data = Store.dashboard();
    document.getElementById("kpis").innerHTML = `
      <div class="kpi"><span>Today sales</span><strong>${lkr(data.today.sales)}</strong></div>
      <div class="kpi"><span>Today orders</span><strong>${data.today.orders}</strong></div>
      <div class="kpi"><span>Menu items</span><strong>${data.counts.items}</strong></div>
      <div class="kpi"><span>Active cashiers</span><strong>${data.counts.cashiers}</strong></div>
      <div class="kpi"><span>Customers</span><strong>${data.counts.customers}</strong></div>`;
    document.getElementById("low-stock").innerHTML = data.lowStock.length
      ? `<table class="data">${data.lowStock.map((i) => `<tr><td>${esc(i.name)}</td><td>${i.stock}</td></tr>`).join("")}</table>`
      : "Stock looks healthy.";
    document.getElementById("recent").innerHTML = data.recent.length
      ? `<table class="data">${data.recent.map((o) => `<tr><td>${esc(o.order_no)}</td><td>${esc(o.customer_name)}</td><td>${lkr(o.total)}</td></tr>`).join("")}</table>`
      : "No orders yet.";
  }

  function renderMenu() {
    const q = document.getElementById("filter").value.toLowerCase();
    const rows = Store.items().filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
    document.getElementById("item-rows").innerHTML = rows
      .map(
        (i) => `<tr>
        <td><img class="thumb" src="${esc(Store.asset(i.image))}" alt=""></td>
        <td>${esc(i.sku)}</td>
        <td>${esc(i.name)}${i.available ? "" : ' <span class="muted">hidden</span>'}</td>
        <td>${esc(i.category)}</td>
        <td>${lkr(i.price)}</td>
        <td>${i.discount_pct || 0}%</td>
        <td>${i.stock}</td>
        <td>
          <button class="btn btn-ghost" data-edit-item="${i.id}">Edit</button>
          <button class="btn btn-danger" data-del-item="${i.id}">Remove</button>
        </td>
      </tr>`
      )
      .join("");
  }

  function renderCashiers() {
    document.getElementById("cashier-rows").innerHTML = Store.cashiers()
      .map(
        (c) => `<tr>
        <td><img class="thumb" src="${esc(Store.asset(c.photo || "img/cashier.webp"))}" alt=""></td>
        <td>${esc(c.name)}</td>
        <td>${esc(c.username || "")}</td>
        <td>${esc(c.phone)}</td>
        <td>${c.active ? "Active" : "Disabled"}</td>
        <td><button class="btn btn-ghost" data-edit-cashier="${c.id}">Edit</button></td>
      </tr>`
      )
      .join("");
  }

  function renderCustomers() {
    document.getElementById("customer-rows").innerHTML = Store.customers()
      .map(
        (c) => `<tr>
        <td>${esc(c.name)}${c.is_walk_in ? ' <span class="chip">Walk-in</span>' : ""}</td>
        <td>${esc(c.phone || "—")}</td>
        <td>${c.order_count}</td>
        <td>${lkr(c.total_spent)}</td>
      </tr>`
      )
      .join("");
  }

  function renderOrders() {
    const list = Store.filterOrders({
      from: document.getElementById("from").value,
      to: document.getElementById("to").value,
      q: document.getElementById("q").value.trim(),
    });
    document.getElementById("order-rows").innerHTML = list
      .map(
        (o) => `<tr>
        <td>${esc(o.order_no)}</td>
        <td>${esc(o.created_at)}</td>
        <td>${esc(o.customer_name)}</td>
        <td>${esc(o.cashier_name || "Admin")}</td>
        <td>${lkr(o.total)}</td>
        <td><button class="btn btn-ghost" data-view-order="${o.id}">View</button></td>
      </tr>`
      )
      .join("");
  }

  let currentReport = null;
  function renderReports() {
    const month = document.getElementById("month");
    if (!month.options.length) {
      const names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      const now = new Date();
      month.innerHTML = names
        .map((n, i) => `<option value="${String(i + 1).padStart(2, "0")}">${n}</option>`)
        .join("");
      month.value = String(now.getMonth() + 1).padStart(2, "0");
      document.getElementById("year").value = now.getFullYear();
    }
    currentReport = Store.report(document.getElementById("year").value, month.value);
    document.getElementById("report-kpis").innerHTML = `
      <div class="kpi"><span>Sales</span><strong>${lkr(currentReport.summary.sales)}</strong></div>
      <div class="kpi"><span>Orders</span><strong>${currentReport.summary.orders}</strong></div>
      <div class="kpi"><span>Discounts</span><strong>${lkr(currentReport.summary.discounts)}</strong></div>`;
    document.getElementById("report-items").innerHTML =
      currentReport.items.map((i) => `<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${lkr(i.sales)}</td></tr>`).join("") ||
      '<tr><td class="muted">No sales this month</td></tr>';
    document.getElementById("report-customers").innerHTML =
      currentReport.customers.map((c) => `<tr><td>${esc(c.name)}</td><td>${c.orders}</td><td>${lkr(c.sales)}</td></tr>`).join("") ||
      '<tr><td class="muted">No customers</td></tr>';
    document.getElementById("report-cashiers").innerHTML =
      currentReport.cashiers.map((c) => `<tr><td>${esc(c.name)}</td><td>${c.orders}</td><td>${lkr(c.sales)}</td></tr>`).join("") ||
      '<tr><td class="muted">No cashier sales</td></tr>';
  }

  window.addEventListener("hashchange", () => show(location.hash.replace("#", "")));
  document.getElementById("filter").addEventListener("input", renderMenu);
  document.getElementById("btn-filter").addEventListener("click", renderOrders);
  document.getElementById("btn-run").addEventListener("click", renderReports);
  document.getElementById("btn-pdf").addEventListener("click", () => {
    if (!currentReport || !window.jspdf) return;
    const month = document.getElementById("month");
    const doc = new window.jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text(`Ceylon Burgers · ${month.options[month.selectedIndex].text} ${currentReport.year}`, 14, 18);
    doc.setFontSize(11);
    doc.text(`Sales ${lkr(currentReport.summary.sales)}  ·  Orders ${currentReport.summary.orders}`, 14, 28);
    let y = 40;
    currentReport.items.slice(0, 20).forEach((i) => {
      doc.text(`${i.name}  ${i.qty}  ${lkr(i.sales)}`, 14, y);
      y += 6;
    });
    doc.save(`ceylon-burgers-${currentReport.year}-${currentReport.month}.pdf`);
  });

  const itemModal = document.getElementById("item-modal");
  const itemForm = document.getElementById("item-form");
  document.getElementById("btn-add-item").addEventListener("click", () => {
    itemForm.reset();
    itemForm.recordId.value = "";
    document.getElementById("item-title").textContent = "Add item";
    document.getElementById("item-error").hidden = true;
    itemModal.classList.add("open");
  });
  document.getElementById("btn-cancel-item").addEventListener("click", () => itemModal.classList.remove("open"));
  document.getElementById("item-rows").addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit-item]");
    const del = e.target.closest("[data-del-item]");
    if (edit) {
      const item = Store.items().find((i) => String(i.id) === edit.dataset.editItem);
      itemForm.reset();
      itemForm.recordId.value = item.id;
      itemForm.name.value = item.name;
      itemForm.category.value = item.category;
      itemForm.price.value = item.price;
      itemForm.stock.value = item.stock;
      itemForm.discount_pct.value = item.discount_pct;
      itemForm.available.value = String(item.available);
      itemForm.image.value = item.image || "";
      document.getElementById("item-title").textContent = "Edit item";
      document.getElementById("item-error").hidden = true;
      itemModal.classList.add("open");
    }
    if (del && confirm("Hide or delete this item?")) {
      Store.deleteItem(del.dataset.delItem);
      renderMenu();
    }
  });
  itemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = document.getElementById("item-error");
    err.hidden = true;
    const file = itemForm.imageFile.files[0];
    const save = (image) => {
      try {
        Store.saveItem({
          id: itemForm.recordId.value,
          name: itemForm.name.value,
          category: itemForm.category.value,
          price: itemForm.price.value,
          stock: Number(itemForm.stock.value),
          discount_pct: itemForm.discount_pct.value,
          available: itemForm.available.value === "1",
          image: image || itemForm.image.value,
        });
        itemModal.classList.remove("open");
        renderMenu();
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
      }
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => save(reader.result);
      reader.readAsDataURL(file);
    } else {
      save(itemForm.image.value);
    }
  });

  const cashierModal = document.getElementById("cashier-modal");
  const cashierForm = document.getElementById("cashier-form");
  document.getElementById("btn-add-cashier").addEventListener("click", () => {
    cashierForm.reset();
    cashierForm.recordId.value = "";
    cashierForm.password.required = true;
    document.getElementById("cashier-title").textContent = "Add cashier";
    document.getElementById("cashier-error").hidden = true;
    cashierModal.classList.add("open");
  });
  document.getElementById("btn-cancel-cashier").addEventListener("click", () => cashierModal.classList.remove("open"));
  document.getElementById("cashier-rows").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-edit-cashier]");
    if (!btn) return;
    const c = Store.cashiers().find((row) => String(row.id) === btn.dataset.editCashier);
    cashierForm.reset();
    cashierForm.recordId.value = c.id;
    cashierForm.name.value = c.name;
    cashierForm.phone.value = c.phone;
    cashierForm.address.value = c.address;
    cashierForm.nic.value = c.nic;
    cashierForm.photo.value = c.photo;
    cashierForm.username.value = c.username;
    cashierForm.active.value = String(c.active);
    cashierForm.password.required = false;
    document.getElementById("cashier-title").textContent = "Edit cashier";
    document.getElementById("cashier-error").hidden = true;
    cashierModal.classList.add("open");
  });
  cashierForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = document.getElementById("cashier-error");
    err.hidden = true;
    try {
      Store.saveCashier({
        id: cashierForm.recordId.value,
        name: cashierForm.name.value,
        phone: cashierForm.phone.value,
        address: cashierForm.address.value,
        nic: cashierForm.nic.value,
        photo: cashierForm.photo.value,
        username: cashierForm.username.value,
        password: cashierForm.password.value,
        active: cashierForm.active.value === "1",
      });
      cashierModal.classList.remove("open");
      renderCashiers();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });

  document.getElementById("order-rows").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view-order]");
    if (!btn) return;
    const o = Store.getOrder(btn.dataset.viewOrder, user);
    document.getElementById("order-detail").innerHTML = `
      <h2>${esc(o.order_no)}</h2>
      <p class="muted">${esc(o.created_at)} · ${esc(o.customer_name)} · ${esc(o.cashier_name || "Admin")}</p>
      <table class="data">${o.items.map((i) => `<tr><td>${i.qty} × ${esc(i.name)}</td><td>${lkr(i.line_total)}</td></tr>`).join("")}
        <tr><td>Total</td><td>${lkr(o.total)}</td></tr></table>`;
    document.getElementById("order-modal").classList.add("open");
  });
  document.getElementById("btn-close-order").addEventListener("click", () => {
    document.getElementById("order-modal").classList.remove("open");
  });

  show(location.hash.replace("#", "") || "dashboard");
})();
