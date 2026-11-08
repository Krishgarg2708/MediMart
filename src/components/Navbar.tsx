import React from 'react';
import { ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { AppView, UserRole } from '../types/pharmacy';

interface NavbarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  cartCount: number;
  openCart: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  pendingPrescriptionsCount: number;
  activeOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartCount,
  openCart,
  userRole,
  setUserRole,
  pendingPrescriptionsCount,
  activeOrdersCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              +
            </span>
            <span>MediMart</span>
          </button>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('store')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeView === 'store' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
              }`}
            >
              Order Medicines
            </button>
            <button
              onClick={() => setActiveView('prescription')}
              className={`relative hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeView === 'prescription' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
              }`}
            >
              Prescription & Pharmacist
              {pendingPrescriptionsCount > 0 && (
                <span className="ml-1.5 text-xs text-amber-700 font-bold">
                  ({pendingPrescriptionsCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('reminders')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeView === 'reminders' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
              }`}
            >
              Reminders & Refills
            </button>
            <button
              onClick={() => setActiveView('tracking')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeView === 'tracking' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
              }`}
            >
              Live Tracking
              {activeOrdersCount > 0 && (
                <span className="ml-1.5 text-xs text-teal-700 font-bold">
                  ({activeOrdersCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('inventory')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activeView === 'inventory' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
              }`}
            >
              Dispensary & Inventory
            </button>
          </nav>

          {/* Zone 3: 1 primary action group */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick role toggle */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <span className="px-1.5 text-slate-400">View as:</span>
              <button
                onClick={() => setUserRole('patient')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  userRole === 'patient' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setUserRole('pharmacist')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  userRole === 'pharmacist' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Pharmacist
              </button>
              <button
                onClick={() => setUserRole('rider')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  userRole === 'rider' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Rider
              </button>
              <button
                onClick={() => setUserRole('inventory_manager')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  userRole === 'inventory_manager' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Manager
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="Open medicine cart"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Medicine Bag</span>
              <span className="w-5 h-5 rounded-full bg-white text-teal-800 text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 text-xs no-scrollbar">
          <button
            onClick={() => setActiveView('store')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
              activeView === 'store' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Medicines
          </button>
          <button
            onClick={() => setActiveView('prescription')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
              activeView === 'prescription' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Prescription ({pendingPrescriptionsCount})
          </button>
          <button
            onClick={() => setActiveView('reminders')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
              activeView === 'reminders' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Reminders
          </button>
          <button
            onClick={() => setActiveView('tracking')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
              activeView === 'tracking' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Live Tracking
          </button>
          <button
            onClick={() => setActiveView('inventory')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
              activeView === 'inventory' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Inventory
          </button>
        </div>
      </div>
    </header>
  );
};
