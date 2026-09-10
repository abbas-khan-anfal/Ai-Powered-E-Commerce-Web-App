"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FieldLegend } from "../ui/field";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
// };

export function SellerBarChart({orders}) {

  console.log(orders);

  const chartData = orders.map((order, index) => ({
    order: `Order ${index + 1}`,
    revenue: order.subtotal,
  }));

  const subTotal = orders.reduce((sum, order) => sum + order.subtotal, 0);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
  };

  return (
    <div className="w-full max-h-[200px] mt-7">
      <div>
        <FieldLegend className="mb-2">Total Revenue ({subTotal})</FieldLegend>
        <ChartContainer config={chartConfig} className="w-full w-lg">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>


         <ChartContainer config={chartConfig} className="w-full w-lg">
            <BarChart data={chartData}>
              <XAxis dataKey="order" />


              {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
              <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
      </div>
    </div>
  );
}
