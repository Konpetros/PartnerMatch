import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cookie, Mail, Shield, AlertTriangle } from 'lucide-react';

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

interface CookiePolicyViewProps {
  onNavigate: (view: string) => void;
}

export default function CookiePolicyView({ onNavigate }: CookiePolicyViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">

      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-2">
          <Cookie className="w-7 h-7 text-brand-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Cookie Policy</h1>
        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto">
          This Cookie Policy explains what cookies and similar technologies PartnerMatch uses, why we use them, and how you can control them.
        </p>
        <p className="text-xs text-slate-400 font-semibold">Last updated: June 2026</p>
      </div>

      {/* Cookie Types Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Essential Cookies</h3>
          </div>
          <p className="text-xs text-slate-500">Required for the platform to function. Cannot be disabled.</p>
          <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Always Active</span>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Analytics Cookies</h3>
          </div>
          <p className="text-xs text-slate-500">Help us understand how users interact with the platform.</p>
          <span className="inline-block text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Optional</span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">

        <Section title="1. What Are Cookies?">
          <p>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners.
          </p>
          <p>
            In addition to traditional cookies, PartnerMatch also uses similar browser storage technologies such as <strong>localStorage</strong> and <strong>IndexedDB</strong>, which serve similar purposes but store data differently in your browser.
          </p>
        </Section>

        <Section title="2. Essential Cookies and Storage">
          <p>
            These are strictly necessary for PartnerMatch to function and cannot be disabled. They do not require your consent under GDPR as they are essential to provide the service you have requested.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse mt-2">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Name</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Provider</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Purpose</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Type</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-slate-200 font-medium">firebase:authUser</td>
                  <td className="p-3 border border-slate-200">Google Firebase</td>
                  <td className="p-3 border border-slate-200">Maintains your authenticated session so you stay signed in</td>
                  <td className="p-3 border border-slate-200">localStorage</td>
                  <td className="p-3 border border-slate-200">Session / persistent</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 border border-slate-200 font-medium">firebaseLocalStorageDb</td>
                  <td className="p-3 border border-slate-200">Google Firebase</td>
                  <td className="p-3 border border-slate-200">Stores authentication tokens securely in the browser</td>
                  <td className="p-3 border border-slate-200">IndexedDB</td>
                  <td className="p-3 border border-slate-200">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            These storage items are set by Google Firebase, our authentication and database provider. They are essential for keeping you signed in and cannot be disabled without breaking the platform.
          </p>
        </Section>

        <Section title="3. Analytics Cookies">
          <p>
            We use Google Analytics to help us understand how visitors use PartnerMatch. This allows us to improve the platform based on real usage data. Google Analytics uses cookies to collect anonymised information about your interactions with the platform, but only after you have given consent via the cookie banner described in Section 5.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse mt-2">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Name</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Provider</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Purpose</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Type</th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-slate-200 font-medium">_ga</td>
                  <td className="p-3 border border-slate-200">Google Analytics</td>
                  <td className="p-3 border border-slate-200">Distinguishes unique users by assigning a randomly generated number</td>
                  <td className="p-3 border border-slate-200">Cookie</td>
                  <td className="p-3 border border-slate-200">2 years</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-3 border border-slate-200 font-medium">_ga_*</td>
                  <td className="p-3 border border-slate-200">Google Analytics</td>
                  <td className="p-3 border border-slate-200">Stores and counts page views</td>
                  <td className="p-3 border border-slate-200">Cookie</td>
                  <td className="p-3 border border-slate-200">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-start space-x-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl mt-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 font-semibold">
              Google Analytics uses Google's Consent Mode: it loads with analytics cookies switched off by default, and these cookies are only set after you actively choose "Accept All" in the cookie banner described in Section 5.
            </p>
          </div>
        </Section>

        <Section title="4. How to Control Cookies">
          <p>
            You have several options to control or limit how cookies and browser storage are used:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Browser settings</strong> — most browsers allow you to refuse or delete cookies through their settings. Note that disabling essential cookies may prevent PartnerMatch from functioning correctly.
            </li>
            <li>
              <strong>Google Analytics opt-out</strong> — you can prevent Google Analytics from collecting your data by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold hover:underline">Google Analytics Opt-out Browser Add-on</a>.
            </li>
            <li>
              <strong>Incognito / private browsing</strong> — using your browser in private mode will prevent cookies and storage from persisting after you close the window.
            </li>
          </ul>
        </Section>

        <Section title="5. Cookie Consent Banner">
          <p>
            A cookie consent banner appears at the bottom of the screen on your first visit to PartnerMatch. The banner allows you to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Accept All</strong> — enables both essential and analytics cookies.</li>
            <li><strong>Decline</strong> — only essential cookies will be set. Analytics cookies will remain switched off.</li>
          </ul>
          <p>
            Your choice is saved in your browser's local storage and respected on future visits, so the banner will not appear again unless you clear your browser's site data. To change your preference, clear your browser's cookies and local storage for partnermatch.eu, or contact us at <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-semibold hover:underline">support@partnermatch.eu</a>.
          </p>
        </Section>

        <Section title="6. Third-Party Cookies">
          <p>
            PartnerMatch does not use any third-party advertising cookies or tracking cookies beyond those described in this policy. We do not sell or share cookie data with advertisers.
          </p>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for the cookie practices of those websites and encourage you to review their individual cookie policies.
          </p>
        </Section>

        <Section title="7. Changes to This Policy">
          <p>
            We may update this Cookie Policy from time to time, particularly when new cookies or storage technologies are introduced on the platform. When we make significant changes, we will update the "Last updated" date at the top of this page.
          </p>
        </Section>

        <Section title="8. Contact Us">
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please contact us at <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-semibold hover:underline">support@partnermatch.eu</a>.
          </p>
        </Section>

      </div>

      {/* Contact Footer */}
      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center space-y-4">
        <Cookie className="w-8 h-8 text-brand-primary mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Questions about cookies?</h3>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          If you have any questions about how PartnerMatch uses cookies or browser storage, please get in touch.
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
