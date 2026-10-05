import React, { useState } from 'react';
import { 
  Star, 
  Eye, 
  ShoppingBag, 
  Truck, 
  BookOpen, 
  Palette 
} from 'lucide-react';
import { Product, ProductColor } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart
}) => {
  // Smart dynamic color state per product
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'افتراضي', hex: '#10b981', inStock: true }
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image Area */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer"
      >
        <img
          src={selectedColor.image || product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              الأكثر طلباً
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="px-4 py-2 bg-white/95 text-gray-900 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 hover:bg-white transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة وتفاصيل</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400 dark:text-gray-500 font-medium">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
          >
            {product.title}
          </h3>

          {/* SMART COLOR AUTO-DETECTION & SWITCHING WITH DYNAMIC BOX UNDERNEATH */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <Palette className="w-3 h-3 text-emerald-500" />
                  <span>اللون المختار:</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {selectedColor.name}
                </span>
              </div>

              {/* Color Swatch Circles */}
              <div className="flex items-center gap-1.5">
                {product.colors.map((c, i) => {
                  const isChosen = selectedColor.name === c.name;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(c);
                      }}
                      className={`relative w-4 h-4 rounded-full border transition-all ${
                        isChosen 
                          ? 'ring-2 ring-emerald-500 scale-110 border-white' 
                          : 'border-gray-300 dark:border-gray-600 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  );
                })}
              </div>

              {/* DYNAMIC BOX BELOW COLOR SELECTION AS REQUESTED */}
              <div className="mt-2 p-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-emerald-500/30 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-bold">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor.hex }} />
                  <span>اللون: {selectedColor.name}</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedColor.inStock !== false ? 'متوفر بالمخزون' : 'غير متوفر'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Order Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {product.price} درهم
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.originalPrice} درهم
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-500" />
                <span>توصيل مجاني</span>
              </div>
            </div>

            {/* Wholesale Price Reference */}
            {product.wholesalePrice && (
              <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>سعر الجملة:</span>
                <span className="font-semibold text-gray-600 dark:text-gray-300 font-mono">
                  {product.wholesalePrice} درهم
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenDetail(product)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>طلب سريع</span>
              </button>
              
              <button
                onClick={() => onAddToCart(product, selectedColor.name)}
                className="w-full py-2 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </button>
            </div>

            {/* ACTION FOR VISITOR: BROWSING LANDING PAGE (NO DOWNLOAD) */}
            <div className="pt-1 border-t border-gray-100 dark:border-gray-800/80">
              <button
                type="button"
                onClick={() => onOpenDetail(product)}
                className="w-full py-2 px-3 bg-gray-50 hover:bg-emerald-50 dark:bg-gray-800 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/20 cursor-pointer"
                title="تصفح صفحة الهبوط الكاملة والمواصفات"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>تصفح صفحة الهبوط الكاملة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
