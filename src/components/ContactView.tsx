/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  Send,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (view: string) => void;
}

export default function ContactView({ onNavigate }: ContactViewProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Question');
  const [message, setMessage] = useState('');
  
  // Validation / Response state
  const [errors, setErrors] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // Validations
    if (!fullName.trim()) {
      newErrors.push('Full Name is required.');
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.push('A valid email address is required.');
    }
    if (!subject) {
      newErrors.push('Please select a subject.');
    }
    if (message.length < 20) {
      newErrors.push('Message must be at least 20 characters long.');
    }
    if (message.length > 1000) {
      newErrors.push('Message cannot exceed 1000 characters.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build and open a pre-filled mailto link so the message actually reaches support
    const mailtoSubject = encodeURIComponent(`[PartnerMatch Contact] ${subject} — from ${fullName}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:support@partnermatch.eu?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Success
    setErrors([]);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setSubject('General Question');
    setMessage('');
    setErrors([]);
    setIsSuccess(false);
  };

  return (
    <div className="animate-fade-in space-y-0">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-indigo-50/50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800">
            Contact & Support
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Have a question or need help? We're here for you.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column — Contact Form (7 columns wide) */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-blue-50/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Send Us a Message
            </h2>

            {isSuccess ? (
              <div 
                className="p-8 text-center bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-5 animate-fade-in"
                id="contact-success-container"
              >
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-850">Thank You!</h3>
                  <p className="text-sm text-slate-600 font-semibold">
                    Thank you! Your email client should have opened with this message pre-filled to support@partnermatch.eu. If it didn't open, please email us directly. We'll get back to you within 48 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" id="contact-support-form">
                
                {/* Form Errors summary */}
                {errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-1.5 animate-fade-in" id="contact-form-errors">
                    <div className="flex items-center space-x-2 text-red-600 text-sm font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Please correct the following errors:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-red-600 font-semibold pl-1 space-y-0.5">
                      {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full name field */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-full-name" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    required
                    placeholder="e.g. Maria Papadou"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="e.g. maria@ngo-partner.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Subject dropdown select */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Report a Listing">Report a Listing</option>
                      <option value="Partnership Inquiry">Partnership Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </div>

                {/* Message Textarea with counter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="contact-message" className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Message *
                    </label>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {message.length} / 1000 characters
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    placeholder="Please type your message here (minimum 20 characters)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-slate-400 resize-y"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">
                    Minimum requirement of 20 characters. Maximum context limit is 1,000 characters.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary-hover text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  id="contact-submit-btn"
                >
                  <Send className="w-4 h-4 text-brand-accent shrink-0" />
                  <span>Send Message</span>
                </button>

              </form>
            )}
          </div>

          {/* Right Column — Contact Info Boxes (5 columns wide) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Box 1: Email Support */}
            <div className="bg-white rounded-[20px] border border-blue-50/80 p-5 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-indigo-600 rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Support</h3>
                <p className="text-indigo-600 font-extrabold text-sm sm:text-base selection:bg-indigo-50">
                  support@partnermatch.eu
                </p>
                <p className="text-[11px] text-slate-500 font-medium">We respond within 48 hours</p>
              </div>
            </div>

            {/* Box 2: Response Time */}
            <div className="bg-white rounded-[20px] border border-blue-50/80 p-5 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-slate-600 rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Response Time</h3>
                <p className="text-slate-800 font-extrabold text-sm sm:text-base">
                  Monday to Friday
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Typically within 1–2 business days</p>
              </div>
            </div>

            {/* Box 3: Report a Listing */}
            <div className="bg-white rounded-[20px] border border-blue-50/80 p-5 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Report a Listing</h3>
                <p className="text-slate-800 font-bold text-sm leading-snug">
                  If you find an inappropriate or fraudulent listing, use the form and select 'Report a Listing' as the subject
                </p>
              </div>
            </div>

            {/* Box 4: Before Contacting Us */}
            <div className="bg-white rounded-[20px] border border-blue-50/80 p-5 shadow-sm flex items-start space-x-4">
              <div className="p-3 bg-brand-primary/5 text-brand-primary rounded-xl shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Before Contacting Us</h3>
                <button
                  type="button"
                  id="contact-faq-trigger"
                  onClick={() => onNavigate('about')}
                  className="text-left text-brand-primary hover:text-brand-primary-hover font-extrabold text-sm leading-snug underline cursor-pointer"
                >
                  Check our FAQ first — most questions are answered there
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
