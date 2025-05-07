# HUNGER PLUSS+ Backend API

Backend server for the HUNGER PLUSS+ Management System.

## Features

- RESTful API for menu management and order processing
- MongoDB database integration
- WhatsApp notifications for order confirmations and status updates

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Twilio API for WhatsApp notifications

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB installed locally or a MongoDB Atlas account
- Twilio account for WhatsApp notifications (optional)

### Installation

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hunger-pluss
   NODE_ENV=development
   
   # Twilio credentials (optional, for WhatsApp notifications)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=your_twilio_whatsapp_number
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. The server will be running at `http://localhost:5000`

## API Endpoints

### Menu Items

- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create a new menu item
- `GET /api/menu/:id` - Get a specific menu item
- `PATCH /api/menu/:id` - Update a menu item
- `DELETE /api/menu/:id` - Delete a menu item

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get a specific order
- `PATCH /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order
- `GET /api/orders/table/:tableNumber` - Get orders for a specific table

## WhatsApp Notifications

The system uses Twilio to send WhatsApp notifications to customers:

1. When an order is placed (order confirmation)
2. When an order status changes (status updates)

To enable WhatsApp notifications:

1. Create a Twilio account
2. Set up the WhatsApp Sandbox in your Twilio account
3. Add your Twilio credentials to the `.env` file

## Connecting with the Frontend

The frontend is already set up to connect with this backend. In the frontend JavaScript files:

1. Uncomment the API fetch calls in `js/customer-panel.js`
2. Update the API URLs if your backend is running on a different port/domain 