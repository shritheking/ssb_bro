import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, 
  AlertCircle, Shield, MessageSquare, Clock 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    entryType: 'CDSE (IMA / OTA / AFA / INA)',
    prepStage: 'First-Timer / Written Cleared',
    message: '',
  });

  const [submittedPreview, setSubmittedPreview] = useState<typeof formData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill out all required fields marked with *', 'error');
      return;
    }

    setSubmittedPreview({ ...formData });
    showToast('Enquiry received in Demo Preview mode', 'success');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      entryType: 'CDSE (IMA / OTA / AFA / INA)',
      prepStage: 'First-Timer / Written Cleared',
      message: '',
    });
    setSubmittedPreview(null);
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* 1. Header Section */}
      <section className="relative pt-12 md:pt-20 border-b border-brand-border pb-16">
        <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold text-xs font-mono uppercase tracking-widest font-semibold">
            Connect & Enquire
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-text max-w-4xl leading-tight">
            Begin Your Mentorship <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-text via-brand-goldLight to-brand-gold">
              Dialogue.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-textMuted max-w-3xl leading-relaxed">
            Have questions regarding your SSB preparation strategy, previous conference-out debriefs, or proposed programmes? Submit your enquiry below.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-7 sm:p-10 shadow-xl space-y-6">
              
              <div className="space-y-1 border-b border-brand-border pb-4">
                <h2 className="font-heading text-2xl font-bold text-brand-text">
                  Aspirant Enquiry Form
                </h2>
                <p className="text-xs text-brand-textMuted">
                  Fill in your details to explore proposed mentorship tracks.
                </p>
              </div>

              {submittedPreview ? (
                /* Success Demo State */
                <div className="p-6 rounded-xl bg-brand-bgSecondary border border-brand-gold/40 space-y-4 text-center">
                  <CheckCircle2 className="w-10 h-10 text-brand-gold mx-auto" />
                  
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-lg text-brand-text">
                      Demo Submission Preview Generated
                    </h3>
                    <p className="text-xs text-brand-textMuted leading-relaxed max-w-md mx-auto">
                      Thank you, <strong className="text-brand-text">{submittedPreview.name}</strong>. In this static prototype, your enquiry is displayed below in demonstration state.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-lg bg-brand-bg border border-brand-border text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                    <div><span className="text-brand-textMuted">Email:</span> <span className="text-brand-text">{submittedPreview.email}</span></div>
                    <div><span className="text-brand-textMuted">Phone:</span> <span className="text-brand-text">{submittedPreview.phone || 'Not provided'}</span></div>
                    <div><span className="text-brand-textMuted">Target Entry:</span> <span className="text-brand-gold">{submittedPreview.entryType}</span></div>
                    <div><span className="text-brand-textMuted">Current Stage:</span> <span className="text-brand-steelLight">{submittedPreview.prepStage}</span></div>
                    <div className="pt-2 border-t border-brand-border"><span className="text-brand-textMuted">Message:</span> <span className="text-brand-text block mt-1">{submittedPreview.message}</span></div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={resetForm}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-text transition-colors"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Name */}
                  <div>
                    <label className="block text-brand-text font-medium mb-1.5 font-mono">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Rathore"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-brand-text font-medium mb-1.5 font-mono">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-brand-text font-medium mb-1.5 font-mono">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Entry Type & Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-brand-text font-medium mb-1.5 font-mono">
                        Target Defence Entry
                      </label>
                      <select
                        value={formData.entryType}
                        onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
                      >
                        <option value="CDSE (IMA / OTA / AFA / INA)">CDSE (IMA / OTA / AFA / INA)</option>
                        <option value="AFCAT (Flying / Ground Duty)">AFCAT (Flying / Ground Duty)</option>
                        <option value="NDA / NA Entry">NDA / NA Entry</option>
                        <option value="TGC / SSC Tech Army">TGC / SSC Tech Army</option>
                        <option value="NCC Special Entry">NCC Special Entry</option>
                        <option value="JAG / CAPF / INET">JAG / CAPF / INET</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-brand-text font-medium mb-1.5 font-mono">
                        Current Preparation Stage
                      </label>
                      <select
                        value={formData.prepStage}
                        onChange={(e) => setFormData({ ...formData, prepStage: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text focus:outline-none"
                      >
                        <option value="First-Timer / Written Cleared">First-Timer / Written Cleared</option>
                        <option value="Screened-Out (Stage 1 Repeater)">Screened-Out (Stage 1 Repeater)</option>
                        <option value="Conferenced-Out Repeater">Conferenced-Out Repeater</option>
                        <option value="Medically Deferred / Retesting">Medically Deferred / Retesting</option>
                        <option value="Early Stage Aspirant (College Student)">Early Stage Aspirant (College)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-brand-text font-medium mb-1.5 font-mono">
                      Your Message or Preparation Query *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your background, recent board experiences, or specific areas you want to develop (e.g. Psychology TAT, GTO, or PIQ audit)..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                    />
                  </div>

                  {/* Notice */}
                  <div className="text-[11px] text-brand-textMuted font-mono">
                    * Interactive Static Prototype: Validates form input locally and demonstrates submission preview.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-xs font-semibold bg-brand-gold text-brand-lightText hover:bg-brand-goldLight transition-colors flex items-center justify-center gap-2 shadow-gold-subtle"
                  >
                    <Send className="w-4 h-4" />
                    Submit Enquiry (Demo Preview)
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* Right Column: Contact Placeholders & Information */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Placeholders Card */}
            <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-7 space-y-6">
              <h3 className="font-heading font-bold text-lg text-brand-text">
                Platform Communications
              </h3>

              <div className="space-y-4 text-xs text-brand-textMuted">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-gold shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-text">Official Email</div>
                    <div className="font-mono text-brand-steelLight">
                      enquiry@ssbbro.concept (Placeholder)
                    </div>
                    <div className="text-[10px] text-brand-textMuted mt-0.5">
                      Official email address to be confirmed upon launch.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-steelLight shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-text">Helpline / WhatsApp</div>
                    <div className="font-mono text-brand-steelLight">
                      +91 (Official Number Pending)
                    </div>
                    <div className="text-[10px] text-brand-textMuted mt-0.5">
                      Dedicated mentorship coordinator contact to be announced.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-goldLight shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-text">Mentorship Base</div>
                    <div className="font-mono text-brand-steelLight">
                      Bengaluru, Karnataka, India
                    </div>
                    <div className="text-[10px] text-brand-textMuted mt-0.5">
                      Online pan-India cohorts & diagnostic video sessions.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept Advisory Card */}
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-gold uppercase font-semibold">
                <Shield className="w-4 h-4" />
                Concept Prototype Advisory
              </div>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                This website is a proposed brand identity and platform concept created by <strong>NextGen Web Studio</strong> for SSB BRO and Lt. Vamshi E.
              </p>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                No official government recruitment or military authority is claimed.
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
