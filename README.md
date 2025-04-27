# Ceylon Burgers POS System

A Point of Sale (POS) system for Ceylon Burgers restaurant, featuring admin and cashier interfaces for efficient restaurant management.

## Features

### Admin Panel
- Monthly sales reporting with PDF export
- Food item management (add, edit, delete)
- Order history tracking with filtering options
- Cashier management

### Cashier Panel
- Process customer orders
- Customer management
- View food items inventory
- Order history tracking

## System Requirements

- Modern web browser with JavaScript enabled
- Local web server (for development)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/ceylon-burgers.git
   ```

2. Open index.html in a web browser or set up a local server.

3. Default login credentials:
   - **Admin:** Password: CBA@2004
   - **Cashier:** Password: CBC@2004

## Technology Stack

- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (Vanilla)
- Local Storage for data persistence

## Project Structure

```
Ceylon-Burgers/
├── admin/              # Admin panel files
├── cashier/            # Cashier panel files
├── icon/               # Favicon and app icons
├── img/                # Product and UI images
├── app.js              # Main application logic
├── index.html          # Login page
└── README.md           # Project documentation
```

## Usage

1. Login using admin or cashier credentials
2. Navigate through the dashboard to access different functions
3. Admin can generate reports, manage inventory, and monitor sales
4. Cashiers can place orders and manage customers

## Data Storage

The application uses browser Local Storage to maintain data persistence. Initial sample data is loaded on first run.

## License

[MIT License](LICENSE)

## Contributors

- [Your Name](https://github.com/your-username)

---

&copy; 2025 Ceylon Burgers