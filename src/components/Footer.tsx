/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Mail, BookOpen, ShieldCheck } from 'lucide-react';
import ErasmusMatchLogo from '../assets/ErasmusMatchLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <div 
              id="footer-logo"
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <ErasmusMatchLogo size={32} className="brightness-0 invert" />
              <span className="text-xl font-extrabold tracking-tight text-white">
                Erasmus<span className="text-white">Match</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bridging opportunities and fostering cross-border alliances by simplifying partner-finding for Erasmus+ schools, universities, NGOs, and youth workers.
            </p>
            <div className="flex space-x-3 pt-2">
              <span className="inline-flex items-center text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
                🇪🇺 Funded by Hope & Innovation
              </span>
            </div>
          </div>

          {/* Directory Shortcuts */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-brand-primary" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Browse Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('organisations')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Organisations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Submit Listing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-listings')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* European Resources */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span>Official Resources</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a 
                  href="https://erasmus-plus.ec.europa.eu/resources-and-tools/documents-and-guidelines/erasmus-programme-guide-2026" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  Erasmus+ Programme Guide 2026
                </a>
              </li>
              <li>
                <a 
                  href="https://erasmus-plus.ec.europa.eu/opportunities/calls-for-proposals-and-tenders" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  Open Calls for Proposals
                </a>
              </li>
              <li>
                <a 
                  href="https://epale.ec.europa.eu/en/content/partner-search" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  EPALE Partner Search
                </a>
              </li>
              <li>
                <a 
                  href="https://ec.europa.eu/info/index_en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  European Commission
                </a>
              </li>
              <li>
                <a 
                  href="https://webgate.ec.europa.eu/erasmus-esc/home/organisations/search-for-an-organisation" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  OID Registration
                </a>
              </li>
              <li>
                <a 
                  href="https://erasmus-plus.ec.europa.eu/national-agencies" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  National Agencies
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>Support & Safety</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="flex items-center space-x-2 pt-2 text-xs text-slate-500">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>support@erasmusmatch.org</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} ErasmusMatch. Designed to empower European collaborations.</p>
          <p className="mt-2 sm:mt-0">
            For academic and educational exchange networks only.
          </p>
        </div>
      </div>
    </footer>
  );
}
