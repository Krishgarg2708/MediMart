export type MedicineCategory = 
  | 'Chronic Care' 
  | 'Antibiotics & Infection' 
  | 'Pain & Fever Relief' 
  | 'Respiratory & Allergy' 
  | 'Vitamins & Nutrition' 
  | 'Digestive Health' 
  | 'First Aid & Surgical';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  category: MedicineCategory;
  requiresPrescription: boolean;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Inhaler' | 'Ointment' | 'Drops' | 'Injection';
  strength: string;
  packageSize: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  batchNumber: string;
  expiryDate: string;
  storageTemp: 'Room Temp (15-25°C)' | 'Cold Chain (2-8°C)';
  manufacturer: string;
  uses: string[];
  sideEffects: string[];
  contraindications: string[];
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  prescriptionRequired: boolean;
}

export interface ExtractedRxItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  matchedMedicineId?: string;
  inStock: boolean;
  approved: boolean;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  doctorName: string;
  doctorRegistrationNumber: string;
  clinicName: string;
  issuedDate: string;
  imageUrl: string;
  status: 'under_review' | 'verified' | 'rejected';
  pharmacistNotes?: string;
  verifiedByPharmacistName?: string;
  pharmacistLicenseNo?: string;
  verifiedAt?: string;
  extractedMedicines: ExtractedRxItem[];
  digitalRxSignature?: string;
  createdOrderEligible?: boolean;
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Inhaler';
  scheduleTime: string;
  timingCategory: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  instructions: 'Before food' | 'After food' | 'With water' | 'At bedtime';
  pillsRemaining: number;
  totalPackSize: number;
  refillThresholdDays: number;
  daysLeft: number;
  autoRefillEnabled: boolean;
  takenToday: boolean;
  lastTakenAt?: string;
  streakDays: number;
}

export type OrderStatus = 'placed' | 'rx_verified' | 'dispensed' | 'out_for_delivery' | 'delivered';

export interface DeliveryTracking {
  riderName: string;
  riderPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  coldChainTempCelsius: number;
  currentLatPercent: number; // For map visualization (0 to 100%)
  currentLngPercent: number;
  etaMinutes: number;
  steps: {
    status: OrderStatus;
    title: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryType: 'express_30min' | 'standard_scheduled';
  address: {
    fullName: string;
    phone: string;
    street: string;
    area: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: 'Cash on Delivery' | 'Instant UPI / Card' | 'Health Insurance Co-Pay';
  placedAt: string;
  estimatedDelivery: string;
  deliveryOtp: string;
  associatedPrescriptionId?: string;
  tracking: DeliveryTracking;
}

export type AppView = 'store' | 'prescription' | 'reminders' | 'tracking' | 'inventory';

export type UserRole = 'patient' | 'pharmacist' | 'rider' | 'inventory_manager';
