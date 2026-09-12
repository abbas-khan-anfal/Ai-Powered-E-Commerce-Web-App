"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "../ui/button";
import useCartStore from "@/store/useCartStore";
import toast from "react-hot-toast";
import { addToWishlistAction } from "@/actions/wishlist/useWishlistAction";
import useCart from "@/hooks/cart/useCart";
import { useRouter } from "next/navigation";

function ProductCard({ product }) {
  const rating = 3.1;
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted);
  const router = useRouter();
  const { addToCartHandler } = useCart();

  const avg =
    product?.reviews?.reduce((sum, curr) => sum + curr.rating, 0) /
      product?.reviews?.length || 0;
  const fill = (avg / 5) * 100;

  const addToWishlistHandler = async (productId) => {
    if (!productId || productId === "") return;
    try {
      
      const res = await addToWishlistAction(productId);
      if (res?.success) {
        setIsWishlisted((prev) => !prev);
        router.refresh();
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
      <div className="group bg-background border rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
        {/* Image */}
        <div className="relative h-[180px] bg-muted">
          {product?.img_paths.length > 0 ? (
            <Image
              src={product?.img_paths?.[0]}
              alt="product"
              fill
              className="object-contain group-hover:scale-105 transition duration-300"
            />
          ) : (
            <Image
              src="/placeholder-img.png"
              alt="product"
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          )}

          {/* Wishlist */}
          <button
            onClick={() => addToWishlistHandler(product?._id)}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full shadow"
          >
            <Heart
              size={16}
              className={`${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col gap-2">
          {/* Title */}
          <Link href={`/shop/product-details/${product?.slug}`}>
            <p className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition">
              {product?.name?.toString()?.substring(0, 100) + "..."}
            </p>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex gap-[2px]">
              {[...Array(5)].map((_, idx) => {
                const starFill = Math.min(Math.max(avg - idx, 0), 1) * 100;

                return (
                  <div key={idx} className="relative">
                    <Star size={14} className="text-gray-300" />

                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{ width: `${starFill}%` }}
                    >
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-muted-foreground">
              {product?.reviews?.length}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <p className="font-semibold text-primary">
              Rs. {product?.discountPrice}
            </p>
            <p className="text-xs text-muted-foreground line-through">
              Rs. {product?.price}
            </p>
          </div>

          {/* Button */}
          <Button
            className="w-full mt-2"
            onClick={() => addToCartHandler(product?._id)}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
      </div>
  );
}

export default ProductCard;
