(function (global) {
  const KEY = "ceylonBurgers.v2";
  const CATEGORIES = [
    "Burgers", "Submarines", "Fries", "Pasta", "Salads", "Desserts", "Sides", "Beverages",
  ];
  const PREFIX = {
    Burgers: "BUR", Submarines: "SUB", Fries: "FRI", Pasta: "PAS",
    Salads: "SAL", Desserts: "DES", Sides: "SID", Beverages: "BEV",
  };

  function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16) + "cb" + (password.length * 7).toString(16);
  }

  function asset(path) {
    if (!path) return "img/items.webp";
    if (path.startsWith("data:")) return path;
    return String(path).replace(/^\//, "");
  }

  function pad(n) {
    return String(n).padStart(3, "0");
  }

  function nowStamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function todayStart() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} 00:00:00`;
  }

  function salePrice(item) {
    return Math.round(item.price * (1 - (item.discount_pct || 0) / 100));
  }

  function load() {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const db = seed();
    save(db);
    return db;
  }

  function save(db) {
    localStorage.setItem(KEY, JSON.stringify(db));
  }

  function nextId(list) {
    return list.reduce((max, row) => Math.max(max, row.id || 0), 0) + 1;
  }

  function seed() {
    const items = [
      ["BUR001", "Classic Burger (Large)", "Burgers", 40, 1500, 0],
      ["BUR002", "Classic Burger (Regular)", "Burgers", 40, 750, 15],
      ["BUR003", "Turkey Burger", "Burgers", 30, 1600, 0],
      ["BUR004", "Chicken Burger (Large)", "Burgers", 40, 1400, 0],
      ["BUR005", "Chicken Burger (Regular)", "Burgers", 40, 800, 20],
      ["BUR006", "Cheese Burger (Large)", "Burgers", 30, 1000, 0],
      ["BUR007", "Cheese Burger (Regular)", "Burgers", 50, 600, 0],
      ["BUR008", "Bacon Burger", "Burgers", 40, 650, 15],
      ["BUR009", "Shawarma Burger", "Burgers", 40, 800, 0],
      ["BUR010", "Olive Burger", "Burgers", 30, 1800, 0],
      ["BUR011", "Double-Cheese Burger", "Burgers", 40, 1250, 20],
      ["BUR012", "Crispy Chicken Burger (Regular)", "Burgers", 40, 1200, 0],
      ["BUR013", "Crispy Chicken Burger (Large)", "Burgers", 40, 1600, 10],
      ["BUR014", "Paneer Burger", "Burgers", 40, 900, 0],
      ["SUB001", "Crispy Chicken Submarine (Large)", "Submarines", 30, 2000, 0],
      ["SUB002", "Crispy Chicken Submarine (Regular)", "Submarines", 30, 1500, 0],
      ["SUB003", "Chicken Submarine (Large)", "Submarines", 30, 1800, 30],
      ["SUB004", "Chicken Submarine (Regular)", "Submarines", 30, 1400, 0],
      ["SUB005", "Grinder Submarine", "Submarines", 25, 2300, 0],
      ["SUB006", "Cheese Submarine", "Submarines", 25, 2200, 0],
      ["SUB007", "Double Cheese n Chicken Submarine", "Submarines", 25, 1900, 16],
      ["SUB008", "Special Horgie Submarine", "Submarines", 20, 2800, 0],
      ["SUB009", "BQ Special Submarine", "Submarines", 20, 3000, 0],
      ["FRI001", "Steak Fries (Large)", "Fries", 40, 1200, 0],
      ["FRI002", "Steak Fries (Medium)", "Fries", 40, 600, 0],
      ["FRI003", "French Fries (Large)", "Fries", 50, 800, 0],
      ["FRI004", "French Fries (Medium)", "Fries", 50, 650, 0],
      ["FRI005", "French Fries (Small)", "Fries", 50, 450, 0],
      ["FRI006", "Sweet Potato Fries (Large)", "Fries", 30, 600, 0],
      ["PAS001", "Chicken n Cheese Pasta", "Pasta", 20, 1600, 15],
      ["PAS002", "Chicken Penne Pasta", "Pasta", 20, 1700, 0],
      ["PAS003", "Ground Turkey Pasta Bake", "Pasta", 15, 2900, 10],
      ["PAS004", "Creamy Shrimp Pasta", "Pasta", 15, 2000, 0],
      ["PAS005", "Lemon Butter Pasta", "Pasta", 15, 1950, 0],
      ["PAS006", "Tagliatelle Pasta", "Pasta", 15, 2400, 10],
      ["SAL001", "Caesar Salad", "Salads", 30, 700, 0],
      ["SAL002", "Garden Salad", "Salads", 30, 600, 0],
      ["SAL003", "Greek Salad", "Salads", 30, 800, 0],
      ["SAL004", "Quinoa Salad", "Salads", 25, 850, 0],
      ["SAL005", "Cobb Salad", "Salads", 25, 900, 0],
      ["DES001", "Chocolate Cake", "Desserts", 40, 500, 0],
      ["DES002", "Cheesecake", "Desserts", 40, 600, 0],
      ["DES003", "Brownie", "Desserts", 40, 400, 0],
      ["DES004", "Ice Cream Sundae", "Desserts", 40, 700, 0],
      ["DES005", "Fruit Tart", "Desserts", 30, 650, 0],
      ["SID001", "Garlic Bread", "Sides", 40, 400, 0],
      ["SID002", "Onion Rings", "Sides", 40, 450, 0],
      ["SID003", "Coleslaw", "Sides", 40, 350, 0],
      ["SID004", "Potato Wedges", "Sides", 40, 550, 0],
      ["SID005", "Stuffed Mushrooms", "Sides", 30, 600, 0],
      ["BEV001", "Soft Drink (Coke)", "Beverages", 100, 200, 0],
      ["BEV002", "Lemonade", "Beverages", 80, 250, 0],
      ["BEV003", "Iced Tea", "Beverages", 80, 300, 0],
      ["BEV004", "Coffee", "Beverages", 80, 400, 0],
      ["BEV005", "Milkshake", "Beverages", 60, 500, 0],
    ].map((row, i) => ({
      id: i + 1,
      sku: row[0],
      name: row[1],
      category: row[2],
      stock: row[3],
      price: row[4],
      discount_pct: row[5],
      image: "img/" + row[0] + ".webp",
      available: 1,
    }));

    const cashiers = [
      { id: 1, name: "Sarath Kumara", phone: "0712345671", address: "No. 10, Galle Road, Colombo 3", nic: "198712345V", photo: "img/Sarath.webp", active: 1 },
      { id: 2, name: "Ruwan Dias", phone: "0723456782", address: "No. 15, Kandy Road, Kegalle", nic: "199003456V", photo: "img/ruwan.webp", active: 1 },
    ];

    const users = [
      { id: 1, username: "admin", password_hash: hashPassword("CBA@2004"), role: "admin", cashier_id: null, active: 1 },
      { id: 2, username: "cashier1", password_hash: hashPassword("CBC@2004"), role: "cashier", cashier_id: 1, active: 1 },
      { id: 3, username: "cashier2", password_hash: hashPassword("CBC@2004"), role: "cashier", cashier_id: 2, active: 1 },
    ];

    const customers = [
      { id: 1, name: "Walk-in", phone: "", is_walk_in: 1, created_at: nowStamp() },
      { id: 2, name: "Nimal Perera", phone: "0712345678", is_walk_in: 0, created_at: nowStamp() },
      { id: 3, name: "Kamal Fernando", phone: "0723456789", is_walk_in: 0, created_at: nowStamp() },
      { id: 4, name: "Anula Silva", phone: "0745678901", is_walk_in: 0, created_at: nowStamp() },
      { id: 5, name: "Sunil Jayasinghe", phone: "0756789012", is_walk_in: 0, created_at: nowStamp() },
      { id: 6, name: "Mala Rathnayake", phone: "0767890123", is_walk_in: 0, created_at: nowStamp() },
    ];

    return { items, cashiers, users, customers, orders: [] };
  }

  function nextSku(db, category) {
    const prefix = PREFIX[category] || category.slice(0, 3).toUpperCase();
    let next = 1;
    db.items.forEach((item) => {
      if (item.sku.startsWith(prefix)) {
        const num = parseInt(item.sku.replace(/\D/g, ""), 10);
        if (num >= next) next = num + 1;
      }
    });
    return prefix + pad(next);
  }

  function nextOrderNo(db) {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    const prefix = `ORD-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-`;
    let seq = 1;
    db.orders.forEach((o) => {
      if (o.order_no.startsWith(prefix)) {
        seq = Math.max(seq, parseInt(o.order_no.slice(prefix.length), 10) + 1);
      }
    });
    return prefix + pad(seq);
  }

  function hydrateOrder(db, order) {
    const customer = db.customers.find((c) => c.id === order.customer_id) || {};
    const cashier = db.cashiers.find((c) => c.id === order.cashier_id);
    return {
      ...order,
      customer_name: customer.name || "Walk-in",
      customer_phone: customer.phone || "",
      cashier_name: cashier ? cashier.name : "Admin",
    };
  }

  function todayStats(user) {
    const db = load();
    const start = todayStart();
    const rows = db.orders.filter((o) => {
      if (o.created_at < start) return false;
      if (user && user.role === "cashier" && user.cashierId) return o.cashier_id === user.cashierId;
      return true;
    });
    return {
      orders: rows.length,
      sales: rows.reduce((sum, o) => sum + o.total, 0),
    };
  }

  const Store = {
    CATEGORIES,
    hashPassword,
    asset,
    salePrice,
    load,
    items() {
      return load().items.slice();
    },
    publicMenu() {
      const items = load().items.filter((i) => i.available);
      return CATEGORIES.map((category) => ({
        category,
        items: items.filter((i) => i.category === category),
      })).filter((g) => g.items.length);
    },
    walkIn() {
      return load().customers.find((c) => c.is_walk_in) || load().customers[0];
    },
    searchCustomers(q) {
      const query = String(q || "").trim().toLowerCase();
      if (!query) return [];
      return load().customers.filter(
        (c) => c.name.toLowerCase().includes(query) || c.phone.includes(query)
      ).slice(0, 12);
    },
    addCustomer(name, phone) {
      const db = load();
      if (phone) {
        const existing = db.customers.find((c) => c.phone && c.phone === phone);
        if (existing) return existing;
      }
      const customer = {
        id: nextId(db.customers),
        name: name.trim(),
        phone: phone || "",
        is_walk_in: 0,
        created_at: nowStamp(),
      };
      db.customers.push(customer);
      save(db);
      return customer;
    },
    todayOrders(user) {
      const db = load();
      const start = todayStart();
      return db.orders
        .filter((o) => {
          if (o.created_at < start) return false;
          if (user && user.role === "cashier" && user.cashierId) return o.cashier_id === user.cashierId;
          return true;
        })
        .sort((a, b) => b.id - a.id)
        .map((o) => hydrateOrder(db, o));
    },
    getOrder(id, user) {
      const db = load();
      const order = db.orders.find((o) => o.id === Number(id));
      if (!order) return null;
      if (user && user.role === "cashier" && user.cashierId && order.cashier_id !== user.cashierId) {
        throw new Error("You can only view your own orders.");
      }
      return hydrateOrder(db, order);
    },
    placeOrder({ customer_id, tendered, items, user }) {
      const db = load();
      const customer = db.customers.find((c) => c.id === Number(customer_id));
      if (!customer) throw new Error("Select a customer.");
      if (!items || !items.length) throw new Error("Add at least one item.");
      const cash = Number(tendered);
      if (!Number.isFinite(cash) || cash < 0) throw new Error("Enter cash received.");

      let subtotal = 0;
      let discountTotal = 0;
      const prepared = [];
      for (const line of items) {
        const item = db.items.find((i) => i.id === Number(line.item_id));
        const qty = Number(line.qty);
        if (!item || !item.available) throw new Error("An item is unavailable.");
        if (!Number.isInteger(qty) || qty < 1) throw new Error("Invalid quantity for " + item.name + ".");
        if (item.stock < qty) throw new Error(item.name + " has only " + item.stock + " left.");
        const lineSubtotal = item.price * qty;
        const lineTotal = salePrice(item) * qty;
        subtotal += lineSubtotal;
        discountTotal += lineSubtotal - lineTotal;
        prepared.push({ item, qty, lineTotal });
      }
      const total = subtotal - discountTotal;
      if (cash < total) throw new Error("Cash received is less than the total.");

      const order = {
        id: nextId(db.orders),
        order_no: nextOrderNo(db),
        customer_id: customer.id,
        cashier_id: user && user.role === "cashier" ? user.cashierId : null,
        subtotal,
        discount_total: discountTotal,
        total,
        tendered: cash,
        change_due: cash - total,
        created_at: nowStamp(),
        items: prepared.map((line) => ({
          item_id: line.item.id,
          name: line.item.name,
          unit_price: line.item.price,
          qty: line.qty,
          discount_pct: line.item.discount_pct,
          line_total: line.lineTotal,
        })),
      };
      prepared.forEach((line) => {
        line.item.stock -= line.qty;
      });
      db.orders.push(order);
      save(db);
      return hydrateOrder(db, order);
    },
    todayStats,
    dashboard() {
      const db = load();
      const start = todayStart();
      const today = db.orders.filter((o) => o.created_at >= start);
      return {
        today: {
          orders: today.length,
          sales: today.reduce((s, o) => s + o.total, 0),
        },
        lowStock: db.items.filter((i) => i.available && i.stock <= 8).sort((a, b) => a.stock - b.stock).slice(0, 8),
        recent: db.orders.slice().sort((a, b) => b.id - a.id).slice(0, 6).map((o) => hydrateOrder(db, o)),
        counts: {
          items: db.items.length,
          cashiers: db.cashiers.filter((c) => c.active).length,
          customers: db.customers.filter((c) => !c.is_walk_in).length,
        },
      };
    },
    saveItem(payload) {
      const db = load();
      const name = String(payload.name || "").trim();
      const category = payload.category;
      const price = Number(payload.price);
      const stock = Number(payload.stock);
      const discount = Number(payload.discount_pct || 0);
      if (!name) throw new Error("Name is required.");
      if (!CATEGORIES.includes(category)) throw new Error("Choose a valid category.");
      if (!Number.isFinite(price) || price < 0) throw new Error("Price must be 0 or more.");
      if (!Number.isInteger(stock) || stock < 0) throw new Error("Stock must be a whole number.");
      if (discount < 0 || discount > 90) throw new Error("Discount must be between 0 and 90.");
      const image = payload.image || "img/items.webp";
      if (payload.id) {
        const item = db.items.find((i) => i.id === Number(payload.id));
        if (!item) throw new Error("Item not found.");
        Object.assign(item, {
          name, category, price: Math.round(price), stock, discount_pct: Math.round(discount),
          image, available: payload.available ? 1 : 0,
        });
      } else {
        db.items.push({
          id: nextId(db.items),
          sku: nextSku(db, category),
          name, category,
          price: Math.round(price),
          stock,
          discount_pct: Math.round(discount),
          image,
          available: payload.available ? 1 : 0,
        });
      }
      save(db);
    },
    deleteItem(id) {
      const db = load();
      const used = db.orders.some((o) => o.items.some((i) => i.item_id === Number(id)));
      if (used) {
        const item = db.items.find((i) => i.id === Number(id));
        if (item) item.available = 0;
      } else {
        db.items = db.items.filter((i) => i.id !== Number(id));
      }
      save(db);
    },
    cashiers() {
      const db = load();
      return db.cashiers.map((c) => {
        const user = db.users.find((u) => u.cashier_id === c.id);
        return { ...c, username: user ? user.username : "", user_active: user ? user.active : 0 };
      });
    },
    saveCashier(payload) {
      const db = load();
      const name = String(payload.name || "").trim();
      const username = String(payload.username || "").trim().toLowerCase();
      if (!name) throw new Error("Name is required.");
      if (username.length < 3) throw new Error("Username must be at least 3 characters.");
      const active = payload.active ? 1 : 0;
      if (payload.id) {
        const cashier = db.cashiers.find((c) => c.id === Number(payload.id));
        if (!cashier) throw new Error("Cashier not found.");
        Object.assign(cashier, {
          name,
          phone: payload.phone || "",
          address: payload.address || "",
          nic: payload.nic || "",
          photo: payload.photo || "img/cashier.webp",
          active,
        });
        const user = db.users.find((u) => u.cashier_id === cashier.id);
        if (user) {
          if (username !== user.username && db.users.some((u) => u.username === username && u.id !== user.id)) {
            throw new Error("That username is already taken.");
          }
          user.username = username;
          user.active = active;
          if (payload.password) user.password_hash = hashPassword(payload.password);
        }
      } else {
        if (!payload.password || payload.password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        if (db.users.some((u) => u.username === username)) throw new Error("That username is already taken.");
        const cashier = {
          id: nextId(db.cashiers),
          name,
          phone: payload.phone || "",
          address: payload.address || "",
          nic: payload.nic || "",
          photo: payload.photo || "img/cashier.webp",
          active: 1,
        };
        db.cashiers.push(cashier);
        db.users.push({
          id: nextId(db.users),
          username,
          password_hash: hashPassword(payload.password),
          role: "cashier",
          cashier_id: cashier.id,
          active: 1,
        });
      }
      save(db);
    },
    customers() {
      const db = load();
      return db.customers.map((c) => {
        const orders = db.orders.filter((o) => o.customer_id === c.id);
        return {
          ...c,
          order_count: orders.length,
          total_spent: orders.reduce((s, o) => s + o.total, 0),
        };
      });
    },
    filterOrders({ from, to, q }) {
      const db = load();
      return db.orders
        .filter((o) => {
          if (from && o.created_at < from + " 00:00:00") return false;
          if (to && o.created_at > to + " 23:59:59") return false;
          if (q) {
            const customer = db.customers.find((c) => c.id === o.customer_id);
            const hay = (o.order_no + " " + (customer && customer.name || "")).toLowerCase();
            if (!hay.includes(q.toLowerCase())) return false;
          }
          return true;
        })
        .sort((a, b) => b.id - a.id)
        .map((o) => hydrateOrder(db, o));
    },
    report(year, month) {
      const db = load();
      const from = `${year}-${month}-01 00:00:00`;
      const last = new Date(Number(year), Number(month), 0).getDate();
      const to = `${year}-${month}-${String(last).padStart(2, "0")} 23:59:59`;
      const orders = db.orders.filter((o) => o.created_at >= from && o.created_at <= to);
      const itemMap = {};
      const customerMap = {};
      const cashierMap = {};
      orders.forEach((o) => {
        const full = hydrateOrder(db, o);
        o.items.forEach((line) => {
          itemMap[line.name] = itemMap[line.name] || { name: line.name, qty: 0, sales: 0 };
          itemMap[line.name].qty += line.qty;
          itemMap[line.name].sales += line.line_total;
        });
        customerMap[full.customer_name] = customerMap[full.customer_name] || { name: full.customer_name, orders: 0, sales: 0 };
        customerMap[full.customer_name].orders += 1;
        customerMap[full.customer_name].sales += o.total;
        const cname = full.cashier_name || "Admin";
        cashierMap[cname] = cashierMap[cname] || { name: cname, orders: 0, sales: 0 };
        cashierMap[cname].orders += 1;
        cashierMap[cname].sales += o.total;
      });
      return {
        year, month,
        summary: {
          orders: orders.length,
          sales: orders.reduce((s, o) => s + o.total, 0),
          discounts: orders.reduce((s, o) => s + o.discount_total, 0),
        },
        items: Object.values(itemMap).sort((a, b) => b.qty - a.qty),
        customers: Object.values(customerMap).sort((a, b) => b.sales - a.sales),
        cashiers: Object.values(cashierMap).sort((a, b) => b.sales - a.sales),
      };
    },
    login(username, password) {
      const db = load();
      const user = db.users.find((u) => u.username === String(username).trim() && u.active);
      if (!user || user.password_hash !== hashPassword(password)) {
        throw new Error("Invalid username or password.");
      }
      if (user.role === "cashier") {
        const cashier = db.cashiers.find((c) => c.id === user.cashier_id);
        if (!cashier || !cashier.active) throw new Error("This cashier account is disabled.");
      }
      const cashier = db.cashiers.find((c) => c.id === user.cashier_id);
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        cashierId: user.cashier_id,
        displayName: cashier ? cashier.name : "Admin",
      };
    },
  };

  load();
  global.Store = Store;
})(window);
