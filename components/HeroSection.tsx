"use client";

import Image from "next/image";
import Logo from "./Logo";
import { useState } from "react";

export default function HeroSection() {
  const [profileImageError, setProfileImageError] = useState(false);
  const [coverImageError, setCoverImageError] = useState(false);

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-96 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
        {!coverImageError ? (
          <Image
            src="/images/cover-image.png"
            alt="Cover Ristorante Le Grazie"
            fill
            className="object-cover"
            onError={() => setCoverImageError(true)}
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 pb-6">
          {/* Profile Image and Mobile Text Container */}
          <div className="flex flex-row items-center gap-3 md:flex-col md:items-start md:gap-0">
            {/* Profile Image */}
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
              {!profileImageError ? (
                <div className="relative w-full h-full">
                  <Image
                    src="/images/profile-image.png"
                    alt="Le Grazie Logo"
                    fill
                    className="object-contain p-0.5"
                    onError={() => setProfileImageError(true)}
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <Logo className="w-3/4 h-3/4" />
                </div>
              )}
            </div>

          </div>

          {/* Restaurant Info */}
          <div className="flex-1 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 pt-4 md:pt-0">
              Ristorante Le Grazie
            </h1>
            <p className="text-sm md:text-base font-light text-gray-700 dark:text-gray-300">
              Specialità marine, crudi e pizze di qualità
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

