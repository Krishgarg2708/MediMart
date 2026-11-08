import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Thermometer, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Bike, 
  AlertCircle,
  Copy,
  Check,
  Send,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus } from '../types/pharmacy';
import { COURIER_IMAGE } from '../data/mockData';

interface LiveDeliveryTrackingProps {
  orders: Order[];
  onCompleteDelivery: (orderId: string) => void;
}

export const LiveDeliveryTracking: React.FC<LiveDeliveryTrackingProps> = ({
  orders,
  onCompleteDelivery,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find((o) => o.status === 'out_for_delivery')?.id || orders[0]?.id || ''
  );

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Map simulated rider movement
  const [riderProgress, setRiderProgress] = useState(65); // 0 to 100%
  const [tempCelsius, setTempCelsius] = useState(4.2);
  const [etaMins, setEtaMins] = useState(12);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [isCallingRider, setIsCallingRider] = useState(false);

  // Subtle simulated animation for live rider telemetry
  useEffect(() => {
    if (!selectedOrder || selectedOrder.status !== 'out_for_delivery') return;

    const interval = setInterval(() => {
      setRiderProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 1;
      });
      setEtaMins((prev) => Math.max(3, prev > 5 ? prev - 1 : prev));
      // Subtle temp variation between 3.9 and 4.4°C
      setTempCelsius((prev) => Number((4.1 + Math.sin(Date.now() / 5000) * 0.2).toFixed(1)));
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedOrder]);

  if (!selectedOrder) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
        <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-800">No active deliveries to track</h3>
        <p className="text-xs text-slate-500">Place a medicine order to monitor live courier dispatch and telemetry.</p>
      </div>
    );
  }

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(selectedOrder.deliveryOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleVerifyOtpHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() === selectedOrder.deliveryOtp) {
      setOtpSuccess(true);
      setOtpError(null);
      setTimeout(() => {
        onCompleteDelivery(selectedOrder.id);
        setOtpSuccess(false);
        setInputOtp('');
      }, 1000);
    } else {
      setOtpError('Incorrect OTP PIN. Please check the customer verification code.');
    }
  };

  // Interpolate simulated coordinates between dispensary and customer address
  const startX = 18;
  const startY = 75;
  const endX = 82;
  const endY = 25;
  const currentX = startX + ((endX - startX) * riderProgress) / 100;
  const currentY = startY + ((endY - startY) * riderProgress) / 100;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Navigation className="w-4 h-4" />
            <span>GPS & Cold-Chain Telemetry Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Live Delivery Partner Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time GPS positioning, insulated box temperature monitoring, and OTP-verified contactless handover.
          </p>
        </div>

        {/* Order Selector if multiple exist */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Tracking:</span>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-teal-500 focus:outline-none"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} ({o.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Simulated Map & Telemetry Dashboard */}
        <div className="lg:col-span-8 space-y-5">
          {/* Map Canvas Card */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl text-white relative">
            {/* Top Telemetry Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="font-semibold text-white">Live Telemetry: Active</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-teal-300 font-semibold">{etaMins} mins ETA</span>
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-800/80 text-xs shadow-md flex items-center gap-2 text-cyan-300">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cold Box:</span>
                <span className="font-mono font-bold text-white">{tempCelsius}°C</span>
                <span className="text-[10px] text-cyan-400 font-medium">(Safe 2-8°C)</span>
              </div>
            </div>

            {/* Simulated Vector Map Area */}
            <div className="relative w-full h-80 sm:h-96 bg-[#0f172a] overflow-hidden select-none">
              {/* Stylized Map Roads and Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                {/* Road networks */}
                <path d="M 0,180 Q 200,120 400,210 T 800,160" fill="none" stroke="#334155" strokeWidth="18" />
                <path d="M 120,0 Q 220,200 180,400" fill="none" stroke="#334155" strokeWidth="14" />
                <path d="M 500,0 Q 420,180 620,400" fill="none" stroke="#334155" strokeWidth="14" />
                <path d="M 0,320 L 800,280" fill="none" stroke="#1e293b" strokeWidth="10" />
                {/* City Blocks / Buildings */}
                <rect x="50" y="50" width="80" height="90" rx="6" fill="#1e293b" opacity="0.6" />
                <rect x="250" y="40" width="120" height="70" rx="6" fill="#1e293b" opacity="0.6" />
                <rect x="420" y="80" width="100" height="110" rx="6" fill="#1e293b" opacity="0.6" />
                <rect x="650" y="60" width="110" height="80" rx="6" fill="#1e293b" opacity="0.6" />
                <rect x="80" y="240" width="140" height="90" rx="6" fill="#1e293b" opacity="0.6" />
                <rect x="320" y="260" width="130" height="80" rx="6" fill="#1e293b" opacity="0.6" />
                <rect x="580" y="230" width="150" height="100" rx="6" fill="#1e293b" opacity="0.6" />
              </svg>

              {/* Delivery Route Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line
                  x1={`${startX}%`}
                  y1={`${startY}%`}
                  x2={`${endX}%`}
                  y2={`${endY}%`}
                  stroke="#14b8a6"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  opacity="0.8"
                />
              </svg>

              {/* Dispensary Origin Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${startX}%`, top: `${startY}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-teal-500 shadow-lg flex items-center justify-center text-teal-400 font-bold mx-auto text-xs">
                  +
                </div>
                <div className="mt-1 bg-slate-900/90 text-[10px] font-bold px-2 py-0.5 rounded text-white whitespace-nowrap shadow-md">
                  Apex Dispensary Hub
                </div>
              </div>

              {/* Patient Residence Destination Pin */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${endX}%`, top: `${endY}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-rose-500 shadow-lg flex items-center justify-center text-rose-400 mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="mt-1 bg-slate-900/90 text-[10px] font-bold px-2 py-0.5 rounded text-white whitespace-nowrap shadow-md">
                  Patient Residence
                </div>
              </div>

              {/* Moving Courier Scooter Icon */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear pointer-events-none"
                style={{ left: `${currentX}%`, top: `${currentY}%` }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-teal-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
                    <Bike className="w-6 h-6 animate-pulse" />
                  </div>
                  {/* Courier pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-teal-400 opacity-40 animate-ping -z-10" />
                </div>
              </div>
            </div>

            {/* Bottom Map Status Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold">
                  EV
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {selectedOrder.tracking.riderName} · {selectedOrder.tracking.vehicleType}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Reg #{selectedOrder.tracking.vehicleNumber} · Temp probe calibrated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCallingRider(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Courier</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Dispensary & Delivery Chain of Custody
            </h3>

            <div className="space-y-4">
              {selectedOrder.tracking.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 relative">
                  {idx < selectedOrder.tracking.steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                        step.completed ? 'bg-teal-500' : 'bg-slate-200'
                      }`}
                    />
                  )}

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.completed
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold font-mono">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="flex items-baseline justify-between text-xs">
                      <h4 className="font-bold text-slate-900">{step.title}</h4>
                      <span className="font-mono text-slate-400 text-[11px]">{step.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Security, OTP Handover & Rider Portal Simulator */}
        <div className="lg:col-span-4 space-y-5">
          {/* Customer OTP Card */}
          <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Contactless Handover Code</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To verify tamper-free physical handover of prescription medicine, provide this 4-digit PIN to rider <strong>{selectedOrder.tracking.riderName}</strong> upon arrival.
            </p>

            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200/80 text-center space-y-1">
              <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wide">
                Delivery Verification PIN
              </span>
              <div className="text-3xl font-extrabold text-teal-950 font-mono tracking-widest py-1">
                {selectedOrder.deliveryOtp}
              </div>
              <button
                onClick={handleCopyOtp}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 cursor-pointer"
              >
                {copiedOtp ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>PIN Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PIN</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delivery Partner Handover Simulator (Allows full demo of courier marking delivery complete) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Bike className="w-4 h-4" />
                <span>Rider Handover Console</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Simulator Mode
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Simulate Rider Rahul verifying patient identity and confirming delivery with the 4-digit PIN.
            </p>

            {selectedOrder.status === 'delivered' ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Order successfully delivered and confirmed with OTP!</span>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtpHandover} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Enter Patient Handover OTP PIN:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      placeholder={selectedOrder.deliveryOtp}
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center tracking-widest text-lg focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {otpError && (
                  <p className="text-[11px] text-rose-400">{otpError}</p>
                )}

                {otpSuccess && (
                  <p className="text-[11px] text-emerald-400">PIN verified! Marking order as delivered...</p>
                )}

                <p className="text-[10px] text-slate-500">
                  Tip: Auto-filled placeholder with correct OTP ({selectedOrder.deliveryOtp}) for quick testing.
                </p>
              </form>
            )}
          </div>

          {/* Delivery Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              Order #{selectedOrder.orderNumber} Manifest
            </h4>
            <div className="space-y-1.5 divide-y divide-slate-100">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0 flex justify-between items-center text-slate-700">
                  <span>{item.quantity}x {item.medicine.name}</span>
                  <span className="font-mono tabular-nums font-semibold">${(item.medicine.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Total Paid:</span>
              <span className="font-mono tabular-nums">${selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rider Call Simulation Modal */}
      {isCallingRider && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto text-2xl animate-bounce">
              📞
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Calling Rider Rahul Kumar</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedOrder.tracking.riderPhone}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
              &ldquo;Hello! I am just 1.5 km away near Grand Ave. Medicines are in the temperature-safe box. Arriving in 10 minutes.&rdquo;
            </div>
            <button
              onClick={() => setIsCallingRider(false)}
              className="w-full py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
