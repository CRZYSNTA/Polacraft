export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  image?: string;
  verifiedPurchase: boolean;
  createdAt: Date | string;
}
