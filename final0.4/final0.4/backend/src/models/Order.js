const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.ObjectId,
    ref: 'MenuItem',
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: [true, 'Order item must have a quantity'],
    min: [1, 'Quantity must be at least 1'],
  },
});

const orderSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, 'An order must have a table number'],
      min: [1, 'Table number must be above 0'],
    },
    customerName: {
      type: String,
      required: [true, 'An order must have a customer name'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'An order must have a customer phone number'],
      trim: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: [true, 'An order must have a subtotal'],
    },
    tax: {
      type: Number,
      required: [true, 'An order must have a tax amount'],
    },
    total: {
      type: Number,
      required: [true, 'An order must have a total'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
        message: 'Status must be either: pending, preparing, ready, delivered, cancelled',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['unpaid', 'paid'],
        message: 'Payment status must be either: unpaid, paid',
      },
      default: 'unpaid',
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for orderNumber (OD-YYYY-XXXXXX)
orderSchema.virtual('orderNumber').get(function () {
  const date = this.createdAt.toISOString().split('T')[0].replace(/-/g, '');
  const id = this._id.toString().slice(-6);
  
  return `OD-${date}-${id}`;
});

// Index to find orders by tableNumber
orderSchema.index({ tableNumber: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 