"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/menu-data";

interface OrderModalProps {
  items: Array<{ item: MenuItem; customizations: { removed: string[]; added: string[] } }>;
  totalPrice: number;
  onClose: () => void;
}

export default function OrderModal({ items, totalPrice, onClose }: OrderModalProps) {
  const [orderType, setOrderType] = useState<"table" | "delivery" | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNumber, setDeliveryNumber] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (orderType === "table" && !tableNumber) return;
    if (orderType === "delivery" && (!deliveryAddress || !deliveryNumber || !deliveryPhone)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderType,
          tableNumber: orderType === "table" ? parseInt(tableNumber) : null,
          deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
          deliveryNumber: orderType === "delivery" ? deliveryNumber : null,
          deliveryPhone: orderType === "delivery" ? deliveryPhone : null,
          deliveryTime: orderType === "delivery" ? deliveryTime : null,
          items: items.map(({ item, customizations }) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            customizations,
          })),
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore durante la creazione dell'ordine");
      }

      alert(data.message);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Conferma Ordine</h2>

        {/* Order Summary */}
        <div className="mb-6 space-y-2">
          {items.map((selected, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{selected.item.name}</span>
              <span className="text-gray-900 dark:text-white font-medium">
                €{selected.item.price.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2 flex justify-between font-bold">
            <span className="text-gray-900 dark:text-white">Totale:</span>
            <span className="text-gray-900 dark:text-white">€{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Type Selection */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Tipo di ordine:</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setOrderType("table")}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                orderType === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Sono al tavolo
            </button>
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                orderType === "delivery"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Da asporto
            </button>
          </div>
        </div>

        {/* Table Form */}
        {orderType === "table" && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Numero tavolo:
            </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Inserisci il numero del tavolo"
              min="1"
            />
          </div>
        )}

        {/* Delivery Form */}
        {orderType === "delivery" && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Via di consegna:
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Inserisci la via"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Numero civico:
              </label>
              <input
                type="text"
                value={deliveryNumber}
                onChange={(e) => setDeliveryNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Inserisci il numero civico"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Numero di cellulare:
              </label>
              <input
                type="tel"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Inserisci il numero di cellulare"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Orario di consegna previsto:
              </label>
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="30">30 minuti</option>
                <option value="45">45 minuti</option>
                <option value="60">1 ora</option>
                <option value="90">1 ora e 30 minuti</option>
                <option value="120">2 ore</option>
              </select>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (orderType === "table" && !tableNumber) ||
              (orderType === "delivery" && (!deliveryAddress || !deliveryNumber || !deliveryPhone))
            }
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isSubmitting ? "Invio..." : "Conferma"}
          </button>
        </div>
      </div>
    </div>
  );
}

