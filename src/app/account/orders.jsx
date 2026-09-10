"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useOrder from "@/hooks/orders/useOrder";

function Orders() {
  const {
    loadOrdersHandler,
    orders,
    isOrdersLoading,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useOrder();

  useEffect(() => {
    loadOrdersHandler(
      currentPage,
      `/api/orders/customer-orders?page=${currentPage}&limit=${5}`,
    );
  }, [currentPage]);

  // useEffect(() => {
  //   console.log(orders);
  // }, [orders]);

  const handlePagination = (page) => {
    if (page == 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="space-y-4">
        {!isOrdersLoading ? (
          orders?.length > 0 ? (
            orders?.map((order) => (
              <Accordion
                key={order?._id?.toString()?.substring(0, 10)}
                type="single"
                collapsible
                className="w-full"
              >
                {/* ORDER 1 */}
                <AccordionItem
                  value="order-1"
                  className="border rounded-xl bg-background p-5"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full pr-4">
                      {/* LEFT */}
                      <div className="text-left">
                        <p className="font-medium">
                          Order #{order?._id?.toString().substring(0, 10)}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {order?.products?.length} Products
                        </p>
                      </div>

                      {/* RIGHT */}
                      <div className="text-right">
                        <p className="font-semibold">
                          RS: {order?.totalAmount}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="mt-5">
                    <div className="space-y-4 pt-4">
                      {/* PRODUCT */}
                      <div className="space-y-3">
                        {order?.products?.map((item) => (
                          <div
                            key={item?._id}
                            className="flex items-center justify-between rounded-lg border bg-card p-4"
                          >
                            {/* Product Info */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-base">
                                {item?.productId?.name}
                              </h3>

                              <p className="text-sm text-muted-foreground mt-1">
                                Qty:{" "}
                                <span className="font-medium">
                                  {item?.quantity}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-col justify-center items-center gap-2">
                              {/* Status */}
                              <div className="mx-6">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold
            ${
              item?.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : item?.status === "processing"
                  ? "bg-blue-100 text-blue-700"
                  : item?.status === "shipped"
                    ? "bg-purple-100 text-purple-700"
                    : item?.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : item?.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
            }`}
                                >
                                  {item?.status}
                                </span>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="font-bold text-lg">
                                  Rs. {item?.productId?.discountPrice}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* EXTRA DETAILS */}
                      <div className="border-t pt-4 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Payment Method</span>
                          <span>{order?.paymentMethod}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Shipping Address</span>
                          <span>{`${order?.shippingAddress?.address1}, ${order?.shippingAddress?.address2}, ${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}`}</span>
                        </div>

                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>RS: {order?.subtotal}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Shipping Fee</span>
                          <span>RS: 50</span>
                        </div>

                        <div className="flex justify-between font-semibold">
                          <span>Subtotal Total</span>
                          <span>RS: {order?.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))
          ) : (
            <Alert>
              <InfoIcon />
              <AlertTitle>No Orders Found</AlertTitle>
            </Alert>
          )
        ) : (
          <Spinner className="size-15" />
        )}
      </div>
    </div>
  );
}

export default Orders;
