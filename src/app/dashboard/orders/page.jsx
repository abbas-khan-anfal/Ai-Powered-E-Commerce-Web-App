"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useOrder from "@/hooks/orders/useOrder";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { updateOrderStatusAction } from "@/actions/order/useOrderAction";
import toast from "react-hot-toast";

function OrderPage() {
  const [statusMap, setStatusMap] = useState({});

  const {
    loadOrdersHandler,
    isOrdersLoading,
    orders,
    setOrders,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useOrder();

  useEffect(() => {
    loadOrdersHandler(
      currentPage,
      `/api/orders/get-orders?page=${currentPage}&limit=${5}`,
    );
  }, [currentPage]);

  //   useEffect(() => {
  //   console.log(orders)
  // }, [orders]);


  const handlePagination = (page) => {
    if (page == 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    // change the orderStatus in orders
    // create new array with updated data and update the ui and state
    const updatedOrders = orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, orderStatus };
      }
      return order;
    });
    setOrders(updatedOrders);

    try {
      const res = await updateOrderStatusAction({ orderId, orderStatus });
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      console.log(err?.message);
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
                          RS: {order?.subtotal}
                        </p>

                        <p className="text-sm text-green-600">
                          {order?.orderStatus}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="mt-5">
                    <div className="space-y-4 pt-4">
                      {/* PRODUCT */}
                      <div className="space-y-4">
                        <div className="flex items-end gap-3">
                          <Field className="flex-1">
                            <FieldLabel>Order Status</FieldLabel>

                            <Select
                              value={statusMap[order._id] || order.orderStatus}
                              onValueChange={(value) =>
                                setStatusMap((prev) => ({
                                  ...prev,
                                  [order._id]: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-full capitalize">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">
                                  Processing
                                </SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">
                                  Delivered
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>

                          <Button
                            onClick={() =>
                              updateOrderStatus(order._id, statusMap[order._id])
                            }
                          >
                            Update
                          </Button>
                        </div>

                        {order?.products?.map((currProduct) => (
                          <div
                            key={currProduct?._id?.toString()?.substring(0, 10)}
                            className="flex justify-between border rounded-lg p-3"
                          >
                            <div>
                              <p className="font-medium">
                                {currProduct?.productId?.name}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                Quantity: {currProduct?.quantity}
                              </p>
                            </div>

                            <p className="font-semibold">
                              {currProduct?.productId?.discountPrice}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* EXTRA DETAILS */}
                      <div className="border-t pt-4 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Payment Method</span>
                          <span>{order?.orderId?.paymentMethod}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Shipping Address</span>
                          <span>{`${order?.orderId?.shippingAddress?.address1}, ${order?.orderId?.shippingAddress?.address2}, ${order?.orderId?.shippingAddress?.city}, ${order?.orderId?.shippingAddress?.country}`}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Shipping Fee</span>
                          <span>RS: 50</span>
                        </div>

                        <div className="flex justify-between font-semibold">
                          <span>Total Amount</span>
                          <span>RS: {order?.subtotal}</span>
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

      {/* PAGINATION */}
      {orders?.length !== 0 && (
        <Pagination className="mt-3">
          <PaginationContent>
            {/* Prev */}
            <PaginationItem
              onClick={() =>
                currentPage > 1 && handlePagination(currentPage - 1)
              }
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              <PaginationPrevious href="#" />
            </PaginationItem>

            {/* 1 */}
            <PaginationItem onClick={() => handlePagination(1)}>
              <PaginationLink isActive={currentPage === 1} href="#">
                1
              </PaginationLink>
            </PaginationItem>

            {/* Left Ellipsis */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Middle pages: currentPage -1, currentPage, currentPage +1 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) <= 1,
              )
              .map((page) => (
                <PaginationItem
                  key={page}
                  onClick={() => handlePagination(page)}
                >
                  <PaginationLink isActive={page === currentPage} href="#">
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {/* Right Ellipsis */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last */}
            {totalPages > 1 && (
              <PaginationItem onClick={() => handlePagination(totalPages)}>
                <PaginationLink isActive={currentPage === totalPages} href="#">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next */}
            <PaginationItem
              onClick={() =>
                currentPage < totalPages && handlePagination(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default OrderPage;
