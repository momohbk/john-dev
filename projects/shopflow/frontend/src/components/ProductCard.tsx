import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const price = product.price;

  return (
    <div className="group bg-white rounded-2xl border border-beige overflow-hidden card-hover">
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-beige/30 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gold/40">{product.name[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
            {product.stock} فقط متبقي
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
            نفذ من المخزون
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-rose transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-[10px] text-gray-400 mr-1">(12)</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-beige">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-rose">{price.toLocaleString('fr-DZ')}</span>
            <span className="text-[10px] text-gray-500">د.ج</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-rose text-white px-3.5 py-2 rounded-xl hover:bg-rose-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all text-xs font-medium active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            أضف
          </button>
        </div>
      </div>
    </div>
  );
}
