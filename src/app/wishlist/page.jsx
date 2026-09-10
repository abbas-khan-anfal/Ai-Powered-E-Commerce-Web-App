"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { removeWishlistItemAction } from "@/actions/wishlist/useWishlistAction";
import toast from "react-hot-toast";
import useCart from "@/hooks/cart/useCart";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoveLoading, setIsRemoveLoading] = useState("");
  const { addToCartHandler } = useCart();


  const fetchWishlistItemsHandler = async () => {
    setIsLoading(true);
    try
    {
      const res = await axios.get('/api/wishlist');
      if(res?.data?.success)
      {
        setItems(res?.data?.items);
      }
    }
    catch(error)
    {
      console.log(error?.message);
    }
    finally
    {
      setIsLoading(false);
    }
  }

  const removeItemHandler = async (itemId) => {
    if(!itemId || itemId?.toString().trim() == "") return;
    setIsRemoveLoading(itemId?.toString());
    try
    {
      const res = await removeWishlistItemAction(itemId);
      if(res?.success)
      {
        fetchWishlistItemsHandler();
      }
      else
      {
        toast.error(res?.message);
      }
    }
    catch(error)
    {
      console.log(error?.message);
    }
    finally
    {
      setIsRemoveLoading("");
    }
  };


  useEffect(() => {
    fetchWishlistItemsHandler();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen p-5">
      
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart /> Your Wishlist
      </h1>

      {/* Empty State */}
      {
        isLoading
        ?
        (
          <div>
            <Spinner className="size-10" />
          </div>
        )
        :
        (
          items.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Heart size={50} className="text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">
            Your wishlist is empty
          </p>
          <Link href="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {items?.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl overflow-hidden bg-background hover:shadow-lg transition"
            >
              
              {/* Image */}
              <div className="relative h-[180px] bg-muted">
                {
                  item?.productId?.img_paths?.length > 0
                  ?
                  (
                    <Image
                      src={item?.productId?.img_paths?.[0]}
                      alt={item?.productId?.name}
                      fill
                      className="object-cover"
                    />
                  )
                  :
                  (
                    <Image
                      src="/placeholder-img.png"
                      alt={item?.productId?.name}
                      fill
                      className="object-cover"
                    />
                  )
                }

                {/* Remove */}
                <button
                  onClick={() => removeItemHandler(item?._id)}
                  className="absolute top-2 right-2 bg-white/80 p-2 rounded-full shadow"
                >
                  {isRemoveLoading === item?._id.toString() ? (
                    <Spinner />
                  ) : (
                    <Trash2 size={16} className="text-red-500" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col gap-2">
                
                {/* Title */}
                <Link href="#">
                  <p className="text-sm font-medium line-clamp-2 hover:text-primary">
                    {item.productId?.name?.toString()?.substring(0, 100) + "..."}
                  </p>
                </Link>

                {/* Price */}
                <p className="text-primary font-semibold">
                  Rs. {item?.productId?.discountPrice}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-2">
                  <Button className="w-full" onClick={() => addToCartHandler(item?.productId?._id)}>
                    <ShoppingCart size={16} />
                    Add
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => removeItemHandler(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
        )
      }
    </div>
    <Footer/>
    </>
  );
}