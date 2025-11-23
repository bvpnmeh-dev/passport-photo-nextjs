"use client";
import React from "react";
import { constants } from "@/constants";
import { formatPrice } from "@/utils/formatPrice";

export default function Page() {
  const standardPackage = constants.productPackages.find(
    (pkg) => pkg.id === "standard",
  );
  const premiumPackage = constants.productPackages.find(
    (pkg) => pkg.id === "premium",
  );

  const standardPrice = standardPackage
    ? formatPrice(standardPackage.priceCents, standardPackage.currency)
    : "£8.88";
  const premiumPrice = premiumPackage
    ? formatPrice(premiumPackage.priceCents, premiumPackage.currency)
    : "£15.20";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Section 1: Navigation Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Get digital photo code</div>
          <nav className="space-x-6 text-sm">
            <a className="hover:underline">Services</a>
            <a className="hover:underline">Pricing</a>
            <a className="hover:underline">Locations</a>
            <a className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* Section 2: Hero with Trust Metrics */}
      <section className="mx-auto max-w-6xl px-6 py-12 text-center">
        <div className="flex justify-center gap-10 text-sm text-gray-600 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold">4.4/5</div>
            <div>rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">2,800+</div>
            <div>customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">98%</div>
            <div>approved</div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold">
          UK HMPO Compliant Passport Photos
        </h1>
      </section>

      {/* Section 3: Four-Step Process Flow */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center justify-center gap-8 w-full">
              {[
                "Upload a photo",
                "Photo approved compliant",
                "Download + digital code",
                "Done",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {i + 1}
                  </div>
                  <div className="text-sm font-medium">{step}</div>
                  {i < 3 && <div className="text-xl text-gray-400">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Pricing Cards */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border rounded-lg bg-white p-6">
            <div className="text-sm text-gray-500">
              {standardPrice} all UK docs
            </div>
            <h3 className="text-xl font-bold mt-2">UK Digital ID Code</h3>
            <p className="text-sm text-gray-600 mt-2">
              Complete digital solution for all UK documents
            </p>
            <ul className="mt-4 space-y-1 text-sm">
              <li>☑ Passport</li>
              <li>☑ Driving Licence</li>
              <li>☑ Oyster Card</li>
              <li>☑ Travel Cards</li>
              <li>☑ Blue Badge</li>
              <li>☑ Student ID</li>
            </ul>
            <div className="mt-6">
              <div className="text-xs text-gray-500">HMPO/DVLA compliant</div>
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded">
                Choose UK Digital ID
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border rounded-lg bg-white p-6 relative">
            <div className="absolute -top-3 right-3 bg-yellow-300 px-3 py-1 text-xs font-semibold rounded">
              Most Popular
            </div>
            <div className="text-sm text-gray-500">
              {standardPrice} single country
            </div>
            <h3 className="text-xl font-bold mt-2">Single Country</h3>
            <ul className="mt-4 space-y-1 text-sm">
              <li>200+ countries</li>
              <li>Government compliant</li>
              <li>Digital delivery</li>
            </ul>
            <div className="mt-6">
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded">
                Select Country
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border rounded-lg bg-white p-6">
            <div className="text-sm text-gray-500">
              {premiumPrice} 2 countries
            </div>
            <h3 className="text-xl font-bold mt-2">Multi-Country</h3>
            <ul className="mt-4 space-y-1 text-sm">
              <li>2 different countries</li>
              <li>HMPO + International</li>
              <li>98% approved</li>
            </ul>
            <div className="mt-6">
              <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded">
                Choose Multi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Official Links */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-lg font-semibold mb-4">Official Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <a
              href="https://www.gov.uk/passport-photo"
              className="p-4 border rounded hover:bg-gray-50 flex items-center justify-between"
            >
              HMPO Passport Photos <span className="text-gray-400">→</span>
            </a>
            <div className="p-4 border rounded">
              <DVLALinks />
            </div>
            <a
              href="https://www.gov.uk/apply-blue-badge"
              className="p-4 border rounded hover:bg-gray-50 flex items-center justify-between"
            >
              BADGE Blue Badge <span className="text-gray-400">→</span>
            </a>
            <a
              href="https://passportonline.dfa.ie/Apply/Passport"
              className="p-4 border rounded hover:bg-gray-50 flex items-center justify-between"
            >
              IRE Irish Passport <span className="text-gray-400">→</span>
            </a>
            <a
              href="https://tfl.gov.uk/fares/free-and-discounted-travel/18-plus-student-oyster-photocard#on-this-page-5"
              className="p-4 border rounded hover:bg-gray-50 flex items-center justify-between"
            >
              Oyster / Railcard / Zip Card{" "}
              <span className="text-gray-400">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Section 6: Trust Metrics Row */}
      <section className="mx-auto max-w-6xl px-6 py-8 text-center">
        <div className="flex justify-center gap-10 text-sm text-gray-700">
          <div>98% Approved</div>
          <div>Same Day Ready</div>
          <div>Gov Compliant</div>
        </div>
      </section>

      {/* Section 7: Location & Contact */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Location</h3>
            <div className="mt-2 text-sm">
              Email: wallington.cameras@yahoo.com
            </div>
            <div className="mt-1 text-sm">Hours: Check for availability</div>
            <div className="mt-1 text-sm">
              Accessibility: Wheelchair accessible
            </div>
            <div className="mt-2 text-sm text-blue-600 underline">
              Open in Google Maps
            </div>
          </div>
          <div className="flex flex-col items-start">
            <a className="text-blue-600 underline">www.photocode.online →</a>
            <div className="mt-4 border rounded p-6 flex items-center gap-4">
              <div className="text-2xl">ㅁㅁ</div>
              <div className="text-sm">
                QR Code
                <br />
                <span className="text-xs text-gray-500">
                  Scan for website access
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: CTA */}
      <section className="mx-auto max-w-6xl px-6 py-12 text-center bg-blue-50">
        <h2 className="text-2xl font-bold">Ready to Get Your Photos?</h2>
        <p className="mt-3 text-gray-700">
          Don't wait in long lines at the post office. Get professional passport
          photos in minutes.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Photos Online
          </button>
          <button className="border px-4 py-2 rounded">Find a Location</button>
        </div>
        <div className="mt-4 text-sm">
          Questions? Call us at wallington.cameras@yahoo.com
        </div>
      </section>

      {/* Section 9: About/Privacy */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h3 className="text-xl font-semibold">Get Digital Photo Code</h3>
        <p className="mt-3 text-sm text-gray-700">
          We specialize in secure digital photo processing with complete privacy
          protection. Your photos are processed instantly and securely deleted
          from our servers after delivery. We never store, share, or use your
          personal photos for any purpose beyond creating your official document
          images.
        </p>
      </section>

      {/* Section 10: Footer */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold">★★★★ 4.4/5 from 2,800+ reviews</div>
          </div>
          <div>
            <div className="font-semibold">Privacy & Security</div>
            <ul className="mt-2 text-sm">
              <li>✓ Secure Photo Processing</li>
              <li>✓ Auto-Delete After Delivery</li>
              <li>☑ No Photo Storage Policy</li>
              <li>GDPR Compliant</li>
              <li>✔ Privacy Protection</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Contact</div>
            <div className="mt-2 text-sm">wallington.cameras@yahoo.com</div>
            <div className="text-sm">www.photocode.online</div>
            <div className="text-sm">Digital Service Available 24/7</div>
          </div>
        </div>
        <div className="border-t bg-gray-50 py-3">
          <div className="mx-auto max-w-6xl px-6 text-sm flex flex-col md:flex-row justify-between">
            <div>©2024 Get digital photo code. All rights reserved.</div>
            <div className="space-x-4">
              <a className="text-blue-600">Privacy Policy</a>
              <a className="text-blue-600">Terms of Service</a>
              <a className="text-blue-600">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function DVLALinks() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-medium">DVLA Licence Photos</div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="text-sm text-blue-600"
        >
          {open ? "Hide" : "Open"}
        </button>
      </div>
      {open && (
        <div className="mt-3 text-sm space-y-2">
          <a
            href="https://www.gov.uk/replace-a-driving-licence"
            className="block text-blue-600 underline"
          >
            Lost or stolen
          </a>
          <a
            href="https://www.gov.uk/renew-driving-licence"
            className="block text-blue-600 underline"
          >
            Renewal
          </a>
          <a
            href="https://www.gov.uk/apply-first-provisional-driving-licence"
            className="block text-blue-600 underline"
          >
            Provisional (apply first)
          </a>
        </div>
      )}
    </div>
  );
}
