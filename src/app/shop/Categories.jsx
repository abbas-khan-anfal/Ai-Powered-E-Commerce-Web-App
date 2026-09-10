"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const params = useSearchParams();

  const activeCategory = params.get("category");

  const getCategoriesHandler = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/category/get-categories");
      if (res?.data?.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log("Error fetching categories:", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    const newParams = new URLSearchParams();

    newParams.set("category", categoryName);
    newParams.set("page", "1"); // reset page

    router.push(`/shop?${newParams.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/shop");
  }

  useEffect(() => {
    getCategoriesHandler();
  }, []);

  return (
    <>
    <div>
      <Button variant="outline" className="w-full" onClick={clearAllFilters}>
        Clear All Filters
      </Button>
    </div>

    <div className="bg-muted p-4 rounded-md">

      <h2 className="text-sm font-semibold mb-2">Categories</h2>

      <ul className="space-y-2 text-sm">
        {isLoading ? (
          <Spinner />
        ) : categories?.length > 0 ? (
          categories.map((category, i) => (
            <li
              key={i}
              onClick={() => handleCategoryClick(category?.name)}
              className={`flex justify-between cursor-pointer hover:text-primary ${activeCategory === category?.name ? "text-primary font-medium underline" : ""}`}
            >
              <span>{category?.name}</span>
              <span>({category?.totalProducts})</span>
            </li>
          ))
        ) : (
          <Alert>
            <InfoIcon />
            <AlertTitle>No categories found</AlertTitle>
          </Alert>
        )}
      </ul>
    </div>
    </>
  );
}

export default ProductCategories;