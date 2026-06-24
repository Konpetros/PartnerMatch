/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe, 
  Filter, 
  Calendar, 
  Sparkles, 
  UserPlus, 
  FileText, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  Briefcase,
  HelpCircle,
  Heart,
  Mail,
  Building2,
  Shield
} from 'lucide-react';
import PartnerMatchLogo from '../assets/PartnerMatchLogo';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  // FAQ interactive state (null if none, otherwise number index)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const featureHighlights = [
    {
      icon: Globe,
      title: "Pan-European Directory",
      description: "Discover partner organisations from all 35+ Erasmus+ Programme Countries in one place"
    },
    {
      icon: Filter,
      title: "Powerful Filtering",
      description: "Filter by country, organisation type, Key Action, sector, and thematic area"
    },
    {
      icon: Calendar,
      title: "Deadline Tracking",
      description: "Every listing shows its partner search deadline so you never miss a collaboration window"
    },
    {
      icon: Sparkles,
      title: "Free — No Subscription Ever",
      description: "Browsing the directory and listing your organisation is completely free, with no hidden fees"
    },
    {
      icon: Heart,
      title: "Save Favourite Listings",
      description: "Bookmark interesting partner calls to your Favourites and revisit them from your dashboard"
    },
    {
      icon: Mail,
      title: "Direct Contact",
      description: "Reach out to any organisation directly via email — no intermediary, no forms, no delays"
    },
    {
      icon: Building2,
      title: "Organisation Profiles",
      description: "Every registered organisation gets a public profile page with their details, sector, and active partner calls"
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description: "Control what information is visible to others — email, city, and profile visibility are all configurable"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Set your organisation profile",
      description: "Create your free account and build your organisation profile so potential partners can learn about you and reach out."
    },
    {
      number: "02",
      icon: FileText,
      title: "Submit your partner search listing",
      description: "Post a listing describing your project idea, Key Actions, topics, and the type of partners you are looking for."
    },
    {
      number: "03",
      icon: Compass,
      title: "Get discovered by other organisations",
      description: "Other Erasmus+ organisations across Europe browse the directory, find your listing, and reach out directly."
    }
  ];

  const whoCards = [
    {
      emoji: "👥",
      title: "NGOs & Youth Organisations",
      description: "Grassroots organisations, non-profits, and informal youth groups seeking project partners."
    },
    {
      emoji: "🏫",
      title: "Schools & Secondary Education",
      description: "Primary and secondary schools focused on pupil mobility, strategic partnerships, and teacher exchange."
    },
    {
      emoji: "🔧",
      title: "VET Providers",
      description: "Vocational education and training institutions linking professional development with European partners."
    },
    {
      emoji: "🎓",
      title: "Universities & Higher Education",
      description: "Academic institutions coordinating large-scale cooperation partnerships and student mobilities."
    },
    {
      emoji: "💼",
      title: "Independent Erasmus+ Consultants",
      description: "Experienced coordinators, researchers, and project designers advising partner search consortia."
    }
  ];

  const faqs = [
    {
      question: "Is PartnerMatch free?",
      answer: "Yes, completely free — both for browsing and for listing your organisation. There are no subscription fees, no premium tiers, and no hidden costs."
    },
    {
      question: "Is PartnerMatch affiliated with the European Commission?",
      answer: "No. PartnerMatch is an independent platform. It is not affiliated with, endorsed by, or connected to the European Commission, the Erasmus+ programme, or any National Agency."
    },
    {
      question: "Do I need an OID to register?",
      answer: "No. An OID (Organisation ID) is optional when creating your profile. However, we strongly recommend adding it as it builds trust with potential partners and confirms your organisation's eligibility."
    },
    {
      question: "What Key Actions does PartnerMatch support?",
      answer: "PartnerMatch supports partner searches for KA1 (Learning Mobility), KA2 (Cooperation Partnerships including KA210 and KA220), and KA3 (Support for Policy Development). You can filter listings by Key Action when browsing."
    },
    {
      question: "How long does my listing stay active?",
      answer: "Until the partner search deadline you set when submitting. After that date your listing expires automatically. You can also manually mark a listing as 'Partnership Found' from your dashboard once you have found a suitable partner."
    },
    {
      question: "Can I submit more than one listing?",
      answer: "Yes. If your organisation is looking for partners across multiple projects or Key Actions, you can submit a separate listing for each one."
    },
    {
      question: "How do I contact an organisation I found on PartnerMatch?",
      answer: "Each active listing includes the organisation's contact email. Simply click 'Contact Organisation' on the listing detail page to send them an email directly. No intermediary, no forms — just direct contact."
    }
  ];

  return (
    <div className="animate-fade-in space-y-0">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-indigo-50/50 py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-100/60 text-brand-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
            <PartnerMatchLogo size={16} />
            <span>Connecting European Education</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 leading-tight">
            About <span className="text-brand-primary">Partner</span><span className="text-brand-accent">Match</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The free partner search directory built exclusively for Erasmus+ organisations across Europe
          </p>
        </div>
      </section>

      {/* What is PartnerMatch Section — full width */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            What is PartnerMatch?
          </h2>
          <div className="text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base font-medium">
            <p>
              PartnerMatch is a free directory where Erasmus+ organisations — NGOs, schools, VET providers, universities, and youth organisations — can list themselves and find partners for KA1, KA210, and KA220 projects.
            </p>
            <p>
              It is not affiliated with the European Commission or any National Agency. It is an independent tool built to make partner search easier.
            </p>
            <p>
              By providing a transparent, well-structured portal where organisations can expose their competence, specific requirements, previous project history, and precise partner search deadlines, we eliminate the endless email chains and unstructured social media postings.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Features
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
              Everything you need to find the right Erasmus+ partner, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureHighlights.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[20px] border border-blue-50/80 p-5 shadow-sm space-y-3 flex flex-col items-start transition-all hover:border-blue-200/50"
                  id={`feature-highlight-${idx}`}
                >
                  <div className="p-2.5 bg-blue-50 text-brand-primary rounded-xl">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">{feat.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50/50 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
              Start building professional consortia for upcoming funding rounds in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-[20px] border border-blue-50/80 p-6 shadow-sm relative space-y-4 flex flex-col hover:border-blue-200/50 transition-all duration-200"
                  id={`how-works-step-${idx}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-indigo-150 tracking-tight">
                      {step.number}
                    </span>
                    <div className="p-3 bg-blue-50 text-brand-primary rounded-xl">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-base">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Can Use PartnerMatch Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Who Can Use PartnerMatch?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-medium">
            PartnerMatch is designed specifically for eligible participating institutions in the Erasmus+ framework.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whoCards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-[20px] border border-blue-50/80 p-6 shadow-sm flex items-start space-x-4 hover:border-blue-200/50 transition-any duration-200"
              id={`who-can-use-card-${idx}`}
            >
              <div className="text-3xl shrink-0 p-1 select-none">
                {card.emoji}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{card.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="bg-slate-50/50 border-t border-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              If you have any further questions, please do not hesitate to contact our friendly support team.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-blue-50/80 overflow-hidden shadow-xs transition-colors"
                  id={`faq-accordion-item-${idx}`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-slate-800 text-sm sm:text-base hover:bg-slate-50/60 transition-colors cursor-pointer outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-primary shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100/50 animate-fade-in">
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who is Behind PartnerMatch Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-[24px] p-8 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Who is Behind PartnerMatch?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            I'm an Erasmus+ consultant and solo developer based in Greece, and I built PartnerMatch because I kept seeing the same frustration in my work — organisations searching for partners through scattered Facebook posts and endless email chains with no real structure. If you have feedback, ideas, or want to explore a collaboration, I'd love to hear from you at{' '}
            <a href="mailto:support@partnermatch.eu" className="text-brand-primary font-bold hover:underline">
              support@partnermatch.eu
            </a>
          </p>
        </div>
      </section>



    </div>
  );
}
