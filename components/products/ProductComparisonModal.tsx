import { FC, useState } from 'react';
import { X, Check, Minus } from 'lucide-react';

interface ComparisonProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  specs: Record<string, string | boolean | number>;
}

interface ProductComparisonModalProps {
  products: ComparisonProduct[];
  onClose: () => void;
}

const ProductComparisonModal: FC<ProductComparisonModalProps> = ({
  products,
  onClose,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    products.map((p) => p.id)
  );

  if (!products.length) return null;

  const allSpecs = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs)))
  );

  const visibleProducts = products.filter((p) => selectedProducts.includes(p.id));

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 overflow-auto">
      <div className="bg-white w-full">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 sticky left-0 bg-gray-50">
                  Specification
                </th>
                {products.map((product) => (
                  <th
                    key={product.id}
                    className="text-center py-4 px-4 font-semibold text-gray-900 min-w-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        {/* Small product image */}
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
                          🌾
                        </div>
                      </div>
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating)
                                ? '⭐'
                                : '☆'
                            }`}
                          >
                            {i < Math.floor(product.rating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => toggleProduct(product.id)}
                        className={`w-full py-1 px-2 rounded text-sm font-semibold transition ${
                          selectedProducts.includes(product.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {selectedProducts.includes(product.id)
                          ? '✓ Selected'
                          : 'Deselect'}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSpecs.map((spec, idx) => (
                <tr
                  key={spec}
                  className={`border-b ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="py-4 px-4 font-medium text-gray-900 sticky left-0 bg-inherit">
                    {spec}
                  </td>
                  {products.map((product) => (
                    <td
                      key={`${product.id}-${spec}`}
                      className="text-center py-4 px-4"
                    >
                      {typeof product.specs[spec] === 'boolean' ? (
                        product.specs[spec] ? (
                          <Check className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <Minus className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">
                          {product.specs[spec]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonModal;
