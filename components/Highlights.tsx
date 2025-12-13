"use client";

export default function Highlights() {
  const highlights = [
    { id: 1, label: "Ingredienti", icon: "🥘" },
    { id: 2, label: "Allergeni", icon: "⚠️" },
    { id: 3, label: "Vegan/Gluten Free", icon: "🌱" },
    { id: 4, label: "Best Seller", icon: "⭐" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl md:text-3xl">{highlight.icon}</span>
            </div>
            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 text-center font-medium">
              {highlight.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

