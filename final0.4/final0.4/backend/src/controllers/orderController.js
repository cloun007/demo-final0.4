const Order = require('../models/Order');
const whatsappService = require('../services/whatsappService');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // Build query
    let query = Order.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Execute query
    const orders = await query;

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);

    // Send WhatsApp notification to the customer
    try {
      await whatsappService.sendOrderConfirmation(newOrder);
      newOrder.notificationSent = true;
      await newOrder.save();
    } catch (notificationError) {
      console.error('Failed to send WhatsApp notification:', notificationError);
    }

    res.status(201).json({
      status: 'success',
      data: newOrder,
      orderId: newOrder.orderNumber,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    // Send WhatsApp status update notification
    if (req.body.status && req.body.status !== order.status) {
      try {
        await whatsappService.sendOrderStatusUpdate(order);
      } catch (notificationError) {
        console.error('Failed to send WhatsApp notification:', notificationError);
      }
    }

    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get orders by table number
exports.getOrdersByTable = async (req, res) => {
  try {
    const tableNumber = req.params.tableNumber;
    const orders = await Order.find({ tableNumber }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}; 