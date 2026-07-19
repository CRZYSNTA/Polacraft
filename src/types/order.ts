export interface OrderItem {
  cartId?: string;
  id: string;
  title: string;
  slug: string;
  size: string;
  frame: string;
  price: number;
  quantity: number;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  email: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  shippingStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "RETURNED";
  createdAt: Date | string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  active: boolean;
  expiryDate?: string;
}
