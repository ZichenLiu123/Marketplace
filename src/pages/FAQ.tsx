
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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
            <h1 className="text-3xl font-bold text-toronto-dark">Frequently Asked Questions</h1>
          </div>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">General Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-medium">
                      What is UofT Market?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      UofT Market is an exclusive marketplace for University of Toronto students, faculty, and staff to buy and sell items within the university community. Our platform facilitates safe, local transactions between verified UofT members.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-medium">
                      Who can use UofT Market?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      UofT Market is exclusively for current University of Toronto students, faculty, and staff. You must have a valid UofT email address to register and use our platform.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left font-medium">
                      Is UofT Market free to use?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Yes, UofT Market is completely free to use. There are no fees for listing items, making purchases, or communicating with other users.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Account & Registration</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left font-medium">
                      How do I create an account?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Click on the "Sign In" button in the top-right corner of the page, then select "Create Account." You'll need to provide your UofT email address and create a password. We'll send a verification email to confirm your account.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left font-medium">
                      I didn't receive my verification email. What should I do?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      First, check your spam or junk folder. If you still don't see the email, you can request a new verification email from the login page by clicking "Resend verification email." If problems persist, please contact our support team.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left font-medium">
                      How do I reset my password?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      On the login page, click "Forgot Password?" and enter your UofT email address. We'll send you instructions on how to reset your password. For security reasons, password reset links expire after 24 hours.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Buying & Selling</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-left font-medium">
                      How do I list an item for sale?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      After signing in, click on "Sell" in the navigation menu. Fill out the listing form with details about your item, including title, description, price, category, and photos. Review your listing information before submitting it.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-8">
                    <AccordionTrigger className="text-left font-medium">
                      What items are not allowed on UofT Market?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Prohibited items include: illegal goods or services, counterfeit or fraudulent products, dangerous materials, weapons, alcohol, tobacco, drugs, stolen property, and items that infringe on intellectual property rights. Please review our Terms of Service for a complete list.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-9">
                    <AccordionTrigger className="text-left font-medium">
                      How do transactions work?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      UofT Market facilitates connections between buyers and sellers, but we don't process payments directly. Buyers and sellers communicate through our messaging system to arrange payment methods and meeting locations for the exchange. We recommend meeting in public places on campus for safety.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-10">
                    <AccordionTrigger className="text-left font-medium">
                      How do I contact a seller?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      On the product listing page, click the "Contact Seller" button to start a conversation. All communications are handled through our built-in messaging system for security and privacy.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <section className="pb-4">
                <h2 className="text-xl font-semibold mb-4">Safety & Security</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-11">
                    <AccordionTrigger className="text-left font-medium">
                      How does UofT Market ensure safety?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      We verify all users through their UofT email addresses, creating a trusted community. We also provide built-in messaging so you don't need to share personal contact information. Additionally, we recommend meeting in public spaces on campus for exchanges.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-12">
                    <AccordionTrigger className="text-left font-medium">
                      What should I do if I encounter a suspicious user or listing?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Please report any suspicious activity by clicking the "Report" button on listings or user profiles. Our team will investigate promptly. Never proceed with a transaction if you feel uncomfortable or suspect fraud.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-13">
                    <AccordionTrigger className="text-left font-medium">
                      Does UofT Market offer any buyer or seller protection?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      While we don't offer financial protection or guarantee transactions, we create a safer environment by limiting membership to verified UofT community members. We recommend thoroughly inspecting items before purchase and using secure payment methods.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <div className="text-center mt-8 pb-4">
                <p className="text-gray-700">
                  Can't find an answer to your question? Contact us at <a href="mailto:support@uoftmarket.com" className="text-toronto-blue hover:underline">support@uoftmarket.com</a>
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
