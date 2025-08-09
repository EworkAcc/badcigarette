"use client"

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Shield, Eye, MapPin, Users } from 'lucide-react';

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
              <div className="text-gray-300 text-left">
                <div className="text-sm text-gray-400 mb-4">
                  <span className="font-bold text-gray-300">Effective Date:</span> August 9, 2025
                </div>

                <div className="mb-4">
                  Welcome to BadCigarette ("we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website located at [website URL] (the "Site"). Please read these Terms carefully before using the Site.
                </div>

                <div className="mb-6">
                  By accessing or using the Site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use the Site.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">1. Age Restriction</h3>
                <div className="mb-4">
                  This Site is intended only for individuals who are of legal age to purchase tobacco products in their jurisdiction (e.g., 21 years old in the United States). By using the Site, you represent and warrant that you meet the minimum age requirement.
                </div>
                <div className="mb-6">
                  We do not knowingly collect or solicit information from anyone under the legal age for tobacco consumption. If you are underage, you must not use the Site.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">2. Health Disclaimer</h3>
                <div className="mb-6">
                  Tobacco products are associated with health risks, including addiction, cancer, and other serious health conditions. Content on this Site is for informational or commercial purposes only and should not be construed as medical or health advice.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">3. Compliance with Local Laws</h3>
                <div className="mb-6">
                  You are solely responsible for ensuring that your use of the Site and any products or content accessed through it complies with applicable laws and regulations in your jurisdiction.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">4. Intellectual Property</h3>
                <div className="mb-6">
                  All content on the Site, including but not limited to text, images, logos, graphics, and software, is the property of BadCigarette or its licensors and is protected by intellectual property laws. You may not copy, modify, distribute, or use any content without our prior written consent.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">5. Prohibited Uses</h3>
                <div className="mb-2">You agree not to:</div>
                <div className="mb-6 space-y-1">
                  <div>• Use the Site for any unlawful purpose.</div>
                  <div>• Attempt to gain unauthorized access to the Site or its systems.</div>
                  <div>• Use the Site to promote, market, or distribute tobacco products in a manner that violates any laws.</div>
                  <div>• Upload or transmit viruses or malicious code.</div>
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">6. Third-Party Links</h3>
                <div className="mb-6">
                  The Site may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party websites.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">7. Product Availability and Pricing</h3>
                <div className="mb-6">
                  Product descriptions and pricing are subject to change without notice. We do not guarantee the availability of any product displayed on the Site.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">8. Limitation of Liability</h3>
                <div className="mb-6">
                  To the maximum extent permitted by law, BadCigarette and its affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising out of or relating to your use of the Site or any products obtained through it.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">9. Indemnification</h3>
                <div className="mb-6">
                  You agree to indemnify and hold harmless BadCigarette, its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, or expenses arising out of your use of the Site or your violation of these Terms.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">10. Termination</h3>
                <div className="mb-6">
                  We may terminate or suspend your access to the Site at our discretion, without notice, if we believe you have violated these Terms.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">11. Changes to Terms</h3>
                <div className="mb-6">
                  We reserve the right to modify these Terms at any time. If we make material changes, we will post the updated Terms on the Site and update the "Effective Date" above. Your continued use of the Site constitutes acceptance of the revised Terms.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">12. Governing Law</h3>
                <div className="mb-6">
                  These Terms are governed by the laws of the United States, without regard to its conflict of law principles. Any disputes shall be resolved in the courts of the United States.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">13. Contact Us</h3>
                <div className="mb-2">If you have any questions about these Terms, please contact us at:</div>
                <div className="font-semibold text-red-400">BadCigarette</div>
                <div>Email: badcigarette1@gmail.com</div>
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

const PrivacyPolicyPopup = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (!isMounted) {
    return (
      <span className="cursor-pointer hover:underline text-blue-400 hover:text-blue-300 transition-colors duration-200">
        {children}
      </span>
    );
  }

  return (
    <>
      <span
        onClick={openModal}
        className="cursor-pointer hover:underline text-blue-400 hover:text-blue-300 transition-colors duration-200"
      >
        {children}
      </span>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-600">
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-500" />
                Privacy Policy
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-gray-300 text-left">
                <div className="text-sm text-gray-400 mb-4">
                  <span className="font-bold text-gray-300">Last Updated:</span> August 9, 2025
                </div>

                <div className="mb-4">
                  BadCigarette ("we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our forum services.
                </div>

                <div className="bg-gray-700 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="font-semibold text-blue-400 mb-2">Important Notice:</div>
                  <div className="text-sm">This site is intended only for individuals of legal age to purchase tobacco products (21+ in the US). We do not knowingly collect information from minors.</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  1. Information We Collect
                </h3>
                
                <h4 className="font-semibold text-gray-200 mb-2">Personal Information You Provide:</h4>
                <div className="mb-4 space-y-1">
                  <div><span className="font-bold">Account Information:</span> Name, email address, username, password</div>
                  <div><span className="font-bold">Profile Information:</span> Profile picture, bio, preferences</div>
                  <div><span className="font-bold">Shipping/Billing Addresses:</span> For order fulfillment and delivery</div>
                  <div><span className="font-bold">Payment Information:</span> Credit card details (processed securely by third-party processors)</div>
                  <div><span className="font-bold">Forum Content:</span> Posts, comments, messages, and other user-generated content</div>
                  <div><span className="font-bold">Age Verification:</span> Date of birth or age verification documents</div>
                </div>

                <h4 className="font-semibold text-gray-200 mb-2">Information Collected Automatically:</h4>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">IP Addresses:</span> For security, analytics, and marketing analysis</div>
                  <div><span className="font-bold">Device Information:</span> Browser type, operating system, device identifiers</div>
                  <div><span className="font-bold">Usage Data:</span> Pages visited, time spent, click patterns, referral sources</div>
                  <div><span className="font-bold">Cookies and Tracking:</span> Session cookies, preference cookies, analytics cookies</div>
                  <div><span className="font-bold">Location Data:</span> General geographic location based on IP address</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  2. Public Display of Information
                </h3>
                <div className="bg-yellow-900 border border-yellow-600 rounded p-4 mb-4">
                  <div className="font-semibold text-yellow-300 mb-2">⚠️ Public Forum Notice:</div>
                  <div className="text-sm mb-2">The following information will be publicly visible to all users and visitors:</div>
                  <div className="space-y-1 text-sm">
                    <div>• Your chosen username/display name</div>
                    <div>• Your profile picture (if uploaded)</div>
                    <div>• All forum posts and comments you make</div>
                    <div>• Your join date and activity status</div>
                    <div>• Any other profile information you choose to make public</div>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="font-bold">Your real name and email address will never be displayed publicly</span> unless you explicitly choose to include them in your public profile or posts.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">3. How We Use Your Information</h3>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">Service Provision:</span> Process orders, manage accounts, provide customer support</div>
                  <div><span className="font-bold">Forum Operation:</span> Enable posting, messaging, and community features</div>
                  <div><span className="font-bold">Marketing Analysis:</span> Analyze user behavior, preferences, and demographics using IP addresses and usage data</div>
                  <div><span className="font-bold">Personalization:</span> Customize content and product recommendations</div>
                  <div><span className="font-bold">Communication:</span> Send order updates, promotional emails (with consent), and important notices</div>
                  <div><span className="font-bold">Security:</span> Prevent fraud, abuse, and unauthorized access</div>
                  <div><span className="font-bold">Legal Compliance:</span> Age verification and regulatory compliance</div>
                  <div><span className="font-bold">Improvement:</span> Analyze site performance and user experience</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  4. Address Information
                </h3>
                <div className="mb-2">We collect shipping and billing addresses for the following purposes:</div>
                <div className="mb-4 space-y-1">
                  <div><span className="font-bold">Order Fulfillment:</span> Shipping products to your specified address</div>
                  <div><span className="font-bold">Age Verification:</span> Verifying legal age requirements in your jurisdiction</div>
                  <div><span className="font-bold">Tax Compliance:</span> Calculating appropriate taxes based on location</div>
                  <div><span className="font-bold">Fraud Prevention:</span> Verifying payment information and preventing fraudulent transactions</div>
                </div>
                <div className="mb-6">
                  <span className="font-bold">Your address information is kept private and secure.</span> We do not display addresses publicly or share them with other users.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">5. Information Sharing</h3>
                <div className="mb-2">We may share your information with:</div>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">Service Providers:</span> Shipping companies, payment processors, email services, analytics providers</div>
                  <div><span className="font-bold">Legal Requirements:</span> When required by law, court order, or regulatory request</div>
                  <div><span className="font-bold">Business Transfer:</span> In case of merger, acquisition, or asset sale</div>
                  <div><span className="font-bold">Consent:</span> With your explicit permission</div>
                  <div><span className="font-bold">Safety:</span> To protect rights, property, or safety of users</div>
                </div>
                <div className="mb-6">
                  <span className="font-bold">We do not sell your personal information to third parties</span> for their marketing purposes.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">6. Data Security</h3>
                <div className="mb-2">We implement security measures including:</div>
                <div className="mb-6 space-y-1">
                  <div>• SSL encryption for data transmission</div>
                  <div>• Secure servers and databases</div>
                  <div>• Regular security audits and updates</div>
                  <div>• Access controls and authentication</div>
                  <div>• Payment data is processed by PCI-compliant third parties</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">7. Your Privacy Rights</h3>
                <div className="mb-2">Depending on your location, you may have the right to:</div>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">Access:</span> Request copies of your personal information</div>
                  <div><span className="font-bold">Correction:</span> Update or correct inaccurate information</div>
                  <div><span className="font-bold">Deletion:</span> Request deletion of your data (subject to legal requirements)</div>
                  <div><span className="font-bold">Portability:</span> Receive your data in a portable format</div>
                  <div><span className="font-bold">Opt-Out:</span> Unsubscribe from marketing communications</div>
                  <div><span className="font-bold">Restriction:</span> Limit how we process your information</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">8. Cookies and Tracking</h3>
                <div className="mb-2">We use cookies and similar technologies for:</div>
                <div className="mb-4 space-y-1">
                  <div>• Essential site functionality and user sessions</div>
                  <div>• Analytics and performance monitoring</div>
                  <div>• Marketing and advertising personalization</div>
                  <div>• User preferences and settings</div>
                </div>
                <div className="mb-6">
                  You can control cookie preferences through your browser settings, but some site functionality may be limited.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">9. Third-Party Services</h3>
                <div className="mb-2">We integrate with third-party services that may collect information:</div>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">Analytics:</span> Google Analytics, usage tracking services</div>
                  <div><span className="font-bold">Payment Processing:</span> Credit card processors, payment gateways</div>
                  <div><span className="font-bold">Shipping:</span> Delivery and logistics partners</div>
                  <div><span className="font-bold">Email Services:</span> Newsletter and transactional email providers</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">10. Data Retention</h3>
                <div className="mb-6">
                  We retain your information for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. Account data may be retained for up to 7 years after account closure for legal and regulatory compliance.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">11. International Users</h3>
                <div className="mb-6">
                  If you are located outside the United States, please note that your information may be transferred to and processed in the United States, where privacy laws may differ from your jurisdiction.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">12. Changes to This Policy</h3>
                <div className="mb-6">
                  We may update this Privacy Policy periodically. Material changes will be posted on our website with an updated "Last Updated" date. Continued use of our services constitutes acceptance of the revised policy.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">13. Contact Information</h3>
                <div className="mb-2">For privacy-related questions or requests, contact us at:</div>
                <div className="bg-gray-700 rounded p-4 mb-6">
                  <div className="font-semibold text-blue-400">BadCigarette Privacy Team</div>
                  <div>Email: privacy@badcigarette.com</div>
                  <div>General Contact: badcigarette1@gmail.com</div>
                  <div className="text-sm text-gray-400 mt-2">
                    For GDPR, CCPA, or other privacy regulation requests, please specify your location and the nature of your request.
                  </div>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded p-4">
                  <div className="font-semibold text-red-400 mb-2">Health Warning:</div>
                  <div className="text-sm">
                    This website and its services are related to tobacco products. Tobacco use is associated with serious health risks including addiction, cancer, and other health conditions. Please use responsibly and in accordance with local laws.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-600 px-6 py-4 bg-gray-900 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
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

export { TermsOfServicePopup, PrivacyPolicyPopup };