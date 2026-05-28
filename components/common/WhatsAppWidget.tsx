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

    </>
  );
};

export default WhatsAppWidget;
