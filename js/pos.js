(function () {
  const user = Auth.requireRole("cashier", "admin");
  if (!user) return;

  document.getElementById("user-label").textContent = user.displayName + " · " + user.role;
  document.getElementById("btn-logout").addEventListener("click", Auth.logout);
  if (user.role === "admin") document.getElementById("admin-link").hidden = false;

  const state = {
    items: Store.items(),
    category: "Burgers",
    query: "",
    ticket: [],
    customer: Store.walkIn(),
    walkIn: Store.walkIn(),
  };

  function lkr(n) {
    return "LKR " + Number(n || 0).toLocaleString("en-LK");
  }

  function renderStats() {
    const stats = Store.todayStats(user);
    document.getElementById("stat-sales").textContent = lkr(stats.sales);
    document.getElementById("stat-orders").textContent = stats.orders;
  }

  function renderCategories() {
    document.getElementById("categories").innerHTML = Store.CATEGORIES.map(
      (cat) =>
        `<button class="cat-btn ${cat === state.category ? "active" : ""}" data-cat="${cat}">${cat}</button>`
    ).join("");
  }

  function visibleItems() {
    return state.items.filter((item) => {
      const q = state.query.trim().toLowerCase();
      const match = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      return q ? match : item.category === state.category;
    });
  }

  function renderTiles() {
    document.getElementById("tiles").innerHTML = visibleItems()
      .map((item) => {
        const sold = !item.available || item.stock < 1;
        return `<button class="tile ${sold ? "sold" : ""}" data-id="${item.id}" ${sold ? "disabled" : ""}>
          <img src="${Store.asset(item.image)}" alt="">
          <div class="meta">
            <h3>${item.name}</h3>
            <div>${lkr(Store.salePrice(item))}${item.discount_pct ? ` <span class="chip">${item.discount_pct}%</span>` : ""}</div>
            <div class="stock">${sold ? "Sold out" : item.stock + " left"}</div>
          </div>
        </button>`;
      })
      .join("");
  }

  function addItem(item) {
    if (!item.available || item.stock < 1) return;
    const existing = state.ticket.find((l) => l.item.id === item.id);
    const nextQty = (existing ? existing.qty : 0) + 1;
    if (nextQty > item.stock) return;
    if (existing) existing.qty = nextQty;
    else state.ticket.push({ item, qty: 1 });
    renderTicket();
  }

  function setQty(itemId, qty) {
    const line = state.ticket.find((l) => l.item.id === itemId);
    if (!line) return;
    if (qty < 1) state.ticket = state.ticket.filter((l) => l.item.id !== itemId);
    else line.qty = Math.min(qty, line.item.stock);
    renderTicket();
  }

  function totals() {
    let subtotal = 0;
    let discount = 0;
    for (const line of state.ticket) {
      subtotal += line.item.price * line.qty;
      discount += (line.item.price - Store.salePrice(line.item)) * line.qty;
    }
    return { subtotal, discount, total: subtotal - discount };
  }

  function renderTicket() {
    const el = document.getElementById("lines");
    if (!state.ticket.length) {
      el.innerHTML = '<p class="muted">Tap a menu item to start a ticket.</p>';
    } else {
      el.innerHTML = state.ticket
        .map((line) => {
          const lineTotal = Store.salePrice(line.item) * line.qty;
          return `<div class="line">
            <div>
              <strong>${line.item.name}</strong>
              <div class="muted">${lkr(Store.salePrice(line.item))} each</div>
            </div>
            <div>
              <div class="qty-row">
                <button data-act="dec" data-id="${line.item.id}">−</button>
                <span>${line.qty}</span>
                <button data-act="inc" data-id="${line.item.id}">+</button>
                <button data-act="rm" data-id="${line.item.id}">✕</button>
              </div>
              <div>${lkr(lineTotal)}</div>
            </div>
          </div>`;
        })
        .join("");
    }
    const t = totals();
    document.getElementById("subtotal").textContent = lkr(t.subtotal);
    document.getElementById("discounts").textContent = lkr(t.discount);
    document.getElementById("total").textContent = lkr(t.total);
    document.getElementById("btn-pay").disabled = state.ticket.length === 0;
  }

  function setCustomer(customer) {
    state.customer = customer;
    document.getElementById("customer-label").textContent = customer
      ? `${customer.name}${customer.phone ? " · " + customer.phone : ""}`
      : "Walk-in";
    document.getElementById("customer-suggest").innerHTML = "";
  }

  function receiptHtml(order) {
    const rows = order.items
      .map((line) => `<tr><td>${line.qty} × ${line.name}</td><td style="text-align:right">${lkr(line.line_total)}</td></tr>`)
      .join("");
    return `<h2>Ceylon Burgers</h2>
      <p>${order.order_no}</p>
      <p>${order.created_at}</p>
      <p>${order.customer_name}${order.customer_phone ? " · " + order.customer_phone : ""}</p>
      <p>Cashier: ${order.cashier_name || "Admin"}</p>
      <table>${rows}
        <tr><td>Subtotal</td><td style="text-align:right">${lkr(order.subtotal)}</td></tr>
        <tr><td>Discount</td><td style="text-align:right">${lkr(order.discount_total)}</td></tr>
        <tr><td><strong>Total</strong></td><td style="text-align:right"><strong>${lkr(order.total)}</strong></td></tr>
        <tr><td>Cash</td><td style="text-align:right">${lkr(order.tendered)}</td></tr>
        <tr><td>Change</td><td style="text-align:right">${lkr(order.change_due)}</td></tr>
      </table>
      <p>Thank you — order at the counter, eat it hot.</p>`;
  }

  function resetSale() {
    state.ticket = [];
    setCustomer(state.walkIn);
    document.getElementById("customer-search").value = "";
    renderTicket();
  }

  function refreshItems() {
    state.items = Store.items();
    state.walkIn = Store.walkIn();
    renderStats();
    renderTiles();
  }

  function loadOrders() {
    const orders = Store.todayOrders(user);
    const el = document.getElementById("orders-list");
    if (!orders.length) {
      el.innerHTML = '<p class="muted">No tickets yet today.</p>';
      return;
    }
    el.innerHTML = `<table class="data">${orders
      .map(
        (o) =>
          `<tr><td>${o.order_no}</td><td>${o.customer_name}</td><td>${lkr(o.total)}</td>
           <td><button class="btn btn-ghost" data-reprint="${o.id}">Reprint</button></td></tr>`
      )
      .join("")}</table>`;
  }

  document.getElementById("categories").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    state.query = "";
    document.getElementById("search").value = "";
    renderCategories();
    renderTiles();
  });

  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderTiles();
  });

  document.getElementById("tiles").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const item = state.items.find((i) => String(i.id) === btn.dataset.id);
    if (item) addItem(item);
  });

  document.getElementById("lines").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const line = state.ticket.find((l) => l.item.id === id);
    if (!line) return;
    if (btn.dataset.act === "inc") setQty(id, line.qty + 1);
    if (btn.dataset.act === "dec") setQty(id, line.qty - 1);
    if (btn.dataset.act === "rm") setQty(id, 0);
  });

  document.getElementById("btn-clear").addEventListener("click", resetSale);

  let searchTimer;
  document.getElementById("customer-search").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    searchTimer = setTimeout(() => {
      const box = document.getElementById("customer-suggest");
      if (!q) {
        box.innerHTML = "";
        return;
      }
      const rows = Store.searchCustomers(q);
      box.innerHTML =
        '<div class="suggest">' +
        rows
          .map((c) => `<button type="button" data-cid="${c.id}">${c.name}${c.phone ? " · " + c.phone : ""}</button>`)
          .join("") +
        `<button type="button" data-create="1">Add “${q}” as new customer</button></div>`;
    }, 200);
  });

  document.getElementById("customer-suggest").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.create) {
      const q = document.getElementById("customer-search").value.trim();
      const phoneMatch = q.match(/0\d{9}/);
      setCustomer(
        Store.addCustomer(q.replace(/0\d{9}/, "").trim() || q, phoneMatch ? phoneMatch[0] : "")
      );
      return;
    }
    const customer = Store.searchCustomers(document.getElementById("customer-search").value).find(
      (c) => c.id === Number(btn.dataset.cid)
    );
    if (customer) setCustomer(customer);
  });

  document.getElementById("btn-pay").addEventListener("click", () => {
    const t = totals();
    document.getElementById("pay-due").textContent = lkr(t.total);
    document.getElementById("tendered").value = t.total;
    document.getElementById("pay-change").textContent = lkr(0);
    document.getElementById("pay-error").hidden = true;
    document.getElementById("pay-modal").classList.add("open");
    document.getElementById("tendered").focus();
  });

  document.getElementById("tendered").addEventListener("input", () => {
    const t = totals();
    const cash = Number(document.getElementById("tendered").value || 0);
    document.getElementById("pay-change").textContent = lkr(Math.max(0, cash - t.total));
  });

  document.getElementById("btn-cancel-pay").addEventListener("click", () => {
    document.getElementById("pay-modal").classList.remove("open");
  });

  document.getElementById("btn-complete").addEventListener("click", () => {
    const err = document.getElementById("pay-error");
    err.hidden = true;
    try {
      const order = Store.placeOrder({
        customer_id: state.customer ? state.customer.id : state.walkIn.id,
        tendered: Number(document.getElementById("tendered").value),
        items: state.ticket.map((line) => ({ item_id: line.item.id, qty: line.qty })),
        user,
      });
      document.getElementById("pay-modal").classList.remove("open");
      document.getElementById("print-receipt").innerHTML = receiptHtml(order);
      document.getElementById("receipt-modal").classList.add("open");
      refreshItems();
      resetSale();
    } catch (e) {
      err.textContent = e.message;
      err.hidden = false;
    }
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-new-sale").addEventListener("click", () => {
    document.getElementById("receipt-modal").classList.remove("open");
  });
  document.getElementById("btn-orders").addEventListener("click", () => {
    loadOrders();
    document.getElementById("orders-modal").classList.add("open");
  });
  document.getElementById("btn-close-orders").addEventListener("click", () => {
    document.getElementById("orders-modal").classList.remove("open");
  });
  document.getElementById("orders-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-reprint]");
    if (!btn) return;
    const order = Store.getOrder(btn.dataset.reprint, user);
    document.getElementById("orders-modal").classList.remove("open");
    document.getElementById("print-receipt").innerHTML = receiptHtml(order);
    document.getElementById("receipt-modal").classList.add("open");
  });

  setCustomer(state.walkIn);
  renderStats();
  renderCategories();
  renderTiles();
  renderTicket();
})();
