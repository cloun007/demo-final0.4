const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A menu item must have a name'],
      trim: true,
      maxlength: [50, 'A menu item name must have less or equal than 50 characters'],
    },
    price: {
      type: Number,
      required: [true, 'A menu item must have a price'],
      min: [0, 'Price must be above 0'],
    },
    image: {
      type: String,
      required: [true, 'A menu item must have an image'],
    },
    category: {
      type: String,
      required: [true, 'A menu item must belong to a category'],
      enum: {
        values: ['starters', 'mainCourse', 'desserts', 'drinks'],
        message: 'Category must be either: starters, mainCourse, desserts, drinks',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; 