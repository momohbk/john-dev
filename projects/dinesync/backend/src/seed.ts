import { getDb } from './db.js';
import bcrypt from 'bcryptjs';

const db = getDb();

// Clear existing data
db.exec('DELETE FROM menu_items; DELETE FROM reservations; DELETE FROM users;');

// Seed users
const adminPassword = bcrypt.hashSync('admin123', 10);
db.prepare(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`).run('Admin', 'admin@dinesync.com', adminPassword);

// Seed menu items
const menuItems = [
  { name: 'Bruschetta', description: 'Toasted bread with tomato, basil, and mozzarella.', price: 12, category: 'Appetizers', available: 1 },
  { name: 'Calamari', description: 'Crispy fried squid with marinara sauce.', price: 14, category: 'Appetizers', available: 1 },
  { name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons, Caesar dressing.', price: 11, category: 'Appetizers', available: 1 },
  { name: 'Grilled Salmon', description: 'Atlantic salmon with herb crust and lemon butter.', price: 28, category: 'Main Course', available: 1 },
  { name: 'Wagyu Steak', description: 'Prime Japanese wagyu with truffle mash.', price: 55, category: 'Main Course', available: 1 },
  { name: 'Chicken Parmesan', description: 'Breaded chicken with marinara and melted mozzarella.', price: 22, category: 'Main Course', available: 1 },
  { name: 'Pasta Carbonara', description: 'Spaghetti with pancetta, egg, and parmesan.', price: 18, category: 'Main Course', available: 0 },
  { name: 'Tiramisu', description: 'Classic Italian tiramisu with mascarpone.', price: 14, category: 'Desserts', available: 1 },
  { name: 'Panna Cotta', description: 'Vanilla panna cotta with berry compote.', price: 12, category: 'Desserts', available: 1 },
  { name: 'Espresso', description: 'Double shot of our house espresso blend.', price: 4, category: 'Beverages', available: 1 },
  { name: 'House Wine', description: 'Glass of our selected house red or white wine.', price: 9, category: 'Beverages', available: 1 },
];

const insertMenu = db.prepare(`INSERT INTO menu_items (name, description, price, category, available) VALUES (@name, @description, @price, @category, @available)`);
for (const item of menuItems) {
  insertMenu.run(item);
}

// Seed reservations
const reservations = [
  { name: 'John Smith', email: 'john@example.com', phone: '555-0101', date: '2026-05-20', time: '18:00', guests: 4, status: 'confirmed', notes: 'Anniversary dinner' },
  { name: 'Emily Johnson', email: 'emily@example.com', phone: '555-0102', date: '2026-05-20', time: '19:00', guests: 2, status: 'pending', notes: '' },
  { name: 'Michael Brown', email: 'michael@example.com', phone: '555-0103', date: '2026-05-20', time: '20:00', guests: 6, status: 'confirmed', notes: 'Business dinner' },
  { name: 'Sarah Davis', email: 'sarah@example.com', phone: '555-0104', date: '2026-05-20', time: '17:30', guests: 3, status: 'pending', notes: 'Vegetarian preferences' },
];

const insertReservation = db.prepare(`INSERT INTO reservations (name, email, phone, date, time, guests, status, notes) VALUES (@name, @email, @phone, @date, @time, @guests, @status, @notes)`);
for (const r of reservations) {
  insertReservation.run(r);
}

console.log('Database seeded successfully');
process.exit(0);
