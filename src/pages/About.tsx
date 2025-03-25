
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Users, Library, Award, Map, PhoneCall } from "lucide-react";

const About = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-toronto-blue text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About UofT Market</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              A marketplace built by students, for students, fostering a sustainable 
              and affordable campus economy.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-8">
                UofT Market was founded with a simple mission: to create a dedicated, safe, and efficient 
                marketplace exclusively for University of Toronto students. We believe in fostering a 
                community where students can buy and sell goods, find housing, exchange textbooks, 
                and offer services without the hassles and risks of general marketplaces.
              </p>
              <p className="text-lg text-gray-700">
                By keeping our platform exclusive to the UofT community, we provide a trusted 
                environment where students can connect with peers who understand their specific 
                needs and circumstances. We're committed to sustainability, affordability, 
                and building a vibrant campus economy.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose UofT Market</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-toronto-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Student Exclusive</h3>
                <p className="text-gray-600">
                  Only verified UofT students can access our platform, creating a safer and more relevant marketplace.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-toronto-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community Focused</h3>
                <p className="text-gray-600">
                  Built with the specific needs of the UofT student community in mind.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Library className="h-6 w-6 text-toronto-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Course-Specific</h3>
                <p className="text-gray-600">
                  Find textbooks and resources organized by UofT courses and programs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-toronto-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Campus Proximity</h3>
                <p className="text-gray-600">
                  Filter listings by campus location for convenient exchanges.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-toronto-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Profiles</h3>
                <p className="text-gray-600">
                  Build trust with verified student profiles and ratings.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <PhoneCall className="h-6 w-6 text-toronto-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Student Support</h3>
                <p className="text-gray-600">
                  Dedicated support team to help with any issues or questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-toronto-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Have questions, suggestions, or want to join our team? We'd love to hear from you!
            </p>
            <a href="mailto:contact@uoftmarket.com" className="inline-block bg-toronto-gold text-toronto-dark font-medium px-6 py-3 rounded-md hover:bg-toronto-gold/90 transition-colors">
              Contact Us
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};

export default About;
