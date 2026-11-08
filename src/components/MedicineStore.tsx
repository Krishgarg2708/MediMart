import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  FileText, 
  Plus, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Medicine, MedicineCategory } from '../types/pharmacy';
import { HERO_IMAGE } from '../data/mockData';

interface MedicineStoreProps {
  medicines: Medicine[];
  onSelectMedicine: (medicine: Medicine) => void;
  onAddToCart: (medicine: Medicine, quantity: number) => void;
  onNavigateToUpload: () => void;
}

const CATEGORIES: ('All' | MedicineCategory)[] = [
  'All',
  'Chronic Care',
  'Antibiotics & Infection',
  'Pain & Fever Relief',
  'Respiratory & Allergy',
  'Digestive Health',
  'Vitamins & Nutrition',
  'First Aid & Surgical',
];

export const MedicineStore: React.FC<MedicineStoreProps> = ({
  medicines,
  onSelectMedicine,
  onAddToCart,
  onNavigateToUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | MedicineCategory>('All');
  const [rxFilter, setRxFilter] = useState<'all' | 'rx_only' | 'otc_only'>('all');
  const [coldChainOnly, setColdChainOnly] = useState(false);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      // Category filter
      if (selectedCategory !== 'All' && med.category !== selectedCategory) {
        return false;
      }
      // Rx filter
      if (rxFilter === 'rx_only' && !med.requiresPrescription) return false;
      if (rxFilter === 'otc_only' && med.requiresPrescription) return false;
      // Cold chain filter
      if (coldChainOnly && !med.storageTemp.includes('Cold Chain')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = med.name.toLowerCase().includes(q);
        const matchesGeneric = med.genericName.toLowerCase().includes(q);
        const matchesBrand = med.brandName.toLowerCase().includes(q);
        const matchesUses = med.uses.some((u) => u.toLowerCase().includes(q));
        if (!matchesName && !matchesGeneric && !matchesBrand && !matchesUses) {
          return false;
        }
      }
      return true;
    });
  }, [medicines, selectedCategory, rxFilter, coldChainOnly, searchQuery]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Licensed pharmacy dispensary"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-14 lg:py-18">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-teal-400">
              <span>Licensed Central Dispensary</span>
              <span aria-hidden="true">·</span>
              <span>Express 30-Min Home Delivery</span>
              <span aria-hidden="true">·</span>
              <span>100% Genuine Certified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Genuine Medicines, Delivered Safely in Minutes.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Order prescription drugs with licensed pharmacist verification, OTC healthcare essentials, and cold-chain temperature monitored medications.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToUpload}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>Upload Doctor&apos;s Prescription</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Browse All Medicines</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">30-Min Express Dispatch</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Automated dispensary routing to nearest local hub</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Licensed Pharmacists</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Dual-check verification on every Rx upload</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Cold Chain 2-8°C Sensor</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Insulin & biologics live temp tracking</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Secure OTP Handover</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Tamper-evident sealed barcode bags</p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section id="catalog" className="space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, salt generic (e.g. Metformin, Amoxicillin), or symptom..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Rx / OTC & Cold-Chain Segmented Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs">
              <button
                onClick={() => setRxFilter('all')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  rxFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Medicines
              </button>
              <button
                onClick={() => setRxFilter('otc_only')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  rxFilter === 'otc_only' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OTC (No Rx)
              </button>
              <button
                onClick={() => setRxFilter('rx_only')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  rxFilter === 'rx_only' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prescription (Rx)
              </button>
            </div>

            <button
              onClick={() => setColdChainOnly(!coldChainOnly)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                coldChainOnly
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-cyan-600" />
              <span>Cold Chain</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Pills/Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results Count & Notice */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200/60 pb-3">
        <span>
          Showing <span className="font-semibold text-slate-900">{filteredMedicines.length}</span> authentic medicines
        </span>
        <span className="text-slate-400 hidden sm:inline">
          All orders dispensed from GxP Certified Dispensary #41
        </span>
      </div>

      {/* Product Grid */}
      {filteredMedicines.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-sm font-semibold text-slate-800">No medicines match your filter criteria.</p>
          <p className="text-xs text-slate-500">Try adjusting your search terms or clearing category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setRxFilter('all');
              setColdChainOnly(false);
            }}
            className="px-4 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Product Image Area */}
              <div 
                onClick={() => onSelectMedicine(med)}
                className="relative aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer"
              >
                <img
                  src={med.image}
                  alt={med.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Quiet Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  {med.requiresPrescription ? (
                    <span className="bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs tracking-wider">
                      Rx REQUIRED
                    </span>
                  ) : (
                    <span className="bg-teal-700 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs tracking-wider">
                      OTC
                    </span>
                  )}
                  {med.storageTemp.includes('Cold Chain') && (
                    <span className="bg-cyan-700 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-xs tracking-wider flex items-center gap-1">
                      <Thermometer className="w-2.5 h-2.5" /> 2-8°C
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[11px] font-medium text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs">
                    {med.packageSize}
                  </span>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="text-teal-700 font-semibold">{med.brandName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{med.category}</span>
                  </div>

                  {/* Medicine Name */}
                  <h3
                    onClick={() => onSelectMedicine(med)}
                    className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 cursor-pointer"
                    title={med.name}
                  >
                    {med.name}
                  </h3>

                  {/* Salt composition */}
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Composition: {med.genericName}
                  </p>
                </div>

                {/* Bottom Price & Add CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                        ${med.price.toFixed(2)}
                      </span>
                      {med.originalPrice > med.price && (
                        <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                          ${med.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      In Stock ({med.stockQuantity})
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(med, 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Add to medicine bag"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
