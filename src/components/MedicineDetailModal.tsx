import React, { useState } from 'react';
import { X, ShieldAlert, Thermometer, CheckCircle2, AlertTriangle, Building2, Package, Sparkles, Plus, Minus } from 'lucide-react';
import { Medicine } from '../types/pharmacy';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onAddToCart: (medicine: Medicine, quantity: number) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!medicine) return null;

  const handleAdd = () => {
    onAddToCart(medicine, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{medicine.category}</span>
            <span aria-hidden="true">·</span>
            <span>Batch {medicine.batchNumber}</span>
            <span aria-hidden="true">·</span>
            <span>Exp: {medicine.expiryDate}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-1/3 shrink-0">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {medicine.requiresPrescription && (
                  <div className="absolute top-2 left-2 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide shadow-xs">
                    Rx Required
                  </div>
                )}
              </div>

              {medicine.storageTemp.includes('Cold Chain') && (
                <div className="mt-3 p-2.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs flex items-start gap-2">
                  <Thermometer className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Cold Chain (2-8°C)</p>
                    <p className="text-[11px] text-cyan-700">Delivered in temperature-monitored refrigerated courier bag.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:w-2/3 space-y-3">
              <div>
                <span className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
                  {medicine.brandName}
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                  {medicine.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Active Composition: <span className="text-slate-700 font-medium">{medicine.genericName}</span>
                </p>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  ${medicine.price.toFixed(2)}
                </span>
                {medicine.originalPrice > medicine.price && (
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    ${medicine.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  per {medicine.packageSize}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 block">Form & Strength:</span>
                  <span className="font-medium text-slate-800">{medicine.dosageForm} · {medicine.strength}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Manufacturer:</span>
                  <span className="font-medium text-slate-800">{medicine.manufacturer}</span>
                </div>
              </div>

              {/* Therapeutic uses */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Primary Clinical Uses
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc marker:text-teal-500">
                  {medicine.uses.map((use, i) => (
                    <li key={i}>{use}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Safety & Precautions */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Reported Side Effects
              </h5>
              <ul className="text-xs text-amber-800 space-y-0.5 pl-4 list-disc marker:text-amber-500">
                {medicine.sideEffects.map((effect, i) => (
                  <li key={i}>{effect}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                Precautions & Contraindications
              </h5>
              <ul className="text-xs text-slate-700 space-y-0.5 pl-4 list-disc marker:text-slate-400">
                {medicine.contraindications.map((contra, i) => (
                  <li key={i}>{contra}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer action bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Quantity:</span>
            <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-semibold text-slate-900 font-mono tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-slate-400">
              Total: ${(medicine.price * quantity).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Add to Medicine Bag</span>
              {medicine.requiresPrescription && <span className="opacity-80 text-[10px]">(Rx)</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
