"use client";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useRouter, useSearchParams } from "next/navigation";

function SortProducts() {
  const router = useRouter();
  const params = useSearchParams();

  const sort = params.get("sort") || "az";

  const handleChange = (value) => {
    const newParams = new URLSearchParams(params.toString());

    newParams.set("sort", value);
    newParams.set("page", "1"); // reset page

    router.push(`/shop?${newParams.toString()}`);
  };

  return (
    <NativeSelect value={sort} onChange={(e) => handleChange(e.target.value)}>
      <NativeSelectOption value="az">a-z</NativeSelectOption>
      <NativeSelectOption value="za">z-a</NativeSelectOption>
      <NativeSelectOption value="price_low">Price low to high</NativeSelectOption>
      <NativeSelectOption value="price_high">Price high to low</NativeSelectOption>
    </NativeSelect>
  );
}

export default SortProducts;