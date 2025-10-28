export interface Booking {
  bookingId: number;
  bookingDate: string;
  returnDate: string;
  username: string;
  useremail: string;
  vehicleName?: string;
  categoryName?: string;
  price: number;
  pickuplocation: string;
  droplocation: string;
  licenseNo: string;
  licenseImg?: string;
  paymentMethod: string;
  paymentStatus: string;
  deliverystatus: string;
  createdAt: string;
  updateAt: string;
  id: string;
  userId: string;
  vehicleId: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
}
