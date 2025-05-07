# HUNGER PLUSS+ Management System

A complete web-based QR Dish order system with customer ordering and table QR code functionality.

## Features

### Customer Panel
- Interactive menu browsing with category filtering and search
- Real-time order cart management
- Table-specific ordering

### Backend (New!)
- RESTful API for menu and order management
- MongoDB database integration
- WhatsApp notifications for order status updates

## Project Structure

```
/
├── index.html           # Main landing page
├── customer-panel.html  # Customer ordering interface
├── table-qr-generator.html # QR code generation for tables
├── css/
│   ├── main.css         # Main website styles
│   ├── customer-panel.css # Customer panel styles
└── js/
    └── customer-panel.js # Customer ordering system
└── backend/             # Server-side code
    ├── src/             # Source code
    │   ├── server.js    # Main server entry point
    │   ├── models/      # Database models
    │   ├── routes/      # API routes
    │   ├── controllers/ # Route controllers
    │   ├── services/    # Business logic services
    │   └── config/      # Configuration files
    └── package.json     # Backend dependencies
```

## Installation and Usage

### Frontend
1. Clone the repository or download the files
2. Open `index.html` in your web browser

### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB connection string and other settings
4. Start the development server: `npm run dev`
5. For database seeding: `npm run seed`

### Integration
For full functionality, the following is required:
- MongoDB database
- Node.js backend server running
- For WhatsApp notifications: Twilio account

## Technical Details

This project is built using:
- HTML5
- CSS3 with Flexbox and Grid
- Vanilla JavaScript
- Express.js backend
- MongoDB database
- Twilio for WhatsApp notifications
- FontAwesome icons

## License

This project is intended for educational purposes only.

## Future Improvements

- Mobile application for customer ordering
- Payment gateway integration
- Whatsapp notifications
- Admin dashboard for restaurant management 