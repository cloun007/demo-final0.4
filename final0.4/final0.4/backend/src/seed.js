const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');

// Load environment variables
dotenv.config();

// Sample menu data
const menuData = {
    starters: [
        { name: 'Garlic Bread', price: 4.99, image: 'https://images.unsplash.com/photo-1619535860434-ba0aa598f49b?w=500', category: 'starters', description: 'Freshly baked bread with garlic butter', isAvailable: true },
        { name: 'Bruschetta', price: 6.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500', category: 'starters', description: 'Toasted bread topped with tomatoes, garlic, and fresh basil', isAvailable: true },
        { name: 'Mozzarella Sticks', price: 5.99, image: 'https://images.unsplash.com/photo-1548340748-6d98de4a31b0?w=500', category: 'starters', description: 'Deep-fried mozzarella cheese, breaded with Italian seasoning', isAvailable: true },
        { name: 'Caesar Salad', price: 7.99, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', category: 'starters', description: 'Classic Caesar salad with romaine lettuce, croutons, and parmesan', isAvailable: true }
    ],
    mainCourse: [
        { name: 'Margherita Pizza', price: 12.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', category: 'mainCourse', description: 'Classic pizza with tomato sauce, mozzarella, and basil', isAvailable: true },
        { name: 'Beef Tenderloin', price: 24.99, image: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?w=500', category: 'mainCourse', description: 'Grilled beef tenderloin with rosemary potatoes', isAvailable: true },
        { name: 'Chicken Alfredo', price: 15.99, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500', category: 'mainCourse', description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken', isAvailable: true },
        { name: 'Vegetable Curry', price: 13.99, image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d1c?w=500', category: 'mainCourse', description: 'Mixed vegetables in a spicy curry sauce with steamed rice', isAvailable: true },
        { name: 'Beef Burger', price: 11.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', category: 'mainCourse', description: 'Juicy beef patty with lettuce, tomato, and special sauce', isAvailable: true },
        { name: 'Grilled Salmon', price: 18.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', category: 'mainCourse', description: 'Fresh grilled salmon with lemon butter sauce', isAvailable: true }
    ],
    desserts: [
        { name: 'Tiramisu', price: 6.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', category: 'desserts', description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', isAvailable: true },
        { name: 'Chocolate Cake', price: 5.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', category: 'desserts', description: 'Rich chocolate cake with ganache frosting', isAvailable: true },
        { name: 'Cheesecake', price: 6.99, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', category: 'desserts', description: 'Creamy New York style cheesecake with berry compote', isAvailable: true },
        { name: 'Ice Cream', price: 4.99, image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=500', category: 'desserts', description: 'Assorted flavors of premium ice cream', isAvailable: true }
    ],
    drinks: [
        { name: 'Soda', price: 2.99, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500', category: 'drinks', description: 'Selection of refreshing sodas', isAvailable: true },
        { name: 'Iced Tea', price: 2.99, image: 'https://images.unsplash.com/photo-1556679343-c1c4b8b4a28b?w=500', category: 'drinks', description: 'Freshly brewed iced tea with lemon', isAvailable: true },
        { name: 'Coffee', price: 3.99, image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=500', category: 'drinks', description: 'Premium coffee, served hot or cold', isAvailable: true },
        { name: 'Fresh Juice', price: 4.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', category: 'drinks', description: 'Freshly squeezed fruit juices', isAvailable: true }
    ]
};

// Function to seed database
const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger-pluss');
    console.log('Connected to MongoDB for seeding');
    
    // Delete existing menu items
    await MenuItem.deleteMany({});
    console.log('Deleted existing menu items');
    
    // Create all menu items from the sample data
    const allItems = [
      ...menuData.starters,
      ...menuData.mainCourse,
      ...menuData.desserts,
      ...menuData.drinks
    ];
    
    await MenuItem.insertMany(allItems);
    console.log(`${allItems.length} menu items seeded successfully`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDB(); 