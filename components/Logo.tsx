"use client";

export default function Logo({ className = "w-full h-full" }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Italian flag bars */}
        <rect x="20" y="20" width="40" height="60" fill="#009246" />
        <rect x="60" y="20" width="40" height="60" fill="#FFFFFF" />
        <rect x="100" y="20" width="40" height="60" fill="#CE2B37" />
        
        {/* LE GRAZIE text */}
        <text
          x="100"
          y="130"
          fontSize="32"
          fontWeight="bold"
          fill="#CE2B37"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          letterSpacing="2"
        >
          LE GRAZIE
        </text>
      </svg>
    </div>
  );
}

