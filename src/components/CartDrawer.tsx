import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { CartItem, Order, Prescription } from '../types/pharmacy';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (medicineId: string, quantity: number) => void;
  onRemoveItem: (medicineId: string) => void;
  prescriptions: Prescription[];
  onPlaceOrder: (newOrder: Order) => void;
  onNavigateToUpload: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  prescriptions,
  onPlaceOrder,
  onNavigateToUpload,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'express_30min' | 'standard_scheduled'>('express_30min');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Instant UPI / Card' | 'Health Insurance Co-Pay'>('Instant UPI / Card');
  const [selectedRxId, setSelectedRxId] = useState<string>(
    prescriptions.find((p) => p.status === 'verified')?.id || prescriptions[0]?.id || ''
  );

  const [address, setAddress] = useState({
    fullName: 'Sarah Jenkins',
    phone: '+1 (555) 234-8910',
    street: '742 Evergreen Terrace, Apt 4B',
    area: 'Oakland Hills',
    city: 'San Francisco Bay Area',
    zipCode: '94611',
  });

  if (!isOpen) return null;

  const requiresPrescription = cart.some((item) => item.medicine.requiresPrescription);
  const verifiedPrescriptions = prescriptions.filter((p) => p.status === 'verified');
  const hasVerifiedRx = verifiedPrescriptions.length > 0;

  const subtotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const discount = subtotal > 20 ? subtotal * 0.1 : 0; // 10% wellness discount
  const deliveryFee = deliveryType === 'express_30min' ? (subtotal > 35 ? 0 : 3.50) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `MM-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'out_for_delivery',
      deliveryType,
      address: { ...address },
      paymentMethod,
      placedAt: 'Just now',
      estimatedDelivery: deliveryType === 'express_30min' ? '28 mins (Express Delivery)' : 'Today by 06:00 PM',
      deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      associatedPrescriptionId: requiresPrescription ? selectedRxId : undefined,
      tracking: {
        riderName: 'Rahul Kumar',
        riderPhone: '+1 (555) 782-9901',
        vehicleNumber: 'EV-MED-042',
        vehicleType: 'Hero Electric Nyx (Cold-Chain Box)',
        coldChainTempCelsius: 4.1,
        currentLatPercent: 55,
        currentLngPercent: 48,
        etaMinutes: 24,
        steps: [
          {
            status: 'placed',
            title: 'Order Placed & Confirmed',
            description: 'Dispensary order generated from electronic inventory.',
            time: 'Just now',
            completed: true
          },
          {
            status: 'rx_verified',
            title: 'Prescription Validated by Pharmacist',
            description: 'Checked and signed with digital license RPH-883921.',
            time: 'In Progress',
            completed: true
          },
          {
            status: 'dispensed',
            title: 'Packed in Tamper-Evident Bag',
            description: 'Assigned to cold-chain bag #CB-12.',
            time: 'Pending dispatch',
            completed: true
          },
          {
            status: 'out_for_delivery',
            title: 'Rider Dispatched for Delivery',
            description: 'Courier en route to delivery address.',
            time: '24 mins away',
            completed: true
          },
          {
            status: 'delivered',
            title: 'Delivery Handover',
            description: 'Requires customer 4-digit verification PIN.',
            time: 'Upcoming',
            completed: false
          }
        ]
      }
    };

    onPlaceOrder(newOrder);
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isCheckingOut ? 'Express Checkout & Delivery' : 'Your Medicine Bag'}
            </h2>
            <span className="text-xs text-slate-500">
              ({cart.reduce((c, i) => c + i.quantity, 0)} items)
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prescription Requirement Warning if items require Rx */}
        {requiresPrescription && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Contains Prescription (Rx) Medicines</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Legally requires a verified prescription from a registered physician. A licensed pharmacist will inspect your document before dispatch.
              </p>
              {!hasVerifiedRx && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToUpload();
                  }}
                  className="mt-1 text-xs font-bold text-amber-950 underline hover:text-amber-800 cursor-pointer"
                >
                  Upload or Select Prescription Now →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Your medicine bag is empty</p>
              <p className="text-xs text-slate-500">Add medicines, healthcare products, or upload an Rx to start.</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
              >
                Browse Medicines
              </button>
            </div>
          ) : !isCheckingOut ? (
            /* Items list */
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.medicine.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center gap-4"
                >
                  <img
                    src={item.medicine.image}
                    alt={item.medicine.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="font-semibold text-teal-700">{item.medicine.brandName}</span>
                      {item.medicine.requiresPrescription && (
                        <span className="text-rose-600 font-bold">· Rx</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate" title={item.medicine.name}>
                      {item.medicine.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                      ${item.medicine.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.medicine.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold font-mono tabular-nums text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.medicine.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.medicine.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handleCreateOrder} className="space-y-5">
              {/* Delivery Speed Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Delivery Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryType('express_30min')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryType === 'express_30min'
                        ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs">
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                      <span>30-Min Express</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Priority dispatch via refrigerated courier. $3.50 (Free over $35).
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryType('standard_scheduled')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryType === 'standard_scheduled'
                        ? 'bg-teal-50/70 border-teal-500 ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Standard Slot</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Delivered today by 06:00 PM. Completely Free.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescription Attachment selector if needed */}
              {requiresPrescription && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Attach Verified Prescription
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToUpload();
                      }}
                      className="text-[11px] text-teal-700 font-semibold hover:underline cursor-pointer"
                    >
                      + Upload New
                    </button>
                  </div>

                  <select
                    value={selectedRxId}
                    onChange={(e) => setSelectedRxId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {prescriptions.map((rx) => (
                      <option key={rx.id} value={rx.id}>
                        {rx.patientName} · {rx.doctorName} ({rx.status.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Home Delivery Address */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  Delivery Address
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Recipient Full Name"
                    className="col-span-2 p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="Mobile Phone"
                    className="col-span-2 p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="House / Flat / Street address"
                    className="col-span-2 p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    placeholder="Postal / Zip Code"
                    className="p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                  Payment Method
                </label>

                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'Instant UPI / Card', label: 'Instant UPI / Debit / Credit Card (Recommended)' },
                    { id: 'Cash on Delivery', label: 'Cash on Delivery (Pay at Doorstep)' },
                    { id: 'Health Insurance Co-Pay', label: 'Direct Health Insurance Claim Co-Pay' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'bg-teal-50/50 border-teal-500 font-medium text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer with Bill Breakdown */}
        {cart.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Medicine Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-teal-700 font-medium">
                  <span>Co-pay & Health Discount (10%)</span>
                  <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? <span className="text-teal-700 font-semibold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Delivery & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="w-1/3 py-2.5 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Back to Bag
                </button>
                <button
                  form="checkout-form"
                  type="submit"
                  className="w-2/3 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Confirm & Place Order</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
