import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Mail, FileText, Lock, Eye, Trash2, Download, AlertTriangle } from 'lucide-react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-left"
      >
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 py-5 bg-white border-t border-slate-100 text-sm text-slate-600 leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface GDPRViewProps {
  onNavigate: (view: string) => void;
}

export default function GDPRView({ onNavigate }: GDPRViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-2">
          <Shield className="w-7 h-7 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">GDPR & Data Rights</h1>
        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto">
          PartnerMatch is committed to protecting your personal data in full compliance with the General Data Protection Regulation (GDPR). This page explains your rights and how to exercise them.
        </p>
        <p className="text-xs text-slate-400 font-semibold">Last updated: June 2026</p>
      </div>

      {/* Your Rights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Right of Access</h3>
          </div>
          <p className="text-xs text-slate-500">Request a copy of all personal data we hold about you.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Right to Rectification</h3>
          </div>
          <p className="text-xs text-slate-500">Update or correct inaccurate data directly in your profile settings.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Right to Erasure</h3>
          </div>
          <p className="text-xs text-slate-500">Request permanent deletion of your account and all associated data.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Right to Portability</h3>
          </div>
          <p className="text-xs text-slate-500">Request a copy of your data in a structured, machine-readable format.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Right to Restriction</h3>
          </div>
          <p className="text-xs text-slate-500">Request that we limit the processing of your personal data in certain circumstances.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Right to Object</h3>
          </div>
          <p className="text-xs text-slate-500">Object to processing of your data where we rely on legitimate interests.</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">

        <Section title="1. Who is the Data Controller?">
          <p>
            The data controller for PartnerMatch is <strong>PartnerMatch</strong>, operated from Corfu, Greece. For all data protection enquiries, please contact us at <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-semibold hover:underline">support@partnermatch.eu</a>.
          </p>
          <p>
            PartnerMatch is subject to the General Data Protection Regulation (EU) 2016/679 (GDPR) as an operator based in an EU member state.
          </p>
        </Section>

        <Section title="2. What Personal Data We Process">
          <p>We process the following categories of personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity data</strong> — your name or organisation name and display name.</li>
            <li><strong>Contact data</strong> — your email address.</li>
            <li><strong>Organisation data</strong> — organisation type, country, city, website, OID, description, and logo.</li>
            <li><strong>Usage data</strong> — anonymised analytics data collected via Google Analytics.</li>
            <li><strong>Technical data</strong> — authentication data stored via Google Firebase.</li>
          </ul>
        </Section>

        <Section title="3. Legal Basis for Processing">
          <p>We process your personal data on the following legal bases under GDPR Article 6:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contract performance (Art. 6(1)(b))</strong> — processing your account and profile data is necessary to provide you with the PartnerMatch service.</li>
            <li><strong>Legitimate interests (Art. 6(1)(f))</strong> — we use anonymised analytics to improve the platform.</li>
            <li><strong>Consent (Art. 6(1)(a))</strong> — where you have explicitly agreed to specific processing activities.</li>
          </ul>
        </Section>

        <Section title="4. Data Retention">
          <p>
            We retain your personal data for as long as your account remains active on PartnerMatch. Specifically:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account and profile data</strong> — retained until you delete your account.</li>
            <li><strong>Listing data</strong> — retained until you delete the listing or your account.</li>
            <li><strong>Anonymised analytics data</strong> — retained for up to 26 months in Google Analytics.</li>
          </ul>
          <p>
            Upon account deletion, your personal data will be permanently removed from our systems within <strong>30 days</strong>.
          </p>
        </Section>

        <Section title="5. Data Transfers">
          <p>
            Your data is stored and processed using Google Firebase infrastructure in the <strong>europe-west1 region (Belgium)</strong>, which is within the European Economic Area (EEA). No transfers of personal data outside the EEA occur without appropriate safeguards.
          </p>
          <p>
            Google Analytics may process anonymised data on Google servers. Google LLC is certified under the EU-US Data Privacy Framework, providing adequate protection for data transfers.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement appropriate technical and organisational measures to protect your personal data, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Encryption of data in transit using TLS/HTTPS.</li>
            <li>Encryption of data at rest via Google Firebase infrastructure.</li>
            <li>Access controls via Firebase security rules preventing unauthorised access.</li>
          </ul>
        </Section>

        <Section title="7. Data Breach Notification">
          <p>
            In the event of a personal data breach that poses a risk to your rights and freedoms, PartnerMatch will notify the relevant supervisory authority within <strong>72 hours</strong> of becoming aware of the breach, in accordance with GDPR Article 33.
          </p>
          <p>
            If the breach is likely to result in a high risk to your rights and freedoms, we will also notify you directly without undue delay.
          </p>
        </Section>

        <Section title="8. How to Exercise Your Rights">
          <p>
            You can exercise the following rights directly through your account:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Rectification</strong> — update your data anytime via My Profile in your dashboard.</li>
            <li><strong>Erasure</strong> — delete your account via Settings in your dashboard.</li>
          </ul>
          <p>
            For all other requests — including access, portability, restriction, and objection — please contact us at <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-semibold hover:underline">support@partnermatch.eu</a>. We will respond within <strong>30 days</strong>.
          </p>
          <p>
            Please include your registered email address and a clear description of your request. We may need to verify your identity before processing your request.
          </p>
        </Section>

        <Section title="9. Complaints and Supervisory Authority">
          <p>
            If you are not satisfied with how we handle your personal data, you have the right to lodge a complaint with the supervisory authority in your country of residence.
          </p>
          <p>
            In Greece, the competent supervisory authority is the <strong>Hellenic Data Protection Authority (HDPA)</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Website: <a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold hover:underline">www.dpa.gr</a></li>
            <li>Address: Kifisias 1-3, 115 23 Athens, Greece</li>
            <li>Phone: +30 210 6475 600</li>
          </ul>
          <p>
            You may also lodge a complaint with the supervisory authority in your own EU member state if you are not based in Greece.
          </p>
        </Section>

        <Section title="10. Changes to This Page">
          <p>
            We may update this GDPR & Data Rights page from time to time to reflect changes in legislation or our practices. When we make significant changes, we will update the "Last updated" date at the top of this page.
          </p>
        </Section>

      </div>

      {/* Contact Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center space-y-4">
        <Shield className="w-8 h-8 text-brand-primary mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Exercise Your Data Rights</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          To submit a data request or ask any questions about your personal data, contact us directly. We respond to all requests within 30 days.
        </p>
        <a
          href="mailto:support@partnermatch.eu"
          className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>support@partnermatch.eu</span>
        </a>
      </div>

    </div>
  );
}
