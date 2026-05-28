'use client';

import { FC, useState } from 'react';
import { X, ShoppingCart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface MobileStickyCartProps {
  itemCount: number;
  totalPrice: number;
}

const MobileStickyCart: FC<MobileStickyCartProps> = ({
  itemCount,
  totalPrice,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || itemCount === 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-600 shadow-2xl z-30 animate-in slide-in-from-bottom">
      <div className="flex items-center justify-between p-4 gap-2">
        {/* Cart summary */}
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-green-100 p-2 rounded-lg relative">
            <ShoppingCart size={24} className="text-green-600" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-600">{itemCount} items</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{totalPrice.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <Link
          href="/checkout"
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Checkout <ChevronRight size={16} />
        </Link>

        <button
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress bar showing savings */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-green-600"></div>
    </div>
  );
};

export default MobileStickyCart;
