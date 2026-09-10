"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function FilterProducts() {
  const router = useRouter();
  const params = useSearchParams();

  const [minInput, setMinInput] = useState(params.get("min") || 0);
  const [maxInput, setMaxInput] = useState(params.get("max") || 5000);

  const applyFilters = () => {
    const newParams = new URLSearchParams(params.toString());

    newParams.set("min", minInput);
    newParams.set("max", maxInput);
    newParams.set("page", "1");

    router.push(`/shop?${newParams.toString()}`);
  };

  return (
    <>
      <div className="bg-muted p-4 rounded-md">
        <h2 className="text-sm font-semibold pb-2 border-b mb-2">
          Filter
        </h2>

        <h2 className="text-sm font-semibold">By Price</h2>

        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
          />

          <Input
            placeholder="Max"
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full mt-2" onClick={applyFilters}>
        Apply Filters
      </Button>
    </>
  );
}

export default FilterProducts;