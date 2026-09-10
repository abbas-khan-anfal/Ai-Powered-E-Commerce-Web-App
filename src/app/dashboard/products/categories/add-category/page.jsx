"use client";
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
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createCategoryAction } from "@/actions/category/create";

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createCategoryAction({ name, description });
      if (result?.success) {
        setName("");
        setDescription("");
        toast.success(result.message);
      } else {
        toast.error(result?.message);
      }
    } catch (err) {
      toast.err(err?.message);
    } finally {
      setIsLoading(false);
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

              <FieldLegend>Add Category</FieldLegend>
            </div>

            <FieldDescription>Enter category details</FieldDescription>

            <Field>
              <FieldLabel>Category Name</FieldLabel>
              <Input
                placeholder="e.g. Electronics"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </Field>

            <Field>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Category"}
              </Button>
            </Field>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}
