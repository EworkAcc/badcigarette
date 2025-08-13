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
                  Welcome to BadCigarette ("we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website (the "Site"). Please read these Terms carefully before using the Site.
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
                  Tobacco products are associated with serious health risks, including addiction, cancer, heart disease, stroke, lung diseases, and other life-threatening conditions. Content on this Site is for informational or commercial purposes only and should not be construed as medical or health advice. We strongly encourage users to consult healthcare professionals regarding tobacco use and cessation.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">3. Data Collection and Use</h3>
                <div className="mb-6">
                  By using the Site, you consent that we may collect technical data, including your IP address and device identifiers, for purposes including security, analytics, marketing, and service improvements. We may share aggregated or personal data, including IP addresses, with trusted third parties for advertising, analytics, and marketing purposes. Where required by applicable law (e.g., California Consumer Privacy Act), we provide clear opt-out mechanisms to prevent sale or sharing of personal information. For detailed information about our data practices, please review our Privacy Policy.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">4. Compliance with Local Laws</h3>
                <div className="mb-6">
                  You are solely responsible for ensuring that your use of the Site and any products or content accessed through it complies with applicable laws and regulations in your jurisdiction, including but not limited to age verification requirements, tobacco advertising restrictions, and import/export regulations.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">5. Intellectual Property</h3>
                <div className="mb-6">
                  All content on the Site, including but not limited to text, images, logos, graphics, and software, is the property of BadCigarette or its licensors and is protected by intellectual property laws. You may not copy, modify, distribute, or use any content without our prior written consent.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">6. Prohibited Uses</h3>
                <div className="mb-2">You agree not to:</div>
                <div className="mb-6 space-y-1">
                  <div>• Use the Site for any unlawful purpose or in violation of applicable laws</div>
                  <div>• Attempt to gain unauthorized access to the Site or its systems</div>
                  <div>• Use the Site to promote, market, or distribute tobacco products in a manner that violates any laws or regulations</div>
                  <div>• Upload or transmit viruses, malware, or other malicious code</div>
                  <div>• Engage in fraudulent activities or misrepresent your identity or affiliation</div>
                  <div>• Interfere with or disrupt the Site's functionality or other users' access</div>
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">7. Third-Party Links and Services</h3>
                <div className="mb-6">
                  The Site may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party websites. Your use of third-party services is at your own risk.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">8. Product Availability and Pricing</h3>
                <div className="mb-6">
                  Product descriptions, availability, and pricing are subject to change without notice. We do not guarantee the availability of any product displayed on the Site and reserve the right to limit quantities or refuse service.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">9. Disclaimer of Warranties</h3>
                <div className="mb-6">
                  The Site and its content are provided "as is" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">10. Limitation of Liability</h3>
                <div className="mb-6">
                  To the maximum extent permitted by law, BadCigarette and its affiliates, officers, directors, employees, and agents shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of or relating to your use of the Site, any products obtained through it, or any content or services accessed via the Site, even if we have been advised of the possibility of such damages.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">11. Indemnification</h3>
                <div className="mb-6">
                  You agree to indemnify, defend, and hold harmless BadCigarette, its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to your use of the Site, your violation of these Terms, or your violation of any rights of another party.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">12. Termination</h3>
                <div className="mb-6">
                  We may terminate or suspend your access to the Site at our sole discretion, without prior notice, if we believe you have violated these Terms or for any other reason we deem appropriate.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">13. Changes to Terms</h3>
                <div className="mb-6">
                  We reserve the right to modify these Terms at any time. If we make material changes, we will post the updated Terms on the Site and update the "Effective Date" above. Your continued use of the Site after such changes constitutes acceptance of the revised Terms.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">14. Governing Law and Dispute Resolution</h3>
                <div className="mb-6">
                  These Terms are governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles. Any disputes arising from these Terms or your use of the Site shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">15. Severability</h3>
                <div className="mb-6">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
                </div>

                <h3 className="text-lg font-semibold text-red-400 mb-3">16. Contact Us</h3>
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
                  BadCigarette ("we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </div>

                <div className="bg-gray-700 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="font-semibold text-blue-400 mb-2">Important Notice:</div>
                  <div className="text-sm">This site is intended only for individuals of legal age to purchase tobacco products (18+ or 21+ depending on jurisdiction). We do not knowingly collect information from minors.</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  1. Information We Collect
                </h3>
               
                <h4 className="font-semibold text-gray-200 mb-2">Personal Information You Provide:</h4>
                <div className="mb-4 space-y-1">
                  <div><span className="font-bold">Account Information:</span> Name, email address, username, password</div>
                  <div><span className="font-bold">Profile Information:</span> Profile picture, bio, preferences</div>
                  <div><span className="font-bold">Contact Information:</span> Phone number for account verification and communication</div>
                  <div><span className="font-bold">Address Information:</span> Shipping and billing addresses for order fulfillment</div>
                  <div><span className="font-bold">Payment Information:</span> Credit card details (processed securely by third-party processors)</div>
                  <div><span className="font-bold">Forum Content:</span> Posts, comments, messages, and other user-generated content</div>
                  <div><span className="font-bold">Age Verification:</span> Date of birth or age verification documents as required by law</div>
                  <div><span className="font-bold">Consent Preferences:</span> Your choices regarding data sharing and marketing communications</div>
                </div>

                <h4 className="font-semibold text-gray-200 mb-2">Information Collected Automatically:</h4>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">IP Addresses:</span> For security, fraud prevention, analytics, marketing analysis, and service improvements. We may share or sell aggregated or personal data including IP addresses to trusted third parties for advertising and analytics purposes. You can opt out of data selling as described below.</div>
                  <div><span className="font-bold">Device Information:</span> Browser type, operating system, device identifiers, screen resolution</div>
                  <div><span className="font-bold">Usage Data:</span> Pages visited, time spent, click patterns, referral sources, search queries</div>
                  <div><span className="font-bold">Cookies and Tracking:</span> Session cookies, preference cookies, analytics cookies, advertising cookies</div>
                  <div><span className="font-bold">Location Data:</span> General geographic location based on IP address (not precise location)</div>
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
                    <div>• All forum posts, comments, and reviews you make</div>
                    <div>• Your join date and activity status</div>
                    <div>• Any other profile information you choose to make public</div>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="font-bold">Your real name, email address, phone number, and address will never be displayed publicly</span> unless you explicitly choose to include them in your public profile or posts.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">3. How We Use Your Information</h3>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">Service Provision:</span> Process orders, manage accounts, provide customer support, enable site functionality</div>
                  <div><span className="font-bold">Forum Operation:</span> Enable posting, messaging, commenting, and community features</div>
                  <div><span className="font-bold">Marketing and Analytics:</span> Analyze user behavior, preferences, and demographics using IP addresses and usage data to improve services and target advertising</div>
                  <div><span className="font-bold">Personalization:</span> Customize content, product recommendations, and user experience</div>
                  <div><span className="font-bold">Communication:</span> Send order updates, promotional emails (with consent), customer service responses, and important notices</div>
                  <div><span className="font-bold">Security and Fraud Prevention:</span> Prevent fraudulent activity, abuse, spam, and unauthorized access</div>
                  <div><span className="font-bold">Legal Compliance:</span> Age verification, regulatory compliance, and responding to legal requests</div>
                  <div><span className="font-bold">Service Improvement:</span> Analyze site performance, user feedback, and technical issues</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  4. Address Information
                </h3>
                <div className="mb-2">We collect shipping and billing addresses for the following specific purposes:</div>
                <div className="mb-4 space-y-1">
                  <div><span className="font-bold">Order Fulfillment:</span> Shipping products to your specified address</div>
                  <div><span className="font-bold">Age Verification:</span> Verifying legal age requirements in your jurisdiction</div>
                  <div><span className="font-bold">Tax Compliance:</span> Calculating appropriate taxes based on location</div>
                  <div><span className="font-bold">Fraud Prevention:</span> Verifying payment information and preventing fraudulent transactions</div>
                  <div><span className="font-bold">Legal Compliance:</span> Meeting tobacco sales regulations and shipping restrictions</div>
                </div>
                <div className="mb-6">
                  <span className="font-bold">Your address information is kept private and secure.</span> We do not display addresses publicly or share them with other users.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">5. Information Sharing and Sale</h3>
                <div className="mb-2">We may share or sell your personal information with:</div>
                <div className="mb-4 space-y-1">
                  <div><span className="font-bold">Service Providers:</span> Payment processors, shipping companies, email services, cloud storage providers</div>
                  <div><span className="font-bold">Analytics and Advertising Partners:</span> For website analytics, targeted advertising, and marketing optimization</div>
                  <div><span className="font-bold">Business Partners:</span> For joint marketing campaigns and promotional activities (with your consent)</div>
                  <div><span className="font-bold">Legal Authorities:</span> When required by law, court order, or to protect our rights and safety</div>
                  <div><span className="font-bold">Business Transfers:</span> In connection with mergers, acquisitions, or sale of business assets</div>
                </div>
                <div className="bg-blue-900 border border-blue-600 rounded p-4 mb-6">
                  <div className="font-semibold text-blue-300 mb-2">Your Control Over Data Sharing:</div>
                  <div className="text-sm text-blue-200">
                    California residents and users in certain jurisdictions can opt out of the sale or sharing of personal information using the "Do Not Sell or Share My Personal Information" link available on our website. You can also manage your data sharing preferences in your account settings.
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">6. Your Rights and Choices</h3>
                <div className="mb-6 space-y-1">
                  <div><span className="font-bold">Access and Portability:</span> Request access to your personal data and receive a copy in a structured format</div>
                  <div><span className="font-bold">Correction:</span> Request correction of inaccurate or incomplete personal information</div>
                  <div><span className="font-bold">Deletion:</span> Request deletion of your personal information, subject to legal or contractual obligations</div>
                  <div><span className="font-bold">Opt-Out of Sale/Sharing:</span> Opt out of the sale or sharing of personal information (available to all users)</div>
                  <div><span className="font-bold">Cookie Management:</span> Control cookie preferences through your browser settings or our cookie banner</div>
                  <div><span className="font-bold">Marketing Communications:</span> Unsubscribe from promotional emails at any time</div>
                  <div><span className="font-bold">Account Deactivation:</span> Close your account and request data deletion</div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">7. Data Security</h3>
                <div className="mb-6">
                  We implement industry-standard technical and organizational security measures to protect your data from unauthorized access, loss, misuse, or alteration. These include encryption, secure servers, access controls, and regular security audits. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">8. Data Retention</h3>
                <div className="mb-6">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce agreements. Account information is typically retained for the duration of your account plus a reasonable period thereafter. Payment and transaction data may be retained longer for legal and accounting purposes.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">9. International Data Transfers</h3>
                <div className="mb-6">
                  Your data may be transferred to and processed in the United States and other countries that may have different data protection laws than your country of residence. We implement appropriate safeguards to protect your data during international transfers, including standard contractual clauses and adequacy decisions where applicable.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">10. Children's Privacy</h3>
                <div className="mb-6">
                  Our services are not intended for individuals under the age of 18 (or the legal tobacco age in your jurisdiction). We do not knowingly collect personal information from minors. If we become aware that we have collected personal data from someone under the applicable age limit, we will delete it promptly and may terminate the associated account.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">11. Changes to This Privacy Policy</h3>
                <div className="mb-6">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. When we make material changes, we will notify you by updating the date above and, where appropriate, provide additional notice through email or prominent site notifications. Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">12. State-Specific Privacy Rights</h3>
                <div className="mb-4">
                  <div className="font-semibold text-blue-300 mb-2">California Residents (CCPA/CPRA):</div>
                  <div className="mb-4 space-y-1 text-sm">
                    <div>• Right to know what personal information is collected, used, shared, or sold</div>
                    <div>• Right to delete personal information</div>
                    <div>• Right to opt out of the sale or sharing of personal information</div>
                    <div>• Right to non-discrimination for exercising privacy rights</div>
                    <div>• Right to correct inaccurate personal information</div>
                    <div>• Right to limit use of sensitive personal information</div>
                  </div>
                  <div className="font-semibold text-blue-300 mb-2">Other States:</div>
                  <div className="mb-6 text-sm">
                    Residents of Virginia, Colorado, Connecticut, and other states with privacy laws may have additional rights. Please contact us to learn about rights available in your jurisdiction.
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-blue-400 mb-3">13. Contact Information</h3>
                <div className="mb-2">
                  For privacy questions, to exercise your rights, or to submit privacy-related requests, please contact us at:
                </div>
                <div className="font-semibold text-blue-400">BadCigarette</div>
                <div>Email: badcigarette1@gmail.com</div>
                <div className="text-sm text-gray-400 mt-2">
                  Please allow up to 30 days for us to respond to your request. We may need to verify your identity before processing certain requests.
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