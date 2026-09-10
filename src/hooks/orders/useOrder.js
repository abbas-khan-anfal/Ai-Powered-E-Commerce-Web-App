"use client";
import useOrderStore from "@/store/useOrderStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function useOrder() {
  const router = useRouter();
  const fullName = useOrderStore((state) => state.fullName);
  const setFullName = useOrderStore((state) => state.setFullName);
  const email = useOrderStore((state) => state.email);
  const setEmail = useOrderStore((state) => state.setEmail);
  const phone = useOrderStore((state) => state.phone);
  const setPhone = useOrderStore((state) => state.setPhone);
  const city = useOrderStore((state) => state.city);
  const setCity = useOrderStore((state) => state.setCity);
  const country = useOrderStore((state) => state.country);
  const address1 = useOrderStore((state) => state.address1);
  const setAddress1 = useOrderStore((state) => state.setAddress1);
  const address2 = useOrderStore((state) => state.address2);
  const setAddress2 = useOrderStore((state) => state.setAddress2);
  const paymentMethod = useOrderStore((state) => state.paymentMethod);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const isLoading = useOrderStore((state) => state.isLoading);
  const setIsLoading = useOrderStore((state) => state.setIsLoading);

  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const createOrderHandler = async () => {
    if (
      !fullName ||
      !email ||
      !phone ||
      !city ||
      !address1 ||
      !address2 ||
      !paymentMethod
    ) {
      toast.error("All fields are required");
      return;
    }

    const orderData = {
      fullName,
      email,
      phone,
      city,
      address1,
      address2,
      paymentMethod,
    };

    setIsLoading(true);
    try {
      const res = await axios.post("/api/orders/create-order", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // CASH ON DELIVERY RESPONSE
      if (paymentMethod === "cod") {
        if (res.data.success) {
          toast.success(res.data.message);
          router.push("/checkout/success");
        } else {
          toast.error(res.data.message);
        }
      }

      // STIPE RESPONSE
      if (paymentMethod === "stripe") {
        if (res.data.success) {
          window.location.href = res.data.url;
        } else {
          console.log(res.data.message);
        }
      }
    } catch (err) {
      console.log(err?.message);
    } finally {
      setIsLoading(false);

      setFullName("");
      setEmail("");
      setPhone("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setPaymentMethod("cod");
    }
  };

  const loadOrdersHandler = async (page = 1, url) => {
    setIsOrdersLoading(true);
    if(!url) url = `/api/orders/get-orders?page=${page}&isDashboard=false`;
    try {
      const res = await axios.get(
        // `/api/orders/get-orders?page=${page}&isDashboard=${false}`,
        url
      );
      setOrders(res?.data?.orders);
      setTotalPages(res?.data?.totalPages);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  return {
    createOrderHandler,

    loadOrdersHandler,
    orders,
    setOrders,
    totalPages,
    currentPage,
    setCurrentPage,
    isOrdersLoading,
  };
}

export default useOrder;
