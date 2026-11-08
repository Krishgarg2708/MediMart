import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MedicineStore } from './components/MedicineStore';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PrescriptionPortal } from './components/PrescriptionPortal';
import { MedicineReminders } from './components/MedicineReminders';
import { InventoryManager } from './components/InventoryManager';
import { LiveDeliveryTracking } from './components/LiveDeliveryTracking';
import { 
  AppView, 
  UserRole, 
  Medicine, 
  CartItem, 
  Prescription, 
  MedicineReminder, 
  Order, 
  OrderStatus,
  ExtractedRxItem 
} from './types/pharmacy';
import { 
  INITIAL_MEDICINES, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_REMINDERS, 
  INITIAL_ORDERS 
} from './data/mockData';
import { CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('store');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  
  // Application Data States
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [cart, setCart] = useState<CartItem[]>([
    {
      medicine: INITIAL_MEDICINES[0], // Amoxicillin
      quantity: 1,
      prescriptionRequired: true
    },
    {
      medicine: INITIAL_MEDICINES[3], // Paracetamol
      quantity: 2,
      prescriptionRequired: false
    }
  ]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [reminders, setReminders] = useState<MedicineReminder[]>(INITIAL_REMINDERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Modals & Drawers
  const [selectedMedicineModal, setSelectedMedicineModal] = useState<Medicine | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart operations
  const handleAddToCart = (medicine: Medicine, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          medicine,
          quantity,
          prescriptionRequired: medicine.requiresPrescription
        }
      ];
    });
    showToast(`Added ${quantity}x ${medicine.name} to Medicine Bag`);
  };

  const handleUpdateCartQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(medicineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  // Place Order
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock for ordered items
    setMedicines((prev) =>
      prev.map((med) => {
        const orderedItem = newOrder.items.find((item) => item.medicine.id === med.id);
        if (orderedItem) {
          return {
            ...med,
            stockQuantity: Math.max(0, med.stockQuantity - orderedItem.quantity)
          };
        }
        return med;
      })
    );
    setCart([]);
    showToast(`Order #${newOrder.orderNumber} placed! Courier assigned.`);
    setActiveView('tracking');
  };

  // Upload Prescription
  const handleUploadPrescription = (newRx: Prescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);
    showToast('Prescription uploaded! Sent to licensed pharmacist review queue.');
  };

  // Verify Prescription (Pharmacist Action)
  const handleVerifyPrescription = (
    prescriptionId: string,
    notes: string,
    pharmacistName: string,
    licenseNo: string
  ) => {
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === prescriptionId) {
          return {
            ...p,
            status: 'verified',
            pharmacistNotes: notes,
            verifiedByPharmacistName: pharmacistName,
            pharmacistLicenseNo: licenseNo,
            verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            digitalRxSignature: `DIGI-STAMP-${licenseNo.replace(/[^a-zA-Z0-9]/g, '')}-VERIFIED`,
            createdOrderEligible: true
          };
        }
        return p;
      })
    );
    showToast('Prescription verified and digitally stamped!');
  };

  // Reject Prescription (Pharmacist Action)
  const handleRejectPrescription = (prescriptionId: string, reason: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === prescriptionId) {
          return {
            ...p,
            status: 'rejected',
            pharmacistNotes: `Rejected: ${reason}`
          };
        }
        return p;
      })
    );
    showToast('Prescription returned with clarification notes.');
  };

  // Add verified Rx items into Cart
  const handleAddRxItemsToCart = (items: ExtractedRxItem[]) => {
    let addedCount = 0;
    items.forEach((item) => {
      const match = medicines.find((m) => m.id === item.matchedMedicineId) || medicines[0];
      if (match) {
        handleAddToCart(match, 1);
        addedCount++;
      }
    });
    setIsCartOpen(true);
    showToast(`Added ${addedCount} prescribed medications to your order bag.`);
  };

  // Reminders - Take Dose
  const handleTakeDose = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === reminderId) {
          const newPills = Math.max(0, r.pillsRemaining - 1);
          return {
            ...r,
            takenToday: true,
            pillsRemaining: newPills,
            daysLeft: Math.max(1, newPills),
            streakDays: r.streakDays + 1,
            lastTakenAt: 'Just now'
          };
        }
        return r;
      })
    );
    showToast('Dose recorded! Health streak updated 🔥');
  };

  // Reminders - Add new reminder
  const handleAddReminder = (newReminder: MedicineReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
    showToast(`Reminder saved for ${newReminder.medicineName}`);
  };

  // Reminders - 1-Click Quick Refill
  const handleQuickRefill = (reminder: MedicineReminder) => {
    const matched = medicines.find(
      (m) =>
        m.name.toLowerCase().includes(reminder.medicineName.toLowerCase()) ||
        reminder.medicineName.toLowerCase().includes(m.brandName.toLowerCase())
    ) || medicines[1]; // Metformin default

    handleAddToCart(matched, 1);
    setIsCartOpen(true);
    showToast(`Refill pack for ${matched.name} added to cart.`);
  };

  // Inventory - Restock
  const handleRestockMedicine = (medicineId: string, additionalQuantity: number) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, stockQuantity: m.stockQuantity + additionalQuantity } : m
      )
    );
    showToast(`Restocked +${additionalQuantity} units in dispensary.`);
  };

  // Order status update in Dispensary Pipeline
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedSteps = o.tracking.steps.map((st) => ({
            ...st,
            completed:
              st.status === nextStatus ||
              o.tracking.steps.findIndex((s) => s.status === st.status) <=
                o.tracking.steps.findIndex((s) => s.status === nextStatus)
          }));
          return {
            ...o,
            status: nextStatus,
            tracking: {
              ...o.tracking,
              steps: updatedSteps
            }
          };
        }
        return o;
      })
    );
    showToast(`Order status updated to: ${nextStatus.replace('_', ' ').toUpperCase()}`);
  };

  // Mark Delivery Handover Complete via OTP
  const handleCompleteDelivery = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'delivered');
  };

  const pendingPrescriptionsCount = prescriptions.filter((p) => p.status === 'under_review').length;
  const activeOrdersCount = orders.filter((o) => o.status === 'out_for_delivery').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar following contract */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        userRole={userRole}
        setUserRole={(role) => {
          setUserRole(role);
          if (role === 'pharmacist') setActiveView('prescription');
          if (role === 'rider') setActiveView('tracking');
          if (role === 'inventory_manager') setActiveView('inventory');
          if (role === 'patient') setActiveView('store');
        }}
        pendingPrescriptionsCount={pendingPrescriptionsCount}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'store' && (
          <MedicineStore
            medicines={medicines}
            onSelectMedicine={(med) => setSelectedMedicineModal(med)}
            onAddToCart={handleAddToCart}
            onNavigateToUpload={() => setActiveView('prescription')}
          />
        )}

        {activeView === 'prescription' && (
          <PrescriptionPortal
            prescriptions={prescriptions}
            onUploadPrescription={handleUploadPrescription}
            onVerifyPrescription={handleVerifyPrescription}
            onRejectPrescription={handleRejectPrescription}
            onAddRxItemsToCart={handleAddRxItemsToCart}
            userRole={userRole}
            medicines={medicines}
          />
        )}

        {activeView === 'reminders' && (
          <MedicineReminders
            reminders={reminders}
            onTakeDose={handleTakeDose}
            onAddReminder={handleAddReminder}
            onQuickRefill={handleQuickRefill}
          />
        )}

        {activeView === 'tracking' && (
          <LiveDeliveryTracking
            orders={orders}
            onCompleteDelivery={handleCompleteDelivery}
          />
        )}

        {activeView === 'inventory' && (
          <InventoryManager
            medicines={medicines}
            orders={orders}
            onRestockMedicine={handleRestockMedicine}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Medicine Clinical Details Modal */}
      <MedicineDetailModal
        medicine={selectedMedicineModal}
        onClose={() => setSelectedMedicineModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Medicine Bag / Express Checkout Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        prescriptions={prescriptions}
        onPlaceOrder={handlePlaceOrder}
        onNavigateToUpload={() => setActiveView('prescription')}
      />

      {/* Footer following Anti-Slop Guidelines */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">MediMart</span>
            <span aria-hidden="true">·</span>
            <span>Registered Online Dispensary License #FDA-2026-CA-991</span>
          </div>

          <div className="flex items-center gap-6">
            <span>24/7 Pharmacist Helpline: +1 (800) 555-MEDS</span>
            <span aria-hidden="true">·</span>
            <span>Cold-Chain GxP Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
