# Ceylon Burgers

Static restaurant menu + counter POS + admin back office. Data stays in the browser (`localStorage`), so the site can run on **GitHub Pages** with no server.

## Live / local

Open `index.html` in a browser, or push this repo and enable GitHub Pages (branch `main`, folder `/`).

Demo logins (same on every visitor’s own browser storage):

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `CBA@2004` |
| Cashier | `cashier1` | `CBC@2004` |
| Cashier | `cashier2` | `CBC@2004` |

## What is here

- **Guests** (`index.html`): public menu. No login. Order at the counter.
- **POS** (`pos.html`): category tiles, ticket, cash, receipt. Stock drops on sale.
- **Admin** (`admin.html`): menu, cashiers + logins, customers, orders, monthly PDF.

Each visitor gets their own local data. Clearing site data reseeds the menu and default staff.
