import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Mail } from 'lucide-react';

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

interface PrivacyPolicyViewProps {
  onNavigate: (view: string) => void;
}

export default function PrivacyPolicyView({ onNavigate }: PrivacyPolicyViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-2">
          <Shield className="w-7 h-7 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto">
          PartnerMatch is committed to protecting your privacy and handling your data transparently and responsibly.
        </p>
        <p className="text-xs text-slate-400 font-semibold">Last updated: June 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">

        <Section title="1. Who We Are">
          <p>
            PartnerMatch is a free partner search directory for Erasmus+ organisations across Europe. The platform is operated by <strong>PartnerMatch</strong>, based in Corfu, Greece. PartnerMatch is not affiliated with or endorsed by the European Commission or any National Agency.
          </p>
          <p>
            For all privacy-related enquiries, you can contact us at: <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-semibold hover:underline">support@partnermatch.eu</a>
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>We collect the following categories of data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account information</strong> — when you register, we collect your name, email address, and authentication credentials (via Google Sign-In or email/password).
            </li>
            <li>
              <strong>Organisation profile</strong> — when you set up your organisation profile, we collect your organisation name, type, country, city, website, contact email, description, logo, and other details you choose to provide.
            </li>
            <li>
              <strong>Listing data</strong> — when you submit a partner search listing, we collect the content of that listing including project description, key actions, thematic topics, sectors, and partner requirements.
            </li>
            <li>
              <strong>Usage data</strong> — we use Google Analytics and Firebase Analytics to collect anonymised data about how users interact with the platform, including page views, session duration, and device type. This data does not identify you personally.
            </li>
            <li>
              <strong>Technical data</strong> — standard technical data such as IP address, browser type, and operating system may be collected automatically by our hosting infrastructure (Hostinger and Firebase).
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use the data we collect for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To create and manage your account on PartnerMatch</li>
            <li>To display your organisation profile and partner search listings publicly on the platform</li>
            <li>To enable other Erasmus+ organisations to find and contact you for partnership opportunities</li>
            <li>To administer and moderate the platform and ensure compliance with our Terms of Use</li>
            <li>To improve the platform using anonymised analytics data</li>
            <li>To respond to your enquiries and support requests</li>
          </ul>
          <p>
            We do not use your data for advertising purposes, and we do not sell your data to any third party.
          </p>
        </Section>

        <Section title="4. Legal Basis for Processing (GDPR)">
          <p>
            As PartnerMatch operates from Greece, an EU member state, we are subject to the General Data Protection Regulation (GDPR). Our legal basis for processing your personal data is as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Contract performance</strong> — processing your account and profile data is necessary to provide you with the PartnerMatch service.
            </li>
            <li>
              <strong>Legitimate interests</strong> — we use anonymised analytics data to improve the platform, which serves the legitimate interest of providing a better service to all users.
            </li>
            <li>
              <strong>Consent</strong> — where we rely on consent, such as for optional data fields, you may withdraw your consent at any time by contacting us.
            </li>
          </ul>
        </Section>

        <Section title="5. Data Sharing and Third Parties">
          <p>
            We do not sell, rent, or trade your personal data. We share data only with the following trusted third-party service providers who process data on our behalf:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Google Firebase</strong> — used for authentication, database storage (Firestore), and file storage. Firebase is operated by Google LLC. Data is stored in the <strong>europe-west1</strong> region (Belgium).
            </li>
            <li>
              <strong>Google Analytics</strong> — used to collect anonymised usage statistics. You can opt out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on.
            </li>
            <li>
              <strong>Hostinger and Firebase</strong> — used to host and serve the PartnerMatch web application.
            </li>
          </ul>
          <p>
            All third-party providers are required to process your data in accordance with GDPR and our instructions.
          </p>
        </Section>

        <Section title="6. Public Data">
          <p>
            Please be aware that the following information you provide on PartnerMatch is displayed <strong>publicly</strong> to all visitors of the platform, including non-registered users:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your organisation name, type, country, city, and description</li>
            <li>Your organisation logo</li>
            <li>Your contact email address as provided in your profile or listing</li>
            <li>Your partner search listings and their contents</li>
          </ul>
          <p>
            By submitting this information, you consent to it being displayed publicly on PartnerMatch for the purpose of Erasmus+ partner search.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your personal data for as long as your account is active on PartnerMatch. If you request deletion of your account, we will delete your profile, listings, and associated personal data within <strong>30 days</strong> of receiving your request.
          </p>
          <p>
            Anonymised analytics data may be retained for longer periods as it does not identify you personally.
          </p>
        </Section>

        <Section title="8. Your Rights Under GDPR">
          <p>As a user based in the EU, you have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right of access</strong> — you can request a copy of the personal data we hold about you.</li>
            <li><strong>Right to rectification</strong> — you can update or correct your data directly through your profile settings.</li>
            <li><strong>Right to erasure</strong> — you can request that we delete your account and all associated data.</li>
            <li><strong>Right to restriction</strong> — you can request that we restrict the processing of your data in certain circumstances.</li>
            <li><strong>Right to data portability</strong> — you can request a copy of your data in a structured, machine-readable format.</li>
            <li><strong>Right to object</strong> — you can object to our processing of your data where we rely on legitimate interests.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-semibold hover:underline">support@partnermatch.eu</a>. We will respond within <strong>30 days</strong>.
          </p>
          <p>
            You also have the right to lodge a complaint with the Hellenic Data Protection Authority (HDPA) at <a href="https://www.dpa.gr" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold hover:underline">www.dpa.gr</a>.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            PartnerMatch uses essential cookies required for authentication and session management. These cookies are necessary for the platform to function and cannot be disabled.
          </p>
          <p>
            We also use Google Analytics cookies to collect anonymised usage data. These are non-essential cookies. You can opt out at any time using the Google Analytics Opt-out Browser Add-on or by adjusting your browser settings.
          </p>
        </Section>

        <Section title="10. Data Security">
          <p>
            We take the security of your data seriously. All data is stored on Google Firebase infrastructure, which provides industry-standard security including encryption at rest and in transit. Access to your data is protected by Firebase security rules that prevent unauthorised access.
          </p>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>
            PartnerMatch is intended for use by organisations and their representatives. It is not directed at individuals under the age of 16. We do not knowingly collect personal data from anyone under 16 years of age.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make significant changes, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically.
          </p>
        </Section>

      </div>

      {/* Contact Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center space-y-4">
        <Mail className="w-8 h-8 text-brand-primary mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Questions about your privacy?</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          If you have any questions about this Privacy Policy or how we handle your data, please do not hesitate to get in touch.
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
