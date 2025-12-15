"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/menu-data";

interface OrderData {
  orderId: number;
  orderType: "table" | "delivery" | null;
  tableNumber: number | null;
  deliveryAddress: string | null;
  deliveryNumber: string | null;
  deliveryPhone: string | null;
  deliveryTime: string | null;
  items: Array<{ item: MenuItem; customizations: { removed: string[]; added: string[] } }>;
  totalPrice: number;
}

function formatWhatsAppMessage(orderData: OrderData): string {
  const { orderId, orderType, tableNumber, deliveryAddress, deliveryNumber, deliveryPhone, deliveryTime, items, totalPrice } = orderData;

  let message = `🍽️ *NUOVO ORDINE - RISTORANTE LE GRAZIE*\n\n`;
  message += `📋 *Ordine #${orderId}*\n\n`;

  if (orderType === "table" && tableNumber !== null) {
    message += `📍 *Tipo:* Al tavolo\n`;
    message += `🪑 *Tavolo:* ${tableNumber}\n\n`;
  } else if (orderType === "delivery") {
    message += `📍 *Tipo:* Da asporto\n`;
    if (deliveryAddress && deliveryNumber) {
      message += `🏠 *Indirizzo:* ${deliveryAddress}, ${deliveryNumber}\n`;
    }
    if (deliveryPhone) {
      message += `📱 *Telefono:* ${deliveryPhone}\n`;
    }
    if (deliveryTime) {
      message += `⏰ *Consegna prevista:* ${deliveryTime} minuti\n`;
    }
    message += `\n`;
  }

  message += `📦 *Dettagli ordine:*\n`;
  items.forEach(({ item, customizations }) => {
    message += `\n• ${item.name} - €${item.price.toFixed(2)}`;
    
    if (customizations.removed.length > 0) {
      message += `\n  ❌ Senza: ${customizations.removed.join(", ")}`;
    }
    
    if (customizations.added.length > 0) {
      message += `\n  ➕ Aggiunte: ${customizations.added.join(", ")}`;
    }
  });

  message += `\n\n💰 *Totale: €${totalPrice.toFixed(2)}*\n`;
  message += `\n⏱️ *Orario ordine:* ${new Date().toLocaleString("it-IT")}`;

  return message;
}

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
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (orderType === "table" && !tableNumber) return;
    if (orderType === "delivery" && (!deliveryAddress || !deliveryNumber || !deliveryPhone)) return;

    setIsSubmitting(true);
    setError(null);

    // Genera un ID ordine temporaneo (timestamp) se il database non è disponibile
    const tempOrderId = Date.now();
    let orderId = tempOrderId;
    let databaseSuccess = false;

    try {
      // Prova a salvare nel database
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

      if (response.ok && data.orderId) {
        orderId = data.orderId;
        databaseSuccess = true;
      }
    } catch (err) {
      // Ignora errori del database, invieremo comunque via WhatsApp
      console.error("Database error (non critico):", err);
    }

    // Formatta il messaggio WhatsApp (non inviare ancora)
    const message = formatWhatsAppMessage({
      orderId,
      orderType,
      tableNumber: orderType === "table" ? parseInt(tableNumber) : null,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
      deliveryNumber: orderType === "delivery" ? deliveryNumber : null,
      deliveryPhone: orderType === "delivery" ? deliveryPhone : null,
      deliveryTime: orderType === "delivery" ? deliveryTime : null,
      items,
      totalPrice,
    });

    // Salva il messaggio e mostra il pulsante WhatsApp
    setWhatsappMessage(message);
    setOrderConfirmed(true);
    setIsSubmitting(false);
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

        {/* Order Confirmed Message */}
        {orderConfirmed && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
            <p className="font-medium mb-2">
              {orderType === "table"
                ? `Ordine confermato per il tavolo ${tableNumber}!`
                : `Ordine confermato! Consegna prevista tra ${deliveryTime} minuti.`}
            </p>
            <p className="text-sm font-semibold mb-1">Clicca sul pulsante WhatsApp qui sotto per inviare l&apos;ordine al ristorante.</p>
            <p className="text-xs opacity-80">Numero: +39 347 840 6079</p>
          </div>
        )}

        {/* Actions */}
        {!orderConfirmed ? (
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
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                if (whatsappMessage) {
                  const whatsappNumber = "393478406079"; // +39 347 840 6079 senza spazi e prefisso +
                  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, "_blank");
                }
              }}
              className="w-full px-6 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Invia Ordine via WhatsApp
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Chiudi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

