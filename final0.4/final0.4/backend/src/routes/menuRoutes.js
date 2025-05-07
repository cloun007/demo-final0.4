const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router
  .route('/')
  .get(menuController.getAllMenuItems)
  .post(menuController.createMenuItem);

router
  .route('/:id')
  .get(menuController.getMenuItem)
  .patch(menuController.updateMenuItem)
  .delete(menuController.deleteMenuItem);

module.exports = router; 