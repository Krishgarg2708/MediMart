import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  FileText, 
  Plus, 
  Stamp, 
  Sparkles, 
  UserCheck, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Prescription, Medicine, ExtractedRxItem, UserRole } from '../types/pharmacy';
import { SAMPLE_PRESCRIPTION_IMAGE } from '../data/mockData';

interface PrescriptionPortalProps {
  prescriptions: Prescription[];
  onUploadPrescription: (newRx: Prescription) => void;
  onVerifyPrescription: (prescriptionId: string, notes: string, pharmacistName: string, licenseNo: string) => void;
  onRejectPrescription: (prescriptionId: string, reason: string) => void;
  onAddRxItemsToCart: (items: ExtractedRxItem[]) => void;
  userRole: UserRole;
  medicines: Medicine[];
}

export const PrescriptionPortal: React.FC<PrescriptionPortalProps> = ({
  prescriptions,
  onUploadPrescription,
  onVerifyPrescription,
  onRejectPrescription,
  onAddRxItemsToCart,
  userRole,
  medicines,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'pharmacist_queue' | 'my_prescriptions'>(
    userRole === 'pharmacist' ? 'pharmacist_queue' : 'upload'
  );

  // Upload Form State
  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [patientAge, setPatientAge] = useState(38);
  const [patientPhone, setPatientPhone] = useState('+1 (555) 234-8910');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Patel, MD');
  const [clinicName, setClinicName] = useState('St. Michael\'s Healthcare Clinic');
  const [doctorRegNo, setDoctorRegNo] = useState('LIC-MD-987654');
  const [rxImagePreview, setRxImagePreview] = useState<string>(SAMPLE_PRESCRIPTION_IMAGE);
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Pharmacist review modal / selected Rx
  const [selectedRxForReview, setSelectedRxForReview] = useState<Prescription | null>(
    prescriptions.find((p) => p.status === 'under_review') || prescriptions[0] || null
  );
  const [pharmacistName, setPharmacistName] = useState('Dr. Elena Rostova, RPh');
  const [pharmacistLicenseNo, setPharmacistLicenseNo] = useState('RPH-CA-883921');
  const [clinicalNotes, setClinicalNotes] = useState('Patient clinical history verified. Dosages safe and within normal therapeutic limits.');
  const [rejectReason, setRejectReason] = useState('');

  // Handle Prescription Upload
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanningOcr(true);

    setTimeout(() => {
      setIsScanningOcr(false);
      const newRx: Prescription = {
        id: `rx-${Date.now()}`,
        patientName,
        patientAge,
        patientPhone,
        doctorName,
        doctorRegistrationNumber: doctorRegNo,
        clinicName,
        issuedDate: new Date().toISOString().split('T')[0],
        imageUrl: rxImagePreview,
        status: 'under_review',
        pharmacistNotes: 'Awaiting clinical review from dispensary staff.',
        extractedMedicines: [
          {
            id: `ext-${Date.now()}-1`,
            name: 'Amoxicillin & Potassium Clavulanate 625mg',
            dosage: '625mg',
            frequency: '1 capsule three times daily (TDS)',
            duration: '7 Days',
            matchedMedicineId: 'med-01',
            inStock: true,
            approved: true
          },
          {
            id: `ext-${Date.now()}-2`,
            name: 'Omeprazole Gastro-Resistant Capsules 20mg',
            dosage: '20mg',
            frequency: '1 capsule in morning before breakfast (OD)',
            duration: '7 Days',
            matchedMedicineId: 'med-07',
            inStock: true,
            approved: true
          }
        ]
      };

      onUploadPrescription(newRx);
      setUploadSuccessMessage(`Prescription submitted successfully! Assigned ID: ${newRx.id}. Our pharmacist is currently verifying.`);
      setSelectedRxForReview(newRx);
      setActiveTab('my_prescriptions');
    }, 1200);
  };

  const handleSimulateFileSelect = (sampleType: 'current' | 'alternate') => {
    setRxImagePreview(SAMPLE_PRESCRIPTION_IMAGE);
  };

  const pendingCount = prescriptions.filter((p) => p.status === 'under_review').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header and Subtitle */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Certified Tele-Dispensary Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Prescription Upload & Pharmacist Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload your doctor&apos;s prescription for instant clinical review, drug-drug interaction check, and dispensary fulfillment.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Upload Prescription
          </button>
          <button
            onClick={() => setActiveTab('my_prescriptions')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'my_prescriptions' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            My Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('pharmacist_queue')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pharmacist_queue' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <span>Pharmacist Desk</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {pendingCount} Pending
              </span>
            )}
          </button>
        </div>
      </div>

      {uploadSuccessMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{uploadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setUploadSuccessMessage(null)}
            className="text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: Upload Prescription Workflow */}
      {activeTab === 'upload' && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Upload Image & Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Step 1: Prescription Document
              </h3>

              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-50/70 transition-colors">
                <div className="aspect-4/3 max-h-72 w-full mx-auto overflow-hidden rounded-lg bg-slate-200 relative mb-3">
                  <img
                    src={rxImagePreview}
                    alt="Prescription preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
                    Sample Clinical Rx Loaded
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800">
                    High-clarity medical prescription attached
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports JPG, PNG, PDF formats up to 15MB. Ensure doctor&apos;s stamp and signature are visible.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <label className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer shadow-2xs">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setRxImagePreview(ev.target.result as string);
                            }
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSimulateFileSelect('current')}
                    className="px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 cursor-pointer"
                  >
                    Reset to Verified Sample
                  </button>
                </div>
              </div>

              {/* Legal prescription verification requirements */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <p className="font-semibold text-slate-900">Statutory Pharmacist Guidelines:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Prescription must have doctor&apos;s name and medical license number.</li>
                  <li>Date of consultation must be within the past 6 months.</li>
                  <li>Dosage, duration, and patient details must be clearly legible.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Patient & Physician Details Form */}
          <div className="lg:col-span-6 space-y-4">
            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Step 2: Patient & Physician Details
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Patient Age</label>
                  <input
                    type="number"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Patient Phone</label>
                  <input
                    type="text"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Prescribing Doctor&apos;s Name</label>
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Doctor License Number</label>
                  <input
                    type="text"
                    required
                    value={doctorRegNo}
                    onChange={(e) => setDoctorRegNo(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Hospital / Clinic</label>
                  <input
                    type="text"
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Automatic OCR Assist preview banner */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>Smart OCR Pre-Scan:</strong> Our dispensary assistant automatically indexes prescribed drugs to speed up pharmacist review by 70%.
                </p>
              </div>

              <button
                type="submit"
                disabled={isScanningOcr}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isScanningOcr ? (
                  <span>Digitizing and Submitting to Pharmacist Desk...</span>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Submit for Pharmacist Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: My Prescriptions (Patient View) */}
      {activeTab === 'my_prescriptions' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>ID: {rx.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>Issued: {rx.issuedDate}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {rx.patientName} ({rx.patientAge} yrs)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Doctor: {rx.doctorName} · {rx.clinicName}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  {rx.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      Verified & Stamped
                    </span>
                  ) : rx.status === 'under_review' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Under Clinical Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Rejected
                    </span>
                  )}
                </div>

                {/* Prescribed medicines list */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Digitized Prescribed Medications ({rx.extractedMedicines.length})
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {rx.extractedMedicines.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1 border-b border-slate-200/50 last:border-0">
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {item.dosage} · {item.frequency} · {item.duration}
                          </p>
                        </div>
                        <span className="text-[11px] text-teal-700 font-medium">In Stock</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pharmacist verification details if approved */}
                {rx.status === 'verified' && (
                  <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 text-xs text-teal-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                      <Stamp className="w-4 h-4 text-teal-700" />
                      <span>Certified by {rx.verifiedByPharmacistName}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      License #{rx.pharmacistLicenseNo} · Digital Stamp: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-teal-800">{rx.digitalRxSignature}</code>
                    </p>
                    {rx.pharmacistNotes && (
                      <p className="text-[11px] text-slate-600 italic">
                        Notes: &ldquo;{rx.pharmacistNotes}&rdquo;
                      </p>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={() => onAddRxItemsToCart(rx.extractedMedicines)}
                        className="w-full py-2 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add Verified Medicines to Order</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Pharmacist Review Desk & Queue */}
      {activeTab === 'pharmacist_queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                Rx
              </div>
              <div>
                <h3 className="text-sm font-bold">Apex Central Pharmacist Verification Console</h3>
                <p className="text-xs text-slate-400">
                  Duty Pharmacist: <span className="text-white font-medium">{pharmacistName}</span> ({pharmacistLicenseNo})
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Queue Status:</span>
              <p className="text-sm font-bold text-amber-400">{pendingCount} Rx awaiting review</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Queue List */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prescription Review Queue
              </h4>

              <div className="space-y-2">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRxForReview(rx)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedRxForReview?.id === rx.id
                        ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{rx.patientName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          rx.status === 'verified'
                            ? 'bg-teal-100 text-teal-800'
                            : rx.status === 'under_review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rx.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Prescribed by {rx.doctorName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {rx.extractedMedicines.length} medications mapped
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Detailed Verification Workstation */}
            {selectedRxForReview && (
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Reviewing Case {selectedRxForReview.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Patient: {selectedRxForReview.patientName} ({selectedRxForReview.patientAge} years)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Doctor: {selectedRxForReview.doctorName} (Reg #{selectedRxForReview.doctorRegistrationNumber}) · {selectedRxForReview.clinicName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Current Status:</span>
                    <p className="text-xs font-bold capitalize text-slate-800">{selectedRxForReview.status.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Prescription Image & Inspection */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Original Prescription Document
                    </h5>
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                      <img
                        src={selectedRxForReview.imageUrl}
                        alt="Prescription under review"
                        referrerPolicy="no-referrer"
                        className="w-full object-cover max-h-72"
                      />
                    </div>
                  </div>

                  {/* Digitized items checklist */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Digitized Medications Checklist
                    </h5>

                    <div className="space-y-2">
                      {selectedRxForReview.extractedMedicines.map((item, idx) => (
                        <div key={item.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{idx + 1}. {item.name}</span>
                            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
                              Dispensary Match
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            <span>Dosage: <strong>{item.dosage}</strong></span> · 
                            <span className="ml-1">Schedule: {item.frequency}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pharmacist Clinical Sign-off Inputs */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <label className="font-semibold text-slate-700 block">
                        Pharmacist Clinical Inspection Notes:
                      </label>
                      <textarea
                        rows={2}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        placeholder="Verify patient allergies, dosage safety, and contraindications..."
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-teal-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Decision Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onRejectPrescription(selectedRxForReview.id, 'Prescription details unclear or expired')}
                    className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Reject with Notice
                  </button>

                  <div className="flex items-center gap-2">
                    {selectedRxForReview.status === 'verified' ? (
                      <button
                        onClick={() => onAddRxItemsToCart(selectedRxForReview.extractedMedicines)}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add Items to Patient Cart</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onVerifyPrescription(selectedRxForReview.id, clinicalNotes, pharmacistName, pharmacistLicenseNo)}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <Stamp className="w-4 h-4" />
                        <span>Digitally Verify & Attach License Stamp</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
