import { Alert, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Star } from "lucide-react";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function ReviewCard({ productReviews }) {
  return (
    <div className="p-5 max-w-4xl">
      <h2 className="text-xl font-semibold mb-6">Product Reviews {`(${productReviews?.length || ""})`}</h2>

      <div className="space-y-5">
        {/* Review Card */}
        {productReviews?.length > 0 ? (
          productReviews?.map((currReview, i) => (
            <div key={i+1} className="border rounded-xl p-4 bg-background mb-3">
              <div className="flex items-start gap-4">
                {/* Avatar */}

                <Avatar>
                  {currReview?.userId?.avatar_path && currReview?.userId?.avatar_path?.trim() !== "" ? (
                    <AvatarImage src={currReview?.userId?.avatar_path} alt={currReview?.userId?.username} />
                  ) : (
                    <AvatarFallback>
                      {currReview?.userId?.username?.toString()?.substring(0, 1)?.toUpperCase() || "G"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1">
                  {/* Name + Stars */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {currReview?.userId?.username}
                    </h3>

                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const fill =
                          Math.min(Math.max(currReview?.rating - idx, 0), 1) *
                          100;

                        return (
                          <div key={idx} className="relative">
                            <Star size={14} className="text-gray-300" />
                            <div
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{ width: `${fill}%` }}
                            >
                              <Star
                                size={14}
                                className="text-yellow-400 fill-yellow-400"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground mt-2 leading-7">
                    {currReview?.review}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Alert>
            <InfoIcon />
            <AlertTitle>No Reviews Found For This Product</AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
