import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart, Bot, Plus, Minus, X, InfoIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Alert, AlertTitle } from "@/components/ui/alert";
import ReviewAndRatings from "./review-ratings";
import ReviewCard from "./review-card";
import ProuctDetailsCard from "./product-details-card";

export default async function Page({params}) {

  const p = await params;
  const slug = p.slug || "";
  const res = await fetch(`http://localhost:3000/api/product/get-product/${slug}?isDashboard=${false}`, {
    cache: "no-store",
  });
  const jsonData = await res.json();
  const product = jsonData.product;

  return (
    <>
    <Navbar/>
    <div className="relative">
      
      <ProuctDetailsCard product={product} />

      <ReviewCard productReviews={product?.reviews} />

      <ReviewAndRatings productId={product?._id} />
      
    </div>
    <Footer/>
    </>
  );
}