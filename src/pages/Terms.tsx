
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16 mt-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-4" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-toronto-dark">Terms of Service</h1>
          </div>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing or using UofT Market, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are not authorized to use the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Eligibility</h2>
                <p className="text-gray-700">
                  UofT Market is exclusively available to current students, faculty, and staff of the University of Toronto. You must have a valid university email address to register and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Prohibited Items</h2>
                <p className="text-gray-700">
                  The following items are prohibited from being listed or sold on UofT Market:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-700">
                  <li>Illegal items or services</li>
                  <li>Counterfeit or fraudulent products</li>
                  <li>Dangerous or hazardous materials</li>
                  <li>Weapons or explosives</li>
                  <li>Alcohol, tobacco, or drugs</li>
                  <li>Stolen property</li>
                  <li>Items that infringe on intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. User Conduct</h2>
                <p className="text-gray-700">
                  Users are expected to interact respectfully and professionally. Any form of harassment, discrimination, or inappropriate behavior will not be tolerated and may result in account suspension or termination.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Listings and Transactions</h2>
                <p className="text-gray-700">
                  All listings must be accurate and truthful. Sellers are responsible for delivering items as described, and buyers are responsible for completing payment as agreed upon. UofT Market serves as a platform for connecting buyers and sellers but is not directly involved in transactions between users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
                <p className="text-gray-700">
                  All content on UofT Market, including but not limited to text, graphics, logos, and software, is the property of UofT Market or its content suppliers and is protected by Canadian and international copyright laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
                <p className="text-gray-700">
                  UofT Market is not liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or the inability to use, the platform or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
                <p className="text-gray-700">
                  UofT Market reserves the right to modify these Terms of Service at any time. We will provide notice of significant changes through the platform. Your continued use of UofT Market after such modifications constitutes your acceptance of the revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
                <p className="text-gray-700">
                  UofT Market reserves the right to terminate or suspend your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms of Service are governed by the laws of Ontario, Canada, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="pb-4">
                <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at support@uoftmarket.com.
                </p>
              </section>

              <div className="text-center text-gray-500 text-sm mt-8 pb-4">
                Last updated: {new Date().toLocaleDateString('en-CA', {year: 'numeric', month: 'long', day: 'numeric'})}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
