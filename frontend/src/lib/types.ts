export type Role = "buyer" | "seller" | "staff" | "admin";

export interface CollectionPoint {
  id: number;
  name: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  contact_phone: string;
  is_active: boolean;
}

export type ListingStatus = "active" | "sold_out" | "closed";
export type ProductType = "chick" | "egg";
export type EggGrade = "small" | "medium" | "large" | "extra_large";

export interface Listing {
  id: number;
  seller: number;
  seller_name: string;
  seller_latitude: string | null;
  seller_longitude: string | null;
  product_type: ProductType;
  breed: string;
  egg_grade: EggGrade | "";
  available_date: string;
  quantity_total: number;
  quantity_reserved: number;
  quantity_collected: number;
  quantity_available: number;
  sell_through_rate: number;
  price_per_unit: string;
  collection_point: number;
  collection_point_detail: CollectionPoint;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export type PaymentPlan = "deposit" | "full";

export type BookingStatus =
  | "pending_payment"
  | "payment_submitted"
  | "confirmed"
  | "collected"
  | "cancelled"
  | "expired";

export interface Booking {
  id: number;
  buyer: number;
  buyer_name: string;
  buyer_phone: string;
  listing: number;
  listing_detail: Listing;
  quantity: number;
  unit_price: string;
  total_amount: string;
  payment_plan: PaymentPlan;
  amount_due: string;
  status: BookingStatus;
  hold_expires_at: string;
  confirmed_at: string | null;
  collected_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export type PaymentMethod = "ecocash" | "onemoney" | "bank_transfer";
export type PaymentProofStatus = "pending" | "approved" | "rejected";

export interface PaymentProof {
  id: number;
  booking: number;
  method: PaymentMethod;
  reference_number: string;
  amount: string;
  screenshot: string;
  status: PaymentProofStatus;
  submitted_at: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  rejection_reason: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SellerDashboard {
  total_listings: number;
  total_units_listed: number;
  total_reserved: number;
  total_collected: number;
  sell_through_rate: number;
  cancellation_rate: number;
  bookings_over_time: { date: string; count: number }[];
  top_products: { label: string; booked_quantity: number }[];
}

export interface StaffDashboard extends SellerDashboard {
  total_sellers: number;
  commission_revenue: number;
  listing_fee_revenue: number;
  pending_payment_proofs: number;
}
