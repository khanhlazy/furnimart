/**
 * Shared types và interfaces cho toàn bộ ứng dụng
 * Tránh định nghĩa trùng lặp ở nhiều file
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee' | 'shipper' | 'customer';
  phone?: string;
  address?: string;
  isActive: boolean;
}

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  unit?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  category: string;
  categoryId: string;
  stock: number;
  isActive?: boolean;
  isFeatured?: boolean;
  colors?: string[];
  dimensions?: Dimensions;
  model3d?: string;
  materials?: string[];
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  category: string;
  categoryId: string;
  images?: string[];
  model3d?: string;
  materials?: string[];
  colors?: string[];
  dimensions?: Dimensions;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface Order {
  _id: string;
  userId?: string;
  customerId?: string;
  items: OrderItem[] | Array<{ productId: string; productName: string; quantity: number; price?: number }>;
  total?: number;
  totalPrice?: number;
  totalDiscount?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | string;
  shippingAddress?: Address | string;
  phone?: string;
  paymentMethod: 'cod' | 'stripe' | 'momo' | string;
  isPaid?: boolean;
  notes?: string;
  shipperId?: string;
  trackingNumber?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  recipientName: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface Review {
  _id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Chat {
  _id: string;
  customerId: string;
  customerName: string;
  employeeId?: string;
  employeeName?: string;
  messages: Message[];
  status: 'open' | 'closed' | 'pending';
  subject?: string;
  lastMessageAt: string;
  isReadByCustomer?: boolean;
  isReadByEmployee?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'employee' | 'admin';
  message: string;
  images?: string[];
  isRead: boolean;
  sentAt: string;
}

export interface Dispute {
  _id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  type: 'quality' | 'damage' | 'missing' | 'wrong_item' | 'delivery' | 'payment' | 'other';
  reason: string;
  description: string;
  images?: string[];
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected' | 'escalated';
  reviewedBy?: string;
  reviewNote?: string;
  resolution?: string;
  refundAmount?: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Warehouse {
  _id: string;
  productId: string;
  quantity: number;
  reserved: number;
  location: string;
}

export interface Shipping {
  _id: string;
  orderId: string;
  shipperId: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  currentLocation?: string;
  estimatedDelivery?: string;
  proofOfDeliveryImage?: string;
  customerSignature?: string;
  deliveryNote?: string;
  trackingHistory?: Array<{
    status: string;
    location?: string;
    note?: string;
    timestamp: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

