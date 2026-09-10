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
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createProductAction } from "@/actions/product/create";
import axios from "axios";

export default function Add() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [files, setFiles] = useState(null);
  const imagesInputRef = useRef(null);
  const [catId, setCatId] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    if(!catId)
    {
      toast.error("Please select a category");
      return;
    }
    formData.append("catId", catId);
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
    setIsLoading(true);
    try {
      const result = await createProductAction(formData);
      if (result.success) {
        setName("");
        setDescription("");
        setStock(1);
        setPrice(0);
        setDiscountPrice(0);
        setCatId("");
        setFiles(null);
        if(imagesInputRef)
        {
          imagesInputRef.current.value = null;
        } 
        toast.success(result?.message);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await axios.get("/api/category/get-categories?userOnly=true");
      if (res.data.success) {
        setCategories(res?.data?.categories || []);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="w-full max-w-md">
      <form onSubmit={submitHandler}>
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

              <FieldLegend>Add Product</FieldLegend>
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
                  disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field>
                <FieldLabel htmlFor="userRole">Product Category</FieldLabel>
                <Select
                  value={catId}
                  onValueChange={(value) => setCatId(value)}
                  disabled={isLoading || categoriesLoading}
                >
                  <SelectTrigger id="category9898">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {!categoriesLoading ? (
                      categories?.map((c, i) => (
                        <SelectItem value={c?._id}>{c?.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem>Loading...</SelectItem>
                    )}
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
                  disabled={isLoading}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="product-7j9-exp-year-f59">
                    Price
                  </FieldLabel>
                  <Input
                    id="product-7j9-card-name-43j"
                    placeholder="00"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    e.g : <s>Rs : 200.00</s>
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-7j9-exp-year-f59">
                    Discount Price
                  </FieldLabel>
                  <Input
                    id="product-7j9-card-name-43j"
                    placeholder="00"
                    required
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    value={discountPrice}
                    disabled={isLoading}
                  />
                  <FieldDescription>e.g : Rs : 190.00</FieldDescription>
                </Field>
                <div className="col-span-2">
                  <FieldDescription>
                    Note : Discount price must be less than price
                  </FieldDescription>
                </div>
              </div>
              <Field>
                <FieldLabel htmlFor="product-7j9-card-name-43j">
                  Product Photo
                </FieldLabel>
                <div className="flex flex-row gap-2">
                  <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-muted">
                    <Image
                      src=""
                      alt="Photo by Drew Beamer"
                      width={100}
                      height={100}
                      className="object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                  </div>
                </div>
                <Input
                  id="product-7j9-card-name-43j"
                  placeholder="name"
                  type="file"
                  name="file"
                  onChange={(e) => setFiles(e.target.files)}
                  disabled={isLoading}
                  multiple
                  ref={imagesInputRef}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          {/* <FieldSeparator /> */}
          <Field orientation="horizontal">
            <Button type="submit" disabled={isLoading || categoriesLoading}>
              {isLoading ? "Product Publishing..." : "Publish & Save Product"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
