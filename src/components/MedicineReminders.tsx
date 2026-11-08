import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Clock, 
  Pill, 
  Flame, 
  RotateCcw, 
  Calendar, 
  Check, 
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react';
import { MedicineReminder } from '../types/pharmacy';

interface MedicineRemindersProps {
  reminders: MedicineReminder[];
  onTakeDose: (reminderId: string) => void;
  onAddReminder: (newReminder: MedicineReminder) => void;
  onQuickRefill: (reminder: MedicineReminder) => void;
}

export const MedicineReminders: React.FC<MedicineRemindersProps> = ({
  reminders,
  onTakeDose,
  onAddReminder,
  onQuickRefill,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterTiming, setFilterTiming] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'bedtime'>('all');

  // New Reminder form state
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [form, setForm] = useState<'Tablet' | 'Capsule' | 'Syrup' | 'Inhaler'>('Tablet');
  const [scheduleTime, setScheduleTime] = useState('08:00 AM');
  const [timingCategory, setTimingCategory] = useState<'morning' | 'afternoon' | 'evening' | 'bedtime'>('morning');
  const [instructions, setInstructions] = useState<'Before food' | 'After food' | 'With water' | 'At bedtime'>('After food');
  const [pillsRemaining, setPillsRemaining] = useState(30);
  const [totalPackSize, setTotalPackSize] = useState(30);
  const [refillThresholdDays, setRefillThresholdDays] = useState(5);
  const [autoRefillEnabled, setAutoRefillEnabled] = useState(true);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    const newReminder: MedicineReminder = {
      id: `rem-${Date.now()}`,
      medicineName,
      dosage,
      form,
      scheduleTime,
      timingCategory,
      instructions,
      pillsRemaining,
      totalPackSize,
      refillThresholdDays,
      daysLeft: Math.max(1, Math.floor(pillsRemaining)),
      autoRefillEnabled,
      takenToday: false,
      streakDays: 0,
    };

    onAddReminder(newReminder);
    setIsAddModalOpen(false);
    // Reset form
    setMedicineName('');
    setDosage('1 Tablet');
  };

  const filteredReminders = reminders.filter((r) => {
    if (filterTiming === 'all') return true;
    return r.timingCategory === filterTiming;
  });

  const lowPillReminders = reminders.filter((r) => r.pillsRemaining <= r.refillThresholdDays);
  const takenCount = reminders.filter((r) => r.takenToday).length;
  const adherencePercent = Math.round((takenCount / reminders.length) * 100) || 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Adherence Stats Summary */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Smart Adherence & Refill Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Medicine Reminders & Refill Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Never miss a dose. Track real-time pill counts with automatic proactive refill ordering before you run out.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine Reminder</span>
        </button>
      </div>

      {/* Adherence Health Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Today&apos;s Doses Taken</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {takenCount} / {reminders.length}
            </span>
            <span className="text-xs font-medium text-teal-700 font-mono">
              ({adherencePercent}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Current Adherence Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              14 Days
            </span>
            <span className="text-xs text-amber-700 font-medium">On Track 🔥</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Low Pill Refill Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
              {lowPillReminders.length} Meds
            </span>
            <span className="text-xs text-slate-400">Action needed</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Smart Auto-Refill Guard</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">Active</span>
            <span className="text-xs text-teal-700 font-medium">Synced with Hub</span>
          </div>
        </div>
      </div>

      {/* Critical Refill Alert Banners */}
      {lowPillReminders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Refill Alerts: Low Stock Detected in Your Medicine Cabinet</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {lowPillReminders.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-900">{r.medicineName}</span>
                    <span className="text-rose-700 font-mono font-semibold">
                      Only {r.pillsRemaining} pills left ({r.daysLeft} days)
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 mt-1">
                    Your current supply will expire in approximately {r.daysLeft} days. Order now to ensure continuous therapy without interruption.
                  </p>

                  {/* Visual remaining meter */}
                  <div className="w-full bg-rose-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-rose-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.max(10, (r.pillsRemaining / r.totalPackSize) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Standard Pack: {r.totalPackSize} doses
                  </span>
                  <button
                    onClick={() => onQuickRefill(r)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>1-Click Refill Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routine Timeline Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-900">
          Today&apos;s Dosage Routine
        </h3>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
          {(['all', 'morning', 'afternoon', 'evening', 'bedtime'] as const).map((timing) => (
            <button
              key={timing}
              onClick={() => setFilterTiming(timing)}
              className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer whitespace-nowrap ${
                filterTiming === timing
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              {timing}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              reminder.takenToday
                ? 'bg-slate-50/70 border-slate-200 opacity-90'
                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  reminder.takenToday
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Pill className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide">
                    {reminder.scheduleTime} ({reminder.timingCategory})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">{reminder.instructions}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {reminder.medicineName}
                </h4>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>Dose: <strong>{reminder.dosage}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className={reminder.pillsRemaining <= 5 ? 'text-rose-600 font-bold' : ''}>
                    {reminder.pillsRemaining} of {reminder.totalPackSize} remaining
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{reminder.streakDays} day streak</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              {reminder.takenToday ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dose Taken ({reminder.lastTakenAt || 'Today'})</span>
                </div>
              ) : (
                <button
                  onClick={() => onTakeDose(reminder.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark as Taken</span>
                </button>
              )}

              {reminder.pillsRemaining <= reminder.refillThresholdDays && (
                <button
                  onClick={() => onQuickRefill(reminder)}
                  className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  title="Refill stock"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refill</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                Add Medicine Reminder & Routine
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Atorvastatin 20mg or Metformin"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Dosage Strength</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet (500mg)"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Form</label>
                  <select
                    value={form}
                    onChange={(e) => setForm(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Routine Slot</label>
                  <select
                    value={timingCategory}
                    onChange={(e) => setTimingCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none capitalize"
                  >
                    <option value="morning">Morning (08:00 AM)</option>
                    <option value="afternoon">Afternoon (02:00 PM)</option>
                    <option value="evening">Evening (08:00 PM)</option>
                    <option value="bedtime">Bedtime (10:00 PM)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Instructions</label>
                  <select
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="After food">After food</option>
                    <option value="Before food">Before food</option>
                    <option value="With water">With water</option>
                    <option value="At bedtime">At bedtime</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Current Pills in Hand</label>
                  <input
                    type="number"
                    min="1"
                    value={pillsRemaining}
                    onChange={(e) => setPillsRemaining(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Refill Alert Threshold (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={refillThresholdDays}
                    onChange={(e) => setRefillThresholdDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
