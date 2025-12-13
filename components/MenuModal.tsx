"use client";

import { useState } from "react";
import { menuData, menuCategories, MenuItem } from "@/lib/menu-data";
import OrderModal from "./OrderModal";

interface MenuModalProps {
  onClose: () => void;
}

export default function MenuModal({ onClose }: MenuModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("antipasti");
  const [selectedItems, setSelectedItems] = useState<Array<{ item: MenuItem; customizations: { removed: string[]; added: string[] } }>>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<{ removed: string[]; added: string[] }>({ removed: [], added: [] });

  const filteredItems = menuData.filter((item) => item.category === selectedCategory);

  const handleItemClick = (item: MenuItem) => {
    setEditingItem(item);
    setCustomizations({ removed: [], added: [] });
  };

  const toggleIngredient = (ingredient: string, type: "removed" | "added") => {
    setCustomizations((prev) => {
      const list = prev[type];
      const newList = list.includes(ingredient)
        ? list.filter((i) => i !== ingredient)
        : [...list, ingredient];
      return { ...prev, [type]: newList };
    });
  };

  const addToCart = () => {
    if (editingItem) {
      setSelectedItems((prev) => [...prev, { item: editingItem, customizations }]);
      setEditingItem(null);
      setCustomizations({ removed: [], added: [] });
    }
  };

  const removeFromCart = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPrice = selectedItems.reduce((sum, { item }) => sum + item.price, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menù</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Category Tabs */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
              <div className="flex overflow-x-auto px-4 py-2 gap-2">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.ingredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          {selectedItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  Totale: €{totalPrice.toFixed(2)}
                </span>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Conferma Ordine ({selectedItems.length})
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedItems.map((selected, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {selected.item.name} - €{selected.item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Rimuovi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Item Customization Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editingItem.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{editingItem.description}</p>

                {/* Remove Ingredients */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Rimuovi ingredienti:</h4>
                  <div className="flex flex-wrap gap-2">
                    {editingItem.ingredients.map((ing) => (
                      <button
                        key={ing}
                        onClick={() => toggleIngredient(ing, "removed")}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          customizations.removed.includes(ing)
                            ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {ing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Ingredients */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Aggiungi ingredienti:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Extra mozzarella", "Extra pomodoro", "Extra basilico", "Peperoncino"].map((ing) => (
                      <button
                        key={ing}
                        onClick={() => toggleIngredient(ing, "added")}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          customizations.added.includes(ing)
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {ing}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setCustomizations({ removed: [], added: [] });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={addToCart}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Aggiungi al carrello
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showOrderModal && (
        <OrderModal
          items={selectedItems}
          totalPrice={totalPrice}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedItems([]);
            onClose();
          }}
        />
      )}
    </>
  );
}

