import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { ShieldCheck, Truck, Users, Award } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Years Experience", value: "15+" },
    { label: "Products in Catalog", value: "2,000+" },
    { label: "Happy Customers", value: "50k+" },
    { label: "Partner Branches", value: "24" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Building the Future Together</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            BuildMart is East Africa's leading building materials marketplace, 
            connecting contractors, homeowners, and developers with premium supplies since 2009.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To simplify construction by providing a transparent, reliable, and efficient 
              platform for sourcing high-quality building materials. We believe that every 
              builder deserves access to the best supplies at fair prices.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're building your first home or a multi-story commercial complex, 
              we are committed to being your most trusted construction partner.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-orange-50 rounded-2xl">
              <ShieldCheck className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">We only partner with certified manufacturers.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl">
              <Truck className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Next-day delivery for most regional locations.</p>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl">
              <Users className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">Professional support for all technical queries.</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl">
              <Award className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Competitive rates with volume discounts.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
