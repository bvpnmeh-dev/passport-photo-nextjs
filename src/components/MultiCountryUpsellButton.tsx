"use client";

import React from "react";
import { Plus, Globe, CheckCircle } from "lucide-react";
import { constants } from "../constants";
import { formatPrice } from "../utils/formatPrice";

interface MultiCountryUpsellButtonProps {
  onUpgrade: () => void;
  isUpgraded: boolean;
  upgradePrice: string;
}

export default function MultiCountryUpsellButton({
  onUpgrade,
  isUpgraded,
  upgradePrice,
}: MultiCountryUpsellButtonProps) {
  const countryCount = process.env.NEXT_PUBLIC_COUNTRY_COUNT || "200+";
  const approvalRate = process.env.NEXT_PUBLIC_APPROVAL_RATE || "98%";
  const regularPriceCents =
    Number(process.env.NEXT_PUBLIC_REGULAR_PRICE_IN_CENT) || 2120;
  const regularPrice = formatPrice(regularPriceCents, "gbp");

  // Calculate actual savings
  const standardPrice =
    constants.productPackages.find((pkg) => pkg.id === "standard")
      ?.priceCents || 888;
  const premiumPrice =
    constants.productPackages.find((pkg) => pkg.id === "premium")?.priceCents ||
    1099;
  const savingsAmount = formatPrice(regularPriceCents - premiumPrice, "gbp");

  if (isUpgraded) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-800">
              Multi-Country Package Added! 🌍
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Your photos will work for {countryCount} countries worldwide
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-4">
              <Globe className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              LIMITED TIME OFFER
            </span>
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              SAVE {savingsAmount}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
            🌍 Upgrade to Multi-Country Package
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            Need photos for multiple countries? Get compliant photos for{" "}
            <strong>{countryCount} countries</strong> including USA, Canada,
            China, India, Schengen, and more!
          </p>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>All UK documents PLUS international</span>
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Government compliant for {countryCount} countries</span>
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Perfect for dual citizenship, travel, or work visas</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500">
            Regular price: {regularPrice} |{" "}
            <strong className="text-green-700">
              Your price: Only {upgradePrice} more!
            </strong>
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onUpgrade}
            className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            <div className="text-left">
              <div className="text-sm font-normal opacity-90">Add for only</div>
              <div className="text-2xl font-extrabold">{upgradePrice}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-4 pt-4 border-t border-amber-300 flex items-center justify-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-600" />
          {approvalRate} Approval Rate
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Instant Delivery
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Money-Back Guarantee
        </span>
      </div>
    </div>
  );
}
