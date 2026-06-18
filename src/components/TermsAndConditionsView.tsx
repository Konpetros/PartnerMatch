import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Mail } from 'lucide-react';

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

interface TermsViewProps {
  onNavigate: (view: string) => void;
}

export default function TermsAndConditionsView({ onNavigate }: TermsViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-2">
          <FileText className="w-7 h-7 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Terms & Conditions</h1>
        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto">
          Please read these terms carefully before using ErasmusMatch. By creating an account or submitting a listing, you agree to these terms.
        </p>
        <p className="text-xs text-slate-400 font-semibold">Last updated: June 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">

        <Section title="1. About ErasmusMatch">
          <p>
            ErasmusMatch is a free online partner search directory designed exclusively for organisations participating in the Erasmus+ programme across Europe. The platform is operated by <strong>ErasmusMatch</strong>, based in Corfu, Greece.
          </p>
          <p>
            ErasmusMatch is an independent platform and is not affiliated with, endorsed by, or connected to the European Commission, any National Agency, or any other official Erasmus+ body.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>By registering on ErasmusMatch, you confirm that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are representing an organisation that is eligible to participate in the Erasmus+ programme, such as an NGO, school, university, VET provider, youth organisation, or other eligible institution.</li>
            <li>You are authorised to represent your organisation and submit information on its behalf.</li>
            <li>You are at least 18 years of age.</li>
            <li>The information you provide about your organisation is accurate, complete, and up to date.</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>
            To submit listings or create an organisation profile on ErasmusMatch, you must create an account using a valid email address or Google account. You are responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Maintaining the confidentiality of your account credentials.</li>
            <li>All activity that occurs under your account.</li>
            <li>Notifying us immediately at <a href="mailto:erasmusmatchinfo@gmail.com" className="text-brand-primary font-semibold hover:underline">erasmusmatchinfo@gmail.com</a> if you suspect any unauthorised use of your account.</li>
          </ul>
          <p>
            ErasmusMatch reserves the right to suspend or terminate accounts that violate these terms or that have been inactive for an extended period.
          </p>
        </Section>

        <Section title="4. Organisation Profiles">
          <p>
            When you create an organisation profile, the information you provide will be displayed publicly on ErasmusMatch and will be visible to all visitors, including non-registered users. You are responsible for ensuring that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All information in your profile is accurate and truthful.</li>
            <li>Your profile does not contain false, misleading, or fraudulent information.</li>
            <li>You have the right to use any logos, images, or other content you upload.</li>
            <li>Your profile complies with all applicable laws and regulations.</li>
          </ul>
          <p>
            You may update or delete your organisation profile at any time through your account settings.
          </p>
        </Section>

        <Section title="5. Partner Search Listings">
          <p>
            Partner search listings allow your organisation to publicly advertise its interest in finding Erasmus+ partners. By submitting a listing, you agree that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All information in your listing is accurate, truthful, and relates to a genuine Erasmus+ partnership search.</li>
            <li>Your listing will be reviewed by ErasmusMatch administrators before being published. We reserve the right to reject any listing that does not meet our standards or that violates these terms.</li>
            <li>Your listing will expire automatically after the partner search deadline you specify.</li>
            <li>You will update or remove your listing if your partnership needs change or if a partner has been found.</li>
            <li>You will not use listings to advertise services, solicit payments, or engage in any commercial activity unrelated to genuine Erasmus+ partnership search.</li>
          </ul>
        </Section>

        <Section title="6. Ownership of Content">
          <p>
            You retain full ownership of all content you submit to ErasmusMatch, including your organisation profile information, listing descriptions, and uploaded images.
          </p>
          <p>
            By submitting content to ErasmusMatch, you grant ErasmusMatch a non-exclusive, royalty-free, worldwide licence to display, reproduce, and distribute your content on the platform for the purpose of facilitating Erasmus+ partner search. This licence ends when you delete your content or your account.
          </p>
          <p>
            You represent and warrant that you have the right to grant this licence and that your content does not infringe the intellectual property rights of any third party.
          </p>
        </Section>

        <Section title="7. Prohibited Conduct">
          <p>When using ErasmusMatch, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Submit false, misleading, or fraudulent information about your organisation or projects.</li>
            <li>Impersonate any person, organisation, or official Erasmus+ body.</li>
            <li>Use the platform for commercial advertising, spam, or unsolicited communications.</li>
            <li>Attempt to gain unauthorised access to any part of the platform or other users' accounts.</li>
            <li>Use automated tools to scrape, harvest, or collect data from the platform without our prior written consent.</li>
            <li>Upload content that is defamatory, offensive, discriminatory, or otherwise harmful.</li>
            <li>Violate any applicable laws or regulations in your use of the platform.</li>
          </ul>
          <p>
            Violation of these prohibitions may result in immediate suspension or termination of your account and removal of your content.
          </p>
        </Section>

        <Section title="8. Moderation and Content Removal">
          <p>
            ErasmusMatch operates a moderation system to ensure the quality and integrity of content on the platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Admin review</strong> — all partner search listings are reviewed by ErasmusMatch administrators before being published. We reserve the right to reject or remove any listing that violates these terms or does not meet our quality standards.</li>
            <li><strong>Automatic expiry</strong> — listings automatically expire after the partner search deadline specified by the submitter.</li>
            <li><strong>User reporting</strong> — users may report listings or profiles they believe violate these terms by contacting us at <a href="mailto:erasmusmatchinfo@gmail.com" className="text-brand-primary font-semibold hover:underline">erasmusmatchinfo@gmail.com</a>.</li>
          </ul>
          <p>
            ErasmusMatch reserves the right to remove any content, suspend any account, or restrict access to the platform at its sole discretion without prior notice.
          </p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>
            ErasmusMatch is provided on an "as is" and "as available" basis. While we strive to maintain a high-quality, reliable platform, we make no warranties or representations of any kind, express or implied, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The accuracy, completeness, or reliability of any content submitted by users.</li>
            <li>The suitability of any organisation or listing for your specific partnership needs.</li>
            <li>The uninterrupted or error-free operation of the platform.</li>
            <li>That any partnership contacts made through ErasmusMatch will result in successful Erasmus+ applications or projects.</li>
          </ul>
          <p>
            ErasmusMatch is a directory tool only. We are not responsible for the outcome of any partnership negotiations, project applications, or collaborations that arise from use of the platform.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, ErasmusMatch shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the platform, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Loss of data, revenue, or business opportunities.</li>
            <li>Damages resulting from reliance on inaccurate or incomplete information submitted by other users.</li>
            <li>Damages resulting from the failure of a partnership or Erasmus+ application.</li>
          </ul>
        </Section>

        <Section title="11. Third-Party Links and Resources">
          <p>
            ErasmusMatch may contain links to third-party websites and resources, including official Erasmus+ resources and organisation websites. These links are provided for convenience only. ErasmusMatch does not endorse or take responsibility for the content, privacy practices, or availability of any third-party websites.
          </p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>
            ErasmusMatch reserves the right to update these Terms & Conditions at any time. When we make significant changes, we will update the "Last updated" date at the top of this page. Your continued use of the platform after any changes constitutes your acceptance of the updated terms.
          </p>
          <p>
            If you do not agree with any changes to these terms, you should stop using ErasmusMatch and may request deletion of your account by contacting us.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms & Conditions are governed by and construed in accordance with the laws of Greece. Any disputes arising from or relating to these terms or your use of ErasmusMatch shall be subject to the exclusive jurisdiction of the courts of Greece.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>
            If you have any questions about these Terms & Conditions, please contact us at:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:erasmusmatchinfo@gmail.com" className="text-brand-primary font-semibold hover:underline">erasmusmatchinfo@gmail.com</a></li>
            <li><strong>Operator:</strong> ErasmusMatch</li>
            <li><strong>Location:</strong> Corfu, Greece</li>
          </ul>
        </Section>

      </div>

      {/* Contact Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center space-y-4">
        <FileText className="w-8 h-8 text-brand-primary mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Questions about these terms?</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          If you have any questions about these Terms & Conditions or how ErasmusMatch operates, please get in touch.
        </p>
        <a
          href="mailto:erasmusmatchinfo@gmail.com"
          className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>erasmusmatchinfo@gmail.com</span>
        </a>
      </div>

    </div>
  );
}
