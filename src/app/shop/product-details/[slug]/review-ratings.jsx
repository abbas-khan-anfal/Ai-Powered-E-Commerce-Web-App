"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

function ReviewAndRatings({ productId }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!review || review?.trim() == "") return;
    if (!productId) return;
    const formData = { review, rating, productId };

    setIsLoading(true);
    try {
      const res = await axios.post(
        "/api/product/add-review",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setReview("");
        setRating(0);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-4xl w-full max-w-md">
      {user ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Write your review</h2>
          <form className="flex flex-col gap-2" onSubmit={submitHandler}>
            <div>
              <Label className="mb-2">Write Your Review</Label>
              <Textarea
                rows={4}
                onChange={(e) => setReview(e.target.value)}
                value={review}
              />
            </div>
            <div>
              <Label className="mb-2">Give Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer transition ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ReviewAndRatings;
