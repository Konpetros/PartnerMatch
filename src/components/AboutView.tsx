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
  HelpCircle
} from 'lucide-react';

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
      description: "Organisations from all Erasmus+ Programme Countries"
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description: "Filter by country, organisation type, Key Action and thematic area"
    },
    {
      icon: Calendar,
      title: "Deadline Tracking",
      description: "Every listing shows its partner search deadline"
    },
    {
      icon: Sparkles,
      title: "Always Free",
      description: "Free to browse and free to list your organisation"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Set your organisation profile",
      description: "Create your free account and build your organisation profile so potential partners can learn who you are."
    },
    {
      number: "02",
      icon: FileText,
      title: "Submit your partner search listing",
      description: "Post a listing describing your project idea, target Key Actions, thematic topics, and the partners you need."
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
      question: "Is ErasmusMatch free?",
      answer: "Yes, completely free. Browsing listings and submitting your organisation profile costs nothing."
    },
    {
      question: "Do I need an OID to register?",
      answer: "No. OID is optional. However we recommend adding it as it builds trust with potential partners."
    },
    {
      question: "Can I submit more than one listing?",
      answer: "Yes. If you represent multiple organisations you can submit a separate listing for each one."
    },
    {
      question: "How long does my listing stay active?",
      answer: "Until the partner search deadline you selected when submitting. After that date your listing expires automatically."
    },
    {
      question: "Is ErasmusMatch affiliated with the European Commission?",
      answer: "No. ErasmusMatch is an independent directory. It is not affiliated with the European Commission, Erasmus+ programme, or any National Agency."
    }
  ];

  return (
    <div className="animate-fade-in space-y-0">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-indigo-50/50 py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-100/60 text-brand-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span>Connecting European Education</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 leading-tight">
            About <span className="text-brand-primary">Erasmus</span><span className="text-brand-accent">Match</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The free partner search directory built exclusively for Erasmus+ organisations across Europe
          </p>
        </div>
      </section>

      {/* What is ErasmusMatch Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              What is ErasmusMatch?
            </h2>
            <div className="text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base font-medium">
              <p>
                ErasmusMatch is a free directory where Erasmus+ organisations — NGOs, schools, VET providers, universities, and youth organisations — can list themselves and find partners for KA1, KA210, and KA220 projects.
              </p>
              <p>
                It is not affiliated with the European Commission or any National Agency. It is an independent tool built to make partner search easier.
              </p>
              <p>
                By providing a transparent, well-structured portal where organisations can expose their competence, specific requirements, previous project history, and precise partner search deadlines, we eliminate the endless email chains and unstructured social media postings.
              </p>
            </div>
          </div>

          {/* Right Column Grid Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Who Can Use ErasmusMatch Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Who Can Use ErasmusMatch?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-medium">
            ErasmusMatch is designed specifically for eligible participating institutions in the Erasmus+ framework.
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

      {/* Bottom CTA Section */}
      <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[24px] px-8 py-12 sm:py-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-505/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Find Your Partner?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Join hundreds of Erasmus+ schools, universities and NGOs already collaborating in our community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="cta-browse-directory"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-7 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Browse Directory</span>
              <ArrowRight className="w-4 h-4 text-brand-accent shrink-0" />
            </button>
            <button
              id="cta-submit-listing"
              onClick={() => onNavigate('submit')}
              className="w-full sm:w-auto px-7 py-3.5 border border-slate-700 hover:border-slate-500 hover:bg-white/5 text-white bg-transparent rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none cursor-pointer"
            >
              Submit Your Listing
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
