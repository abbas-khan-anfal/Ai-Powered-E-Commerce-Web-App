"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product/product-card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

function page() {
  const rouer = useRouter();
  const [products, setProducts] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const ispageRef = useRef(false);

  const getInitialProducts = async (page) => {
    if (!page) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/api/product/get-products?page=${page}$limit=${5}`,
      );
      setProducts((prev) => [...prev, ...res?.data?.products]);
      setTotalPages(res?.data?.totalPages);
    } catch (err) {
      console.log(err?.message);
    }
    finally{
      setIsLoading(false);
      ispageRef.current = false;
    }
  };

  useEffect(() => {
    if(ispageRef.current) return;
    ispageRef.current = true;
    getInitialProducts(currentPage);
  }, [currentPage]);

  const handlePagination = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-5">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
          Latest Products
        </h4>

        {
          isLoading && products?.length == 0
          ?
          (
            <div className="flex justify-center items-center my-3"><Spinner className="w-10 h-10" /></div>
          )
          :
          (
            <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products?.length > 0 ? (
            products?.map((currProduct, i) => (
              <ProductCard key={currProduct?._id} product={currProduct} />
            ))
          ) : (
            <Alert>
              <InfoIcon />
              <AlertTitle>No Products found</AlertTitle>
            </Alert>
          )}
        </div>

        {
          products?.length > 0 && (
            <div className="flex justify-center items-center my-3">
          <Button
          disabled={currentPage == totalPages || isLoading}
          onClick={() => handlePagination(currentPage + 1)}
          className="h-12 px-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Loading..." : currentPage == totalPages ? "Limit Reached 🔄" : "Load More 🔄"}
        </Button>
        </div>
          )
        }
        </>
          )
        }

      </div>
      <Footer />
    </>
  );
}

export default page;


// {products?.length > 0 ? (
//           products?.map((currProduct, i) => (
//             <ProductCard key={currProduct?._id} product={currProduct} />
//           ))
//         ) : (
//           <Alert>
//             <InfoIcon />
//             <AlertTitle>No Products found</AlertTitle>
//           </Alert>
//         )}