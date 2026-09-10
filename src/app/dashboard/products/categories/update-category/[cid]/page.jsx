"use client";
import { updateCategoryAction } from "@/actions/category/update";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldDescription,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddCategoryPage() {
  const router = useRouter();
  const { cid } = useParams();

  const [updateLoad, setUpdateLoad] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load user data
  const loadCategory = async () => {
    //if cid is not present, then go back
    if (!cid || cid?.toString()?.trim() === "") {
      router.back();
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`/api/category/get-category/${cid}`);
      if (res.data.success) {
        setName(res?.data?.category?.name || "");
        setDescription(res?.data?.category?.description || "");
      } else {
        toast.error(res?.data?.message || "Failed to load category!");
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [cid]);

  const handleSubmit = async (e) => {
    setUpdateLoad(true);
    e.preventDefault();

    const category = {
      cid,
      name,
      description: description || undefined, // if empty, don't update description
    };

    try {
      const res = await updateCategoryAction(category);
      if (res.success) {
        toast.success(res?.message || "Category updated successfully!");
      } else {
        toast.error(res?.message || "Failed to update category!");
      }
    } catch (error) {
      toast.error(error?.message || "Error updating category!");
    } finally {
      setUpdateLoad(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
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

              <FieldLegend>Update Category</FieldLegend>
            </div>

            <FieldDescription>Update category details</FieldDescription>

            <Field>
              <FieldLabel>Category Name</FieldLabel>
              <Input
                placeholder="e.g. Electronics"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || updateLoad}
              />
            </Field>

            <Field>
              <FieldLabel>
                Description <FieldDescription>(optional)</FieldDescription>
              </FieldLabel>
              <Textarea
                placeholder="Category description..."
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading || updateLoad}
              />
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading || updateLoad}>
                {updateLoad || isLoading ? "Updating Category..." : "Update"}
              </Button>
            </Field>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}
