import { initDb, get, run, exec } from './db.js';
import bcrypt from 'bcryptjs';

await initDb();

const existing = get('SELECT COUNT(*) as count FROM products');
if (existing && (existing as any).count > 0) {
  console.log('Database already seeded. To re-seed, delete the data/shopflow.db file.');
  process.exit(0);
}

const adminPassword = bcrypt.hashSync('admin123', 10);

exec(`
  INSERT INTO users (email, password, name, role) VALUES
    ('admin@bagstyle.dz', '${adminPassword}', 'مدير المتجر', 'admin'),
    ('customer@example.com', '${adminPassword}', 'زينب عبد الله', 'customer');
`);

exec(`
  INSERT INTO categories (name, slug, description) VALUES
    ('حقائب يد', 'handbags', 'حقائب يد أنيقة وعصرية تناسب جميع المناسبات'),
    ('حقائب كتف', 'shoulder-bags', 'حقائب كتف مريحة وعملية ليومك المثالي'),
    ('حقائب كبيرة', 'tote-bags', 'حقائب كبيرة الحجم مثالية للتسوق والسفر'),
    ('حقائب سهرة', 'clutches', 'حقائب سهرة صغيرة أنيقة للمناسبات الخاصة'),
    ('حقائب ظهر', 'backpacks', 'حقائب ظهر عصرية تجمع بين الأناقة والعملية');
`);

const products = [
  { name: 'حقيبة يد جلدية فاخرة', description: 'حقيبة يد جلدية طبيعية فاخرة بتصميم عصري أنيق. مصنوعة من أجود أنواع الجلد الإيطالي مع مقبضين من الجلد المدبوغ. تحتوي على جيوب داخلية متعددة وسحاب آمن.', price: 8900, stock: 15, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80', cat: 1 },
  { name: 'حقيبة كتف عصرية', description: 'حقيبة كتف عصرية بتصميم فريد ومريح. مثالية للاستخدام اليومي مع حزام كتف قابل للتعديل. مصنوعة من القماش المقاوم للماء مع بطانة داخلية حريرية.', price: 5500, stock: 25, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80', cat: 2 },
  { name: 'حقيبة كبيرة للتسوق', description: 'حقيبة كبيرة وعملية مثالية للتسوق اليومي والسفر. تتسع لكل أغراضك الضرورية مع جيوب تنظيمية متعددة. مصنوعة من قماش الكانفاس المتين.', price: 4200, stock: 30, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', cat: 3 },
  { name: 'حقيبة سهرة مرصعة', description: 'حقيبة سهرة صغيرة أنيقة مرصعة بالخرز اللامع. مثالية للحفلات والمناسبات الخاصة. تأتي مع سلسلة كتف قابلة للإزالة.', price: 6800, stock: 10, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80', cat: 4 },
  { name: 'حقيبة ظهر عصرية', description: 'حقيبة ظهر عصرية تجمع بين الأناقة والعملية. مناسبة للجامعة والعمل والسفر. تحتوي على جيب للحاسوب المحمول ومنافذ USB.', price: 7500, stock: 20, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', cat: 5 },
  { name: 'حقيبة يد صغيرة', description: 'حقيبة يد صغيرة بتصميم أنيق وناعم. مثالية للخروجات المسائية والمناسبات. مصنوعة من الجلد الناعم مع تفاصيل ذهبية.', price: 4800, stock: 18, image: 'https://images.unsplash.com/photo-1566576721349-d3f49f2a2d33?w=600&q=80', cat: 1 },
  { name: 'حقيبة كتف جلدية', description: 'حقيبة كتف جلدية فاخرة بتصميم كلاسيكي أنيق. تتميز بمساحة داخلية واسعة وجيوب متعددة. حزام كتف عريض ومريح.', price: 9200, stock: 12, image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600&q=80', cat: 2 },
  { name: 'حقيبة كبيرة عملية', description: 'حقيبة كبيرة الحجم مثالية للعمل والسفر. تتسع للحاسوب المحمول والملفات والأغراض الشخصية. مصنوعة من القماش المتين.', price: 3800, stock: 35, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', cat: 3 },
  { name: 'حقيبة سهرة ذهبية', description: 'حقيبة سهرة ذهبية لامعة بتصميم أنيق وجذاب. مثالية للحفلات والمناسبات الرسمية. تأتي مع حقيبة يد صغيرة منفصلة.', price: 7500, stock: 8, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80', cat: 4 },
  { name: 'حقيبة ظهر جلدية', description: 'حقيبة ظهر جلدية فاخرة بتصميم عصري أنيق. مناسبة للرجال والنساء. تحتوي على عدة جيوب تنظيمية ومنفذ USB خارجي.', price: 8500, stock: 15, image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&q=80', cat: 5 },
];

for (const p of products) {
  run(
    `INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [p.name, p.description, p.price, p.stock, p.image, p.cat, 1]
  );
}

// Seed sample reviews
run(`INSERT INTO reviews (product_id, customer_name, rating, text, is_approved) VALUES (?, ?, ?, ?, ?)`, [1, 'فاطمة الزهراء', 5, 'حقيبة رائعة جداً! الخامة ممتازة والتصميم أنيق. التوصيل كان سريع في أقل من 24 ساعة.', 1]);
run(`INSERT INTO reviews (product_id, customer_name, rating, text, is_approved) VALUES (?, ?, ?, ?, ?)`, [1, 'مريم عثمان', 4, 'الحقيبة جميلة جداً وجودة الجلد ممتازة. أنصح بها الجميع.', 1]);
run(`INSERT INTO reviews (product_id, customer_name, rating, text, is_approved) VALUES (?, ?, ?, ?, ?)`, [2, 'سارة أحمد', 5, 'حقيبة كتف مريحة جداً وأنيقة. أستخدمها يومياً.', 1]);
run(`INSERT INTO reviews (product_id, customer_name, rating, text, is_approved) VALUES (?, ?, ?, ?, ?)`, [3, 'نور الهدى', 5, 'حقيبة كبيرة الحجم مناسبة جداً للتسوق. خامة ممتازة.', 1]);
run(`INSERT INTO reviews (product_id, customer_name, rating, text, is_approved) VALUES (?, ?, ?, ?, ?)`, [5, 'آية كريم', 4, 'حقيبة ظهر مريحة وعملية. تناسب الجامعة تماماً.', 1]);

// Seed default settings
const defaultSettings = [
  ['store_name', 'BagStyle DZ'],
  ['store_logo', ''],
  ['contact_email', 'contact@bagstyle.dz'],
  ['contact_phone', '0550 12 34 56'],
  ['delivery_fee', '500'],
  ['free_delivery_threshold', '5000'],
  ['delivery_time_message', 'مدة التوصيل بين 24 ساعة و 72 ساعة حسب مكان التوصيل'],
  ['facebook_url', 'https://facebook.com/bagstyledz'],
  ['instagram_url', 'https://instagram.com/bagstyledz'],
  ['tiktok_url', 'https://tiktok.com/@bagstyledz'],
];

for (const [key, value] of defaultSettings) {
  run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
}

// Seed default banners
run(`INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
  ['مجموعة الحقائب الجديدة', 'اكتشفي أحدث صيحات الموضة في عالم الحقائب الفاخرة', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80', '/products', 1, 1]);
run(`INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
  ['تخفيضات تصل إلى 30%', 'عروض حصرية على مجموعة مختارة من الحقائب', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80', '/products', 2, 1]);

// Seed default pixels
run('INSERT INTO pixels (platform, tracking_id, is_active) VALUES (?, ?, ?)', ['facebook', 'YOUR_FB_PIXEL_ID', 0]);
run('INSERT INTO pixels (platform, tracking_id, is_active) VALUES (?, ?, ?)', ['tiktok', 'YOUR_TIKTOK_PIXEL_ID', 0]);
run('INSERT INTO pixels (platform, tracking_id, is_active) VALUES (?, ?, ?)', ['google_analytics', 'G-XXXXXXXXXX', 0]);
run('INSERT INTO pixels (platform, tracking_id, is_active) VALUES (?, ?, ?)', ['google_tag_manager', 'GTM-XXXXXXX', 0]);

// Seed variants for some products
run(`INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`, [1, 'صغير', 'size', 5, 0]);
run(`INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`, [1, 'متوسط', 'size', 8, 500]);
run(`INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`, [1, 'كبير', 'size', 2, 1000]);
run(`INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`, [2, 'أسود', 'color', 10, 0]);
run(`INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`, [2, 'بني', 'color', 8, 0]);
run(`INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`, [2, 'بيج', 'color', 7, 0]);

console.log('');
console.log('========== BagStyle DZ - تم تجهيز قاعدة البيانات ==========');
console.log('');
console.log('👜 10 منتجات حقائب يد');
console.log('📁 5 تصنيفات');
console.log('⭐ 5 تقييمات');
console.log('🖼️  2 بانرات');
console.log('⚙️  10 إعدادات');
console.log('🎯 4 بكسلز تسويقية');
console.log('📦 6 متغيرات منتجات');
console.log('');
console.log('🔑 دخول المدير: admin@bagstyle.dz / admin123');
console.log('');
process.exit(0);
