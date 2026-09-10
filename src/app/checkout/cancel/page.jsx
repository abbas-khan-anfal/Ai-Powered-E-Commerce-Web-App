"use client";

import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="flex justify-center bg-background min-h-screen overflow-y-auto">
      <div className="w-full max-w-md md:mt-10 lg:mt-15 mt-5">
        <div className="flex justify-center mb-5">
          <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
            <CircleX className="text-destructive" size={60} />
          </div>
        </div>
        <div>
          {/* Title */}
          <h1 className="text-2xl font-bold mb-2 text-center text-foreground">Order Cancelled</h1>

          {/* Message */}
          <p className="text-muted-foreground mb-6 text-center">
            Your order has been cancelled.try again later.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1">
            <Button className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default page;
