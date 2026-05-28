'use client';

import { FC } from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppWidget: FC<WhatsAppWidgetProps> = ({
  phoneNumber = '919876543210',
  message = 'Hello, I need help with agricultural products!',
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 z-40 animate-pulse"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={28} />
      </button>

      {/* WhatsApp Banner (optional) */}
      <div className="hidden lg:block fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-40">
        <div className="flex items-start gap-3">
          <MessageCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Chat with us!</h4>
            <p className="text-gray-600 text-xs mt-1">
              Our experts are online. Get instant help with your farming queries.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
            >
              Open WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppWidget;
