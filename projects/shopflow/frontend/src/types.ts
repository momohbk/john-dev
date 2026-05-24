export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  type: 'size' | 'color';
  stock: number;
  price_modifier: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_option?: string;
  payment_method?: string;
  created_at: string;
  items: OrderItem[];
  user_name?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  recentOrders: Order[];
}

export interface Review {
  id: number;
  product_id: number;
  customer_name: string;
  customer_phone?: string;
  rating: number;
  text: string;
  is_approved: boolean;
  created_at: string;
  product_name?: string;
}

export interface Banner {
  id: number;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Settings {
  store_name: string;
  store_logo: string;
  contact_email: string;
  contact_phone: string;
  delivery_fee: string;
  free_delivery_threshold: string;
  delivery_time_message: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  [key: string]: string;
}
