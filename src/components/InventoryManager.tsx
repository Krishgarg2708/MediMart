import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Thermometer, 
  RefreshCw, 
  Search, 
  Plus, 
  CheckCircle2, 
  Truck, 
  FileCheck, 
  Filter, 
  Clock, 
  Boxes,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Medicine, Order, OrderStatus } from '../types/pharmacy';

interface InventoryManagerProps {
  medicines: Medicine[];
  orders: Order[];
  onRestockMedicine: (medicineId: string, additionalQuantity: number) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  medicines,
  orders,
  onRestockMedicine,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low_stock' | 'cold_chain'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [restockModalMed, setRestockModalMed] = useState<Medicine | null>(null);
  const [restockAmount, setRestockAmount] = useState(50);

  // Compute metrics
  const totalStockUnits = medicines.reduce((sum, m) => sum + m.stockQuantity, 0);
  const lowStockCount = medicines.filter((m) => m.stockQuantity < 50).length;
  const coldChainCount = medicines.filter((m) => m.storageTemp.includes('Cold Chain')).length;

  // Filter medicines
  const filteredMedicines = medicines.filter((med) => {
    if (filterStockStatus === 'low_stock' && med.stockQuantity >= 50) return false;
    if (filterStockStatus === 'cold_chain' && !med.storageTemp.includes('Cold Chain')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        med.name.toLowerCase().includes(q) ||
        med.brandName.toLowerCase().includes(q) ||
        med.batchNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
    return true;
  });

  const handleConfirmRestock = () => {
    if (restockModalMed) {
      onRestockMedicine(restockModalMed.id, restockAmount);
      setRestockModalMed(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner and Navigation */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>Apex MediCare Dispensary Hub #41</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Pharmacy Inventory & Order Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage pharmaceutical stock levels, batch expiries, cold-chain temperature sensors, and the prescription fulfillment pipeline.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Dispensary Stock ({medicines.length} SKUs)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <span>Fulfillment Pipeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
              {orders.length} Active
            </span>
          </button>
        </div>
      </div>

      {/* High-level KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Units In Stock</span>
            <Package className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalStockUnits.toLocaleString()}
            </span>
            <span className="text-xs text-teal-700 font-medium">Healthy</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Low Stock Warnings (&lt;50)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
              {lowStockCount} SKUs
            </span>
            <span className="text-xs text-amber-700 font-medium">Reorder</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Cold-Chain Biologics (2-8°C)</span>
            <Thermometer className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {coldChainCount} Lines
            </span>
            <span className="text-xs text-cyan-700 font-medium">Sensor OK (4.2°C)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Orders to Dispatch</span>
            <Truck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {orders.filter((o) => o.status !== 'delivered').length} Orders
            </span>
            <span className="text-xs text-teal-700 font-medium">On Schedule</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Pharmacy Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock by drug, brand, or batch number..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterStockStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterStockStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                All SKUs
              </button>
              <button
                onClick={() => setFilterStockStatus('low_stock')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterStockStatus === 'low_stock' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Low Stock Only ({lowStockCount})
              </button>
              <button
                onClick={() => setFilterStockStatus('cold_chain')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterStockStatus === 'cold_chain' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Cold Chain (2-8°C)
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Medicine & Generic Formulation</th>
                    <th className="py-3 px-3">Batch & Expiry</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Storage Temp</th>
                    <th className="py-3 px-3 text-right">Unit Price</th>
                    <th className="py-3 px-3 text-right">In Stock</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMedicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img
                              src={med.image}
                              alt={med.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{med.name}</span>
                              {med.requiresPrescription && (
                                <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 rounded">
                                  Rx
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {med.genericName} · {med.packageSize}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-mono text-slate-800 font-medium block">
                          {med.batchNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Exp: {med.expiryDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-600">{med.category}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        {med.storageTemp.includes('Cold Chain') ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                            <Thermometer className="w-3 h-3 text-cyan-600" />
                            2-8°C Monitored
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">15-25°C Room</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        ${med.price.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-block font-mono font-bold tabular-nums px-2 py-0.5 rounded text-xs ${
                            med.stockQuantity < 30
                              ? 'bg-rose-100 text-rose-800'
                              : med.stockQuantity < 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {med.stockQuantity} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setRestockModalMed(med);
                            setRestockAmount(50);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Order Fulfillment Pipeline */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Dispensary Order Fulfillment Queue
            </h3>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              {['all', 'placed', 'rx_verified', 'dispensed', 'out_for_delivery', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500">Placed: {order.placedAt}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {order.deliveryType === 'express_30min' ? '⚡ 30-Min Express' : 'Standard Scheduled'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded capitalize ${
                        order.status === 'delivered'
                          ? 'bg-teal-100 text-teal-800'
                          : order.status === 'out_for_delivery'
                          ? 'bg-cyan-100 text-cyan-800'
                          : order.status === 'dispensed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items & Delivery Address */}
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                      Prescribed Items ({order.items.length})
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-800">
                          <span>
                            {it.quantity}x {it.medicine.name}
                            {it.medicine.requiresPrescription && (
                              <span className="ml-1 text-[10px] text-rose-600 font-bold">(Rx)</span>
                            )}
                          </span>
                          <span className="font-mono tabular-nums font-semibold">
                            ${(it.medicine.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                      <span>Total Amount:</span>
                      <span className="font-mono tabular-nums">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                      Patient & Delivery Destination
                    </span>
                    <p className="font-semibold text-slate-900">{order.address.fullName}</p>
                    <p className="text-slate-500">Phone: {order.address.phone}</p>
                    <p className="text-slate-500">
                      {order.address.street}, {order.address.city} - {order.address.zipCode}
                    </p>
                    <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                      <span>Delivery OTP: </span>
                      <strong className="font-mono text-slate-900">{order.deliveryOtp}</strong>
                      <span className="ml-2 text-slate-400">(Required at handover)</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons for next stage */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Payment Method: <span className="font-medium text-slate-800">{order.paymentMethod}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'placed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'rx_verified')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Approve Rx & Send to Dispensary
                      </button>
                    )}
                    {order.status === 'rx_verified' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'dispensed')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Pack & Seal in Cold-Chain Container
                      </button>
                    )}
                    {order.status === 'dispensed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'out_for_delivery')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg transition-colors cursor-pointer"
                      >
                        Handover to Rider Rahul (Out for Delivery)
                      </button>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Simulate Delivery Complete
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Delivered & Signed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockModalMed && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Restock SKU: {restockModalMed.name}
            </h3>
            <p className="text-xs text-slate-500">
              Current stock: {restockModalMed.stockQuantity} units · Batch: {restockModalMed.batchNumber}
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700">Units to Add to Dispensary</label>
              <input
                type="number"
                min="10"
                step="10"
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setRestockModalMed(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestock}
                className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer shadow-xs"
              >
                Confirm Restock (+{restockAmount} units)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
