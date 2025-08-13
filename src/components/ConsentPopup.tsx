"use client"

import React, { useState } from 'react';
import { X, Shield, AlertTriangle, Info } from 'lucide-react';

interface ConsentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consents: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    dataSellingConsent: boolean;
  }) => void;
  userType: 'signup' | 'google';
}

const ConsentPopup: React.FC<ConsentPopupProps> = ({ 
  isOpen, 
  onClose, 
  onConsent, 
  userType 
}) => {
  const [consents, setConsents] = useState({
    termsOfService: false,
    privacyPolicy: false,
    dataSellingConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsentChange = (type: keyof typeof consents) => {
    setConsents(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = async () => {
    if (!consents.termsOfService || !consents.privacyPolicy) {
      alert('You must accept both the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConsent(consents);
    } catch (error) {
      console.error('Consent submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = consents.termsOfService && consents.privacyPolicy && !isSubmitting;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-600">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Privacy & Consent Preferences
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-gray-300">
            <div className="mb-6">
              <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-300 mb-1">Before We Continue</div>
                    <div className="text-sm text-blue-200">
                      {userType === 'google' 
                        ? 'To complete your Google sign-in, we need your consent for how we handle your data.'
                        : 'To complete your account creation, we need your consent for how we handle your data.'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Required Agreements
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="termsOfService"
                      checked={consents.termsOfService}
                      onChange={() => handleConsentChange('termsOfService')}
                      className="mt-1 h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <label htmlFor="termsOfService" className="text-sm font-medium text-gray-200 cursor-pointer">
                        I agree to the <span className="text-red-400 underline">Terms of Service</span>
                      </label>
                      <div className="text-xs text-gray-400 mt-1">
                        Required to use our services. Includes age verification (18+) and usage guidelines.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacyPolicy"
                      checked={consents.privacyPolicy}
                      onChange={() => handleConsentChange('privacyPolicy')}
                      className="mt-1 h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <label htmlFor="privacyPolicy" className="text-sm font-medium text-gray-200 cursor-pointer">
                        I agree to the <span className="text-blue-400 underline">Privacy Policy</span>
                      </label>
                      <div className="text-xs text-gray-400 mt-1">
                        Required to process your personal information and provide services.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Data Sharing Preference
                </h3>
                
                <div className="bg-yellow-900 border border-yellow-600 rounded p-3 mb-4">
                  <div className="text-sm text-yellow-200">
                    <strong>Important Choice:</strong> We may share or sell aggregated or personal data (including IP addresses) 
                    to trusted third parties for advertising, analytics, and marketing purposes. This helps us improve our 
                    services and keep them free.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="dataSellingConsent"
                    checked={consents.dataSellingConsent}
                    onChange={() => handleConsentChange('dataSellingConsent')}
                    className="mt-1 h-4 w-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <label htmlFor="dataSellingConsent" className="text-sm font-medium text-gray-200 cursor-pointer">
                      I consent to the sharing/selling of my personal data for advertising and analytics
                    </label>
                    <div className="text-xs text-gray-400 mt-1">
                      <strong>Optional:</strong> You can opt out at any time. California residents have additional rights under CCPA.
                      Unchecking this will limit some personalization features but won't affect core site functionality.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
              <div className="text-xs text-gray-400">
                <div className="mb-2">
                  <strong>Your Rights:</strong> You can request access, correction, or deletion of your data at any time. 
                  California residents can opt out of data sales via the "Do Not Sell My Personal Information" link.
                </div>
                <div>
                  <strong>Contact:</strong> For privacy questions, email badcigarette1@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 px-6 py-4 bg-gray-900 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              {canSubmit ? 'Ready to continue' : 'Please accept required agreements'}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;