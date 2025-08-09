"use client"

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const TermsOfServicePopup = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (!isMounted) {
    return (
      <span className="cursor-pointer hover:underline text-red-400 hover:text-red-300 transition-colors duration-200">
        {children}
      </span>
    );
  }

  return (
    <>
      <span
        onClick={openModal}
        className="cursor-pointer hover:underline text-red-400 hover:text-red-300 transition-colors duration-200"
      >
        {children}
      </span>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-600">
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Terms of Service
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none text-gray-300">
                <p className="text-sm text-gray-400 mb-4">
                  <strong className="text-gray-300">Effective Date:</strong> January 1, 2025
                </p>

                <p className="mb-4">
                  Welcome to BadCigarette ("we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website located at [website URL] (the "Site"). Please read these Terms carefully before using the Site.
                </p>

                <p className="mb-6">
                  By accessing or using the Site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use the Site.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">1. Age Restriction</h3>
                <p className="mb-4">
                  This Site is intended only for individuals who are of legal age to purchase tobacco products in their jurisdiction (e.g., 21 years old in the United States). By using the Site, you represent and warrant that you meet the minimum age requirement.
                </p>
                <p className="mb-6">
                  We do not knowingly collect or solicit information from anyone under the legal age for tobacco consumption. If you are underage, you must not use the Site.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">2. Health Disclaimer</h3>
                <p className="mb-6">
                  Tobacco products are associated with health risks, including addiction, cancer, and other serious health conditions. Content on this Site is for informational or commercial purposes only and should not be construed as medical or health advice.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">3. Compliance with Local Laws</h3>
                <p className="mb-6">
                  You are solely responsible for ensuring that your use of the Site and any products or content accessed through it complies with applicable laws and regulations in your jurisdiction.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">4. Intellectual Property</h3>
                <p className="mb-6">
                  All content on the Site, including but not limited to text, images, logos, graphics, and software, is the property of BadCigarette or its licensors and is protected by intellectual property laws. You may not copy, modify, distribute, or use any content without our prior written consent.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">5. Prohibited Uses</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-1">
                  <li>Use the Site for any unlawful purpose.</li>
                  <li>Attempt to gain unauthorized access to the Site or its systems.</li>
                  <li>Use the Site to promote, market, or distribute tobacco products in a manner that violates any laws.</li>
                  <li>Upload or transmit viruses or malicious code.</li>
                </ul>

                <h3 className="text-lg font-semibold text-red-400 mb-3">6. Third-Party Links</h3>
                <p className="mb-6">
                  The Site may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party websites.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">7. Product Availability and Pricing</h3>
                <p className="mb-6">
                  Product descriptions and pricing are subject to change without notice. We do not guarantee the availability of any product displayed on the Site.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">8. Limitation of Liability</h3>
                <p className="mb-6">
                  To the maximum extent permitted by law, BadCigarette and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising out of or relating to your use of the Site or any products obtained through it.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">9. Indemnification</h3>
                <p className="mb-6">
                  You agree to indemnify and hold harmless BadCigarette, its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, or expenses arising out of your use of the Site or your violation of these Terms.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">10. Termination</h3>
                <p className="mb-6">
                  We may terminate or suspend your access to the Site at our discretion, without notice, if we believe you have violated these Terms.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">11. Changes to Terms</h3>
                <p className="mb-6">
                  We reserve the right to modify these Terms at any time. If we make material changes, we will post the updated Terms on the Site and update the "Effective Date" above. Your continued use of the Site constitutes acceptance of the revised Terms.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">12. Governing Law</h3>
                <p className="mb-6">
                  These Terms are governed by the laws of the United States, without regard to its conflict of law principles. Any disputes shall be resolved in the courts of the United States.
                </p>

                <h3 className="text-lg font-semibold text-red-400 mb-3">13. Contact Us</h3>
                <p className="mb-2">If you have any questions about these Terms, please contact us at:</p>
                <p className="font-semibold text-red-400">BadCigarette</p>
                <p>Email: badcigarette1@gmail.com</p>
              </div>
            </div>

            <div className="border-t border-gray-600 px-6 py-4 bg-gray-900 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsOfServicePopup;