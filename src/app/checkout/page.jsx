"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Truck, User, Banknote, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import useCartStore from "@/store/useCartStore";
import useOrder from "@/hooks/orders/useOrder";
import useOrderStore from "@/store/useOrderStore";
import { Spinner } from "@/components/ui/spinner";

export default function CheckoutPage() {

  const { createOrderHandler } = useOrder();
  // STATES
  const fullName = useOrderStore(state => state.fullName);
  const setFullName = useOrderStore(state => state.setFullName);
  const email = useOrderStore(state => state.email);
  const setEmail = useOrderStore(state => state.setEmail);
  const phone = useOrderStore(state => state.phone);
  const setPhone = useOrderStore(state => state.setPhone);
  const city = useOrderStore(state => state.city);
  const setCity = useOrderStore(state => state.setCity);
  const country = useOrderStore(state => state.country);
  const address1 = useOrderStore(state => state.address1);
  const setAddress1 = useOrderStore(state => state.setAddress1);
  const address2 = useOrderStore(state => state.address2);
  const setAddress2 = useOrderStore(state => state.setAddress2);
  const paymentMethod = useOrderStore(state => state.paymentMethod);
  const setPaymentMethod = useOrderStore(state => state.setPaymentMethod);
  const isLoading = useOrderStore(state => state.isLoading);
  const setIsLoading = useOrderStore(state => state.setIsLoading);
  const cartItems = useCartStore(state => state.cartItems);  
  const cartTotal = useCartStore(state => state.cartTotal);

  const submitHandler = async (e) => {
    e.preventDefault();
    await createOrderHandler();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-5 bg-background">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CreditCard /> Checkout
        </h1>

        <form className="grid lg:grid-cols-3 gap-6" onSubmit={submitHandler}>
          {/* LEFT */}
          <div className="lg:col-span-2 bg-muted p-6 rounded-xl space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={18} /> Personal Info
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <Input
                  placeholder="Country"
                  value={country}
                  disabled
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck size={18} /> Shipping Address
              </h2>

              <div className="space-y-4">
                <Input
                  placeholder="Address Line 1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />

                <Input
                  placeholder="Address Line 2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={18} /> Payment Method
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* COD */}
                <label
                  htmlFor="cod"
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer flex-1 transition ${
                    paymentMethod === "cod"
                      ? "border-primary bg-background"
                      : "border-border"
                  }`}
                >
                  <Checkbox
                    id="cod"
                    checked={paymentMethod === "cod"}
                    onCheckedChange={() => setPaymentMethod("cod")}
                  />

                  <div className="flex items-center gap-3">
                    <Banknote size={22} />

                    <div>
                      <p className="font-medium">Cash on Delivery</p>

                      <p className="text-sm text-muted-foreground">
                        Pay when order arrives
                      </p>
                    </div>
                  </div>
                </label>

                {/* STRIPE */}
                <label
                  htmlFor="stripe"
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer flex-1 transition ${
                    paymentMethod === "stripe"
                      ? "border-primary bg-background"
                      : "border-border"
                  }`}
                >
                  <Checkbox
                    id="stripe"
                    checked={paymentMethod === "stripe"}
                    onCheckedChange={() => setPaymentMethod("stripe")}
                  />

                  <div className="flex items-center gap-3">
                    <Wallet size={22} />

                    <div>
                      <p className="font-medium">Stripe Payment</p>

                      <p className="text-sm text-muted-foreground">
                        Pay securely with card
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-muted p-5 rounded-xl h-fit">
            <h2 className="text-lg font-semibold mb-4">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3 text-sm">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>
                    {item?.productId?.name} × {item?.qty}
                  </span>

                  <span>RS: {item?.productId?.discountPrice * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t mt-4 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>RS: {cartTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>RS: 50</span>
              </div>

              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${cartTotal + 50}</span>
              </div>
            </div>

            {/* Button */}
            <Button disabled={isLoading} type="submit" className="w-full mt-5">
              {isLoading ? <Spinner /> : "Place Order"}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}