"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { updateProductAction } from "@/actions/product/update";

export default function Add() {
  const router = useRouter();
  const { pid } = useParams();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [files, setFiles] = useState(null);
  const [catId, setCatId] = useState("");
  const [imgToShow, setImgToShow] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);

  const loadCategoriesHandler = async () => {
    setIsCategoryLoading(true);
    try {
      const res = await axios.get("/api/category/get-categories?userOnly=true");
      setCategories(res?.data?.categories);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const loadProductHandler = async () => {
    setIsProductLoading(true);
    try {
      const res = await axios.get(
        `/api/product/get-product/${pid}?isDashboard=${true}`,
      );
      setName(res?.data?.product?.name);
      setDescription(res?.data?.product?.description);
      setStock(res?.data?.product?.stock);
      setPrice(res?.data?.product?.price);
      setDiscountPrice(res?.data?.product?.discountPrice);
      setCatId(res?.data?.product?.category?._id);
      if (res?.data?.product?.img_paths?.length > 0) {
        let productImgs = [];
        res?.data?.product?.img_paths?.map((currImg) =>
          productImgs.push(currImg),
        );
        setImgToShow(productImgs);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsProductLoading(false);
    }
  };

  // Load product data and categoires
  useEffect(() => {
    if (!pid || pid?.toString()?.trim == "") {
      router.push("/dashboard/products");
      return;
    }
    loadCategoriesHandler();
    loadProductHandler();
  }, [pid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("category", catId);
    formData.append("pId", pid);
    if (files && files.length > 0) {
      for (let file of files) {
        if (file.size > 1024 * 1024 * 5) {
          toast.error("File size should be less than 5MB");
          return;
        }
        if (!file.type.startsWith("image/")) {
          toast.error("Invalid file type. Only images are allowed.");
          return;
        }
        formData.append("files", file);
      }
    }

    try {
      const res = await updateProductAction(formData);
      if (res?.success) {
        toast.success(res?.message);
        router.push("/dashboard/products");
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet className="text-4xl">
            <div className="flex justify-start items-center gap-0.5 pb-5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Go Back"
                className="mr-2"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon />
              </Button>

              <FieldLegend>Update Product</FieldLegend>
            </div>
            <FieldDescription>
              Complete all your product details
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="product-7j9-card-name-43j">
                  Product Name
                </FieldLabel>
                <Input
                  id="product-7j9-card-name-43j"
                  placeholder="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  disabled={
                    updateLoading || isProductLoading || isCategoryLoading
                  }
                />
              </Field>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="product-7j9-optional-comments">
                      Product Description
                    </FieldLabel>
                    <Textarea
                      id="product-7j9-optional-comments"
                      placeholder="your product description..."
                      className="resize-none"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      disabled={
                        updateLoading || isProductLoading || isCategoryLoading
                      }
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field>
                <FieldLabel htmlFor="userRole">Product Category</FieldLabel>
                <Select
                  value={catId}
                  onValueChange={setCatId}
                  disabled={
                    updateLoading || isProductLoading || isCategoryLoading
                  }
                >
                  <SelectTrigger id="category9898">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c?._id} value={c?._id}>
                        {c?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="product-stock9388">
                  Product Stock
                </FieldLabel>
                <Input
                  id="product-stock9388"
                  placeholder="1"
                  required
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                  disabled={
                    updateLoading || isProductLoading || isCategoryLoading
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="product-7j9-exp-year-f59">
                    Original Price
                  </FieldLabel>
                  <Input
                    id="product-7j9-card-name-43j"
                    placeholder="00"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    disabled={
                      updateLoading || isProductLoading || isCategoryLoading
                    }
                  />
                  <FieldDescription>
                    e.g : <s>Rs : 200.00</s>
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-7j9-exp-year-f59">
                    Sale Price
                  </FieldLabel>
                  <Input
                    id="product-7j9-card-name-43j"
                    placeholder="00"
                    required
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    value={discountPrice}
                    disabled={
                      updateLoading || isProductLoading || isCategoryLoading
                    }
                  />
                  <FieldDescription>e.g : Rs : 190.00</FieldDescription>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="product-7j9-card-name-43j">
                  Product Photo
                </FieldLabel>
                <div className="flex flex-row gap-2">
                  {isProductLoading ? (
                    // skeleton loading.
                    <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-muted border animate-pulse"></div>
                  ) : (
                    imgToShow.length > 0 &&
                    imgToShow?.map((pImg, index) => (
                      <div
                        key={index + 1}
                        className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-muted border border-white"
                      >
                        <Image
                          src={pImg}
                          alt="Photo by Drew Beamer"
                          width={100}
                          height={100}
                          className="object-contain"
                        />
                      </div>
                    ))
                  )}
                </div>
                <Input
                  id="product-7j9-card-name-43j"
                  placeholder="name"
                  type="file"
                  name="file"
                  onChange={(e) => setFiles(e.target.files)}
                  disabled={
                    updateLoading || isProductLoading || isCategoryLoading
                  }
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          {/* <FieldSeparator /> */}
          <Field orientation="horizontal">
            <Button
              type="submit"
              disabled={updateLoading || isProductLoading || isCategoryLoading}
            >
              {updateLoading
                ? "Product Updating..."
                : "Update & Publish Product"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
