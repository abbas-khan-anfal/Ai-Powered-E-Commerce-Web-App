"use client";
import { addToCartAction } from "@/actions/cart/useCartActions";
import useCartStore from "@/store/useCartStore";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

function useCart() {
  const { setCartItems, setIsLoading, cartTotal, setCartTotal } =
    useCartStore();

  const getCartItemsHandler = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/cart/cart-items");
      if (res?.data?.success) {
        setCartItems(res?.data?.cartItems);
        if (res?.data?.cartItems) {
          let total = 0;
          total = res?.data?.cartItems?.reduce(
            (acc, curr) => acc + curr?.qty * curr?.productId?.discountPrice,
            0,
          );
          setCartTotal(total);
        }
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCartHandler = async (productId) => {
    if (!productId || productId === "") return;
    try {
      const res = await addToCartAction(productId);
      if (res?.success) {
        getCartItemsHandler();
        toast.success(res?.message);
      }
      else
      {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  return { getCartItemsHandler, addToCartHandler };
}

export default useCart;
