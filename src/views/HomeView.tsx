"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import NavItem from "../lib/nav-item";

function HomeView() {
  const router = useRouter();
  const [dvlaOpen, setDvlaOpen] = React.useState(false);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Section 1: Navigation Header */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/passport-logo.svg"
              alt="Get Digital Photo Code Logo"
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold text-gray-900">
              Get digital photo code
            </span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a
              href="#services"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#location"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Locations
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
          <a href="/make-photo">
            <button className="hidden md:block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
              Make Photo Online
            </button>
          </a>
        </div>
      </header>

      {/* Section 2: Hero Section with Trust Metrics */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Trust Metrics Row */}
          <div className="flex justify-center items-center gap-8 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★★★★★</span>
              <span>4.4/5 • 2,800+ customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">✓</span>
              <span>98% approved</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">
            UK HMPO Compliant Passport Photos
          </h1>

          {/* Four-Step Process Flow */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 max-w-6xl mx-auto">
            {[
              { num: 1, text: "1. Upload a photo" },
              { num: 2, text: "2. Photo approved\ncompliant" },
              { num: 3, text: "3. Download +\ndigital code" },
              { num: 4, text: "4. Done" },
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div className="text-sm font-medium whitespace-pre-line">
                    {step.text}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Cards Row: UK Digital ID + Official Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* UK Digital ID Card */}
            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <div className="text-4xl font-bold mb-1">
                £8.88
                <span className="text-base font-normal text-gray-600 ml-2">
                  all UK docs
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-3 mb-4">
                UK Digital ID Code
              </h3>

              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-bold text-base">✓</span>
                  <span>Passport • Driving Licence</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-bold text-base">✓</span>
                  <span>Oyster Card • Travel Cards</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-bold text-base">✓</span>
                  <span>Blue Badge • Student ID</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-bold text-base">✓</span>
                  <span>HMPO/DVLA compliant</span>
                </li>
              </ul>

              <button
                onClick={() => router.push("/make-photo?type=uk")}
                className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold hover:bg-green-700 transition-colors mb-2"
              >
                Choose UK Digital ID
              </button>
              <p className="text-xs text-gray-500 text-center">
                Complete digital solution for all UK documents
              </p>
            </div>

            {/* Official Links Card */}
            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">UK Government Resources</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  Official Links
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="https://www.gov.uk/apply-renew-passport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      HMPO
                    </span>
                    <span className="text-sm font-medium">Passport Photos</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">
                    →
                  </span>
                </a>

                <a
                  href="https://www.gov.uk/apply-renew-passport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      DVLA
                    </span>
                    <span className="text-sm font-medium">Licence Photos</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">
                    →
                  </span>
                </a>

                <a
                  href="https://www.gov.uk/apply-blue-badge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      BADGE
                    </span>
                    <span className="text-sm font-medium">Blue Badge</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">
                    →
                  </span>
                </a>

                <a
                  href="https://www.dfa.ie/passports/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                      IRE
                    </span>
                    <span className="text-sm font-medium">Irish Passport</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">
                    →
                  </span>
                </a>

                <a
                  href="https://www.gov.uk/government/organisations/hm-passport-office"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      GOV
                    </span>
                    <span className="text-sm font-medium">HMPO Main</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-600">
                    →
                  </span>
                </a>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Verify requirements directly from government sources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Pricing Cards - International & Multi-Country */}
      <section id="pricing" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Top Trust Bar */}
          <div className="bg-blue-600 text-white rounded-lg py-3.5 mb-12 flex justify-center items-center gap-10 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛</span>
              <span>98% Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Same Day Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <span>Gov Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1: International (Most Popular) */}
            <div className="border-2 border-blue-500 rounded-2xl bg-white p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-bold">
                Most Popular
              </div>

              <div className="text-4xl font-bold text-gray-900 mb-1">
                £8.88
                <span className="text-base font-normal text-gray-600 ml-2">
                  any country
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-6">
                International
              </h3>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">200+ countries</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">Government compliant</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">Digital delivery</span>
                </li>
              </ul>

              <button
                onClick={() => router.push("/make-photo?type=international")}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🌐</span>
                Select Country
              </button>
            </div>

            {/* Card 2: Multi-Country */}
            <div className="border-2 border-blue-500 rounded-2xl bg-white p-8 shadow-sm">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                £15.20
                <span className="text-base font-normal text-gray-600 ml-2">
                  2 countries
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-6">
                Multi-Country
              </h3>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">2 different countries</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">HMPO + International</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">98% approved</span>
                </li>
              </ul>

              <button
                onClick={() => router.push("/make-photo?type=multi")}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🌐</span>
                Choose Multi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Location & Contact */}
      <section id="location" className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Location
          </h2>

          <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">📧</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Email</div>
                <a
                  href="mailto:wallington.cameras@yahoo.com"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  wallington.cameras@yahoo.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">🕐</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Hours</div>
                <div className="text-gray-700">
                  Check for availability • Wheelchair accessible
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">📍</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Directions</div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">🌐</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Website</div>
                <a
                  href="https://www.photocode.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.photocode.online →
                </a>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">▣</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-3">QR Code</div>
                <div className="inline-block border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://www.photocode.online"
                    alt="QR Code for www.photocode.online"
                    width="160"
                    height="160"
                    className="rounded"
                  />
                  <div className="text-center text-xs text-gray-600 mt-2">
                    Scan for website access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Photos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Don't wait in long lines at the post office. Get professional
            passport photos in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/make-photo">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Create Photos Online
              </button>
            </a>
            <a href="#location">
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                Find a Location
              </button>
            </a>
          </div>

          <div className="text-blue-100">
            Questions? Call us at{" "}
            <a
              href="mailto:wallington.cameras@yahoo.com"
              className="font-semibold hover:underline"
            >
              wallington.cameras@yahoo.com
            </a>
          </div>
        </div>
      </section>

      {/* Section 9: About/Privacy Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2.5 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Get Digital Photo Code</h3>
          </div>
          <p className="text-gray-300 leading-relaxed mb-8">
            We specialize in secure digital photo processing with complete
            privacy protection. Your photos are processed instantly and securely
            deleted from our servers after delivery. We never store, share, or
            use your personal photos for any purpose beyond creating your
            official document images.
          </p>
          <div className="flex items-center gap-2 text-yellow-400">
            <span className="text-2xl">★★★★★</span>
            <span className="text-white ml-2">4.4/5 from 2,800+ reviews</span>
          </div>
        </div>
      </section>

      {/* Section 10: Footer */}
      <footer
        id="contact"
        className="bg-gray-900 border-t border-gray-800 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            {/* Left: Privacy & Security */}
            <div>
              <h4 className="font-bold text-lg mb-4">Privacy & Security</h4>
              <ul className="space-y-2.5 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-base">🔒</span>
                  Secure Photo Processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-base">📦</span>
                  Auto-Delete After Delivery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-base">🚫</span>
                  No Photo Storage Policy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-base">✓</span>
                  GDPR Compliant
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-base">🛡</span>
                  Privacy Protection
                </li>
              </ul>
            </div>

            {/* Right: Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <div className="space-y-2.5 text-sm text-gray-300">
                <a
                  href="mailto:wallington.cameras@yahoo.com"
                  className="block hover:text-white transition-colors"
                >
                  wallington.cameras@yahoo.com
                </a>
                <a
                  href="https://www.photocode.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors"
                >
                  www.photocode.online
                </a>
                <div className="text-gray-400 pt-2">
                  Digital Service Available 24/7
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>© 2024 Get digital photo code. All rights reserved.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Refund Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomeView;
