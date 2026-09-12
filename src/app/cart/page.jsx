"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  InfoIcon,
  MoveLeft,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";
import {
  removeCartItemAction,
  updateCartAction,
} from "@/actions/cart/useCartActions";
import useCartStore from "@/store/useCartStore";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useCart from "@/hooks/cart/useCart";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { removeFromCart, cartItems, isLoading, cartTotal } = useCartStore();
  const [isRemoveLoading, setIsRemoveLoading] = useState("");
  const { getCartItemsHandler } = useCart();
  const [qtyValues, setQtyValues] = useState({});
  const [updateLoading, setUpdateLoading] = useState("");
  const router = useRouter();

  const increaseQty = (id) => {
    setQtyValues((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQtyValues((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const updateQtyHandler = async (id, qty) => {
    if (!id || id?.toString().trim() == "") return;
    const itemQty = Number(qty);
    if (!itemQty || itemQty <= 0) {
      toast.error("Invalid quantity, quantity must be 1 or greater");
      return;
    }
    setUpdateLoading(id?.toString());
    try {
      const res = await updateCartAction(id, itemQty);
      if (res?.success) {
        getCartItemsHandler();
        toast.success(res?.message);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setUpdateLoading("");
    }
  };

  const removeItem = async (id) => {
    console.log("Remove cart Item function success: ", id);
    if (!id || id?.toString().trim() == "") return;
    setIsRemoveLoading(id?.toString());
    try {
      const res = await removeCartItemAction(id);
      console.log("Remove cart Item function success : ", res);
      if (res?.success) {
        removeFromCart(id);
      }
    } catch (error) {
      console.log(error?.message);
      console.log("Remove cart Item function error : ", error);
    } finally {
      setIsRemoveLoading("");
    }
  };

  // const subtotal = cart.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  useEffect(() => {
    const initialQty = {};

    cartItems.forEach((item) => {
      initialQty[item._id] = item.qty;
    });

    setQtyValues(initialQty);
  }, [cartItems]);

  useEffect(() => {
    getCartItemsHandler();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-5">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={24} /> Your Cart
        </h1>

        {isLoading ? (
          <div className="flex justify-center">
            <Spinner className="size-10" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <ShoppingCart size={50} className="text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link href="/shop">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT - CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-muted p-4 rounded-xl"
                >
                  {/* Image */}
                  {/* <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    /> */}

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold">{item?.productId?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      ${item?.productId?.discountPrice}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item._id)}
                        className="p-1 border rounded-md hover:bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>

                      {/* Quantity Input */}
                      <Input
                        type="number"
                        className="max-w-20 text-center"
                        disabled={true}
                        value={qtyValues[item._id] || 1}
                      />
                      {/* <span>{item?.qty}</span> */}

                      <button
                        type="button"
                        onClick={() => increaseQty(item._id)}
                        className="p-1 border rounded-md hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>

                      <Button
                        disabled={updateLoading === item._id.toString()}
                        onClick={() =>
                          updateQtyHandler(item._id, qtyValues[item._id])
                        }
                      >
                        {updateLoading === item._id.toString() ? (
                          <Spinner />
                        ) : (
                          "Update Quantity"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    disabled={isRemoveLoading === item._id.toString()}
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    {isRemoveLoading === item._id.toString() ? (
                      <Spinner />
                    ) : (
                      <Trash2 />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT - SUMMARY */}
            <div className="bg-muted p-5 rounded-xl h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs : {cartTotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$10</span>
                </div>

                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>RS : {cartTotal}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-5 bg-primary text-white py-2 rounded-lg hover:opacity-90 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
