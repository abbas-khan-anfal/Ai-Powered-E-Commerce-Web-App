"use client";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import { Badge } from "./ui/badge";
import { TrendingUp } from "lucide-react";
import { FieldLegend } from "./ui/field";

export function SectionCards(
  { totalProducts, totalCategories, totalUsers, orders }
) {

  console.log(orders);

  const subTotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalProductsSold = orders.reduce((sum, order) => sum + order.products.length, 0);

  const dashboardUser = useAdminAuthStore((state) => state.dashboardUser);
  return (
    <div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <>
        {dashboardUser && dashboardUser?.role === "admin" && (
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalUsers}
              </CardTitle>
            </CardHeader>
          </Card>
        )}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalProducts}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Categories</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCategories}
            </CardTitle>
          </CardHeader>
        </Card>
      </>
    </div>
      
    <div className="w-full">
      <div className="mt-5 mb-2">
        <FieldLegend>
          Total Revenue
        </FieldLegend>
      </div>
      <div className="w-full flex flex-wrap gap-2">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${subTotal}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {/* +12.5% */}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Strong user retention <TrendingUp className="size-4" /> */}
          </div>
          <div className="text-muted-foreground">From the last 1 month</div>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>Total Products sold</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalProductsSold}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {/* +12.5% */}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Strong user retention <TrendingUp className="size-4" /> */}
          </div>
          <div className="text-muted-foreground">From the last 1 month</div>
        </CardFooter>
      </Card>


      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {orders.length}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              {/* +12.5% */}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {/* Strong user retention <TrendingUp className="size-4" /> */}
          </div>
          <div className="text-muted-foreground">From the last 1 month</div>
        </CardFooter>
      </Card>
      </div>
    </div>

    </div>
  );
}
