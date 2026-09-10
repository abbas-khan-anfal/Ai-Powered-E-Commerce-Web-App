import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeletonLoading() {
  return (
    <div className="flex flex-col lg:flex-row gap-10 p-5">
      {/* LEFT - IMAGE */}
      <div className="w-full lg:max-w-lg">
        <Skeleton className="w-full h-[350px] sm:h-[400px] rounded-xl mb-3" />

        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[60px] w-[60px] rounded-md"
            />
          ))}
        </div>
      </div>

      {/* RIGHT - DETAILS */}
      <div className="w-full lg:max-w-lg space-y-5">
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-40" />

        {/* Title */}
        <Skeleton className="h-9 w-3/4" />

        {/* Category */}
        <Skeleton className="h-4 w-52" />

        {/* Stock */}
        <Skeleton className="h-4 w-32" />

        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-5 w-28" />
        </div>

        {/* Buttons */}
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}