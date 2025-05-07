const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    
    // Group items by category
    const menuByCategory = {
      starters: menuItems.filter(item => item.category === 'starters'),
      mainCourse: menuItems.filter(item => item.category === 'mainCourse'),
      desserts: menuItems.filter(item => item.category === 'desserts'),
      drinks: menuItems.filter(item => item.category === 'drinks'),
    };
    
    res.status(200).json({
      status: 'success',
      data: menuByCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Menu item not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
  try {
    const newMenuItem = await MenuItem.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!menuItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Menu item not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Menu item not found',
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