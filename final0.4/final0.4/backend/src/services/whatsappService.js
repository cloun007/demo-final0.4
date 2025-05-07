const twilio = require('twilio');

// Initialize Twilio client with environment variables
const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

/**
 * Send order confirmation to customer via WhatsApp
 */
exports.sendOrderConfirmation = async (order) => {
  if (!client || !whatsappNumber) {
    console.log('WhatsApp notifications disabled: Twilio credentials not set');
    return;
  }
  
  try {
    // Format order items for the message
    const itemsList = order.items.map(
      item => `- ${item.quantity}x ${item.name} ($${item.price.toFixed(2)})`
    ).join('\n');
    
    // Create the message
    const message = `
🍽️ *HUNGER PLUSS Order Confirmation* 🍽️

Dear ${order.customerName},
Thank you for your order at HUNGER PLUSS!

*Order Number:* ${order.orderNumber}
*Table:* ${order.tableNumber}
*Time:* ${new Date(order.createdAt).toLocaleTimeString()}

*Your Order:*
${itemsList}

*Subtotal:* $${order.subtotal.toFixed(2)}
*Tax:* $${order.tax.toFixed(2)}
*Total:* $${order.total.toFixed(2)}

Your order is being prepared. We'll notify you when it's ready!
`;

    // Send the WhatsApp message
    await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${order.customerPhone}`,
      body: message,
    });
    
    console.log(`WhatsApp notification sent to ${order.customerPhone}`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
};

/**
 * Send order status update to customer via WhatsApp
 */
exports.sendOrderStatusUpdate = async (order) => {
  if (!client || !whatsappNumber) {
    console.log('WhatsApp notifications disabled: Twilio credentials not set');
    return;
  }
  
  try {
    // Create status message based on order status
    let statusMessage = '';
    
    switch (order.status) {
      case 'preparing':
        statusMessage = "Your order is now being prepared by our chefs.";
        break;
      case 'ready':
        statusMessage = "Great news! Your order is ready and will be served shortly.";
        break;
      case 'delivered':
        statusMessage = "Your order has been delivered. Enjoy your meal!";
        break;
      case 'cancelled':
        statusMessage = "We're sorry, but your order has been cancelled. Please contact us for assistance.";
        break;
      default:
        statusMessage = `Your order status has been updated to: ${order.status}`;
    }
    
    // Create the message
    const message = `
🍽️ *HUNGER PLUSS Order Update* 🍽️

Dear ${order.customerName},

*Order Number:* ${order.orderNumber}
*Status Update:* ${statusMessage}

Thank you for dining with HUNGER PLUSS!
`;

    // Send the WhatsApp message
    await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${order.customerPhone}`,
      body: message,
    });
    
    console.log(`Status update WhatsApp notification sent to ${order.customerPhone}`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
}; 