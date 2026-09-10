import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SortProducts from "./Sort";
import FilterProducts from "./Filters";
import ProductCategories from "./Categories";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { cookies } from "next/headers";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const page = Number(params?.page || 1);

  const min = params?.min ? Number(params.min) : null;
  const max = params?.max ? Number(params.max) : null;

  const sort = params?.sort ?? "";
  const category = params?.category ?? "";
  const search = params?.search ?? "";

  const url = `http://localhost:3000/api/product/get-products?page=${page}${
    min !== null ? `&min=${min}` : ""
  }${
    max !== null ? `&max=${max}` : ""
  }${
    sort ? `&sort=${sort}` : ""
  }${
    category ? `&category=${category}` : ""
  }${
    search ? `&search=${search}` : ""
  }`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!res.ok)
  {
    return (
      <>
        <Navbar/>
        <div className="flex pt-5 justify-center">
          <Alert>
            <InfoIcon />
            <AlertTitle>Network error or Something went wrong</AlertTitle>
          </Alert>
        </div>
        <Footer/>
      </>
    )
  }

  const data = await res.json();

  const products = data.products;
  const totalPages = data.totalPages;
  const currentPage = page;

  const query = `${
    min !== null ? `&min=${min}` : ""
  }${
    max !== null ? `&max=${max}` : ""
  }${
    sort ? `&sort=${sort}` : ""
  }${
    category ? `&category=${category}` : ""
  }${
    search ? `&search=${search}` : ""
  }`;

  return (
    <>
      <Navbar />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 p-3 gap-5">
        {/* sidebar */}
        <div className="col-span-1 flex flex-col gap-5 md:pt-12">
          {/* 📂 Categories */}
          <>
            <ProductCategories />
          </>

          {/* 💰 Price Filter */}
          <>
            <FilterProducts searchParams={params} />
          </>
        </div>

        {/* products */}
        <div className="col-span-1 lg:col-span-3 md:col-span-2">
          <div className="py-2 flex justify-between">
            <div>
              {category && category.length > 0 && (
                <h2 className="text-sm font-semibold">
                  Category : {category && category}
                </h2>
              )}
              <p className="text-sm text-muted-foreground">
                {products?.length} products found
              </p>
            </div>
            <SortProducts searchParams={params} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.length > 0 ? (
              products.map((currProduct, i) => (
                <ProductCard key={i} product={currProduct} />
              ))
            ) : (
              <Alert>
                <InfoIcon />
                <AlertTitle>No Products found</AlertTitle>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* pagination start */}

      {products?.length > 0 && (
        <Pagination className="my-3">
          <PaginationContent>
            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                href={
                  currentPage > 1 ? `?page=${currentPage - 1}${query}` : ""
                }
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={`?page=${page}${query}`}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href={
                  currentPage < totalPages
                    ? `?page=${currentPage + 1}${query}`
                    : ""
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {/* pagination end */}

      <Footer />
    </>
  );
}
