"use client";
import { Pencil, Trash, Plus, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { deleteCategoryAction } from "@/actions/category/delete";
import { FieldLegend } from "@/components/ui/field";
import useCategory from "@/hooks/category/useCategory";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function CategoryPage() {
  const router = useRouter();

  const [deleteLoad, setDeleteLoad] = useState("");

  const {
    getCategoriesHandler,
    categories,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
  } = useCategory();

  // delete category
  const deleteCategoryHandler = async (catId) => {
    setDeleteLoad(catId);
    try {
      const result = await deleteCategoryAction(catId);
      if (result.success) {
        toast.success(result.message);
        // fetch categories
        if (categories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          getCategoriesHandler(currentPage);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setDeleteLoad("");
    }
  };

  useEffect(() => {
    getCategoriesHandler(currentPage);
  }, [currentPage]);

  const handlerPagination = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <FieldLegend>All Categories</FieldLegend>
        <Button
          type="button"
          onClick={() =>
            router.push("/dashboard/products/categories/add-category")
          }
        >
          <Plus /> Add New Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Total Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="flex justify-center p-4">
                <Spinner className="h-10 w-10" />
              </TableCell>
            </TableRow>
          ) : categories.length > 0 ? (
            categories?.map((c) => (
              <TableRow key={c._id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell className="text-right">{c.totalProducts}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/products/categories/update-category/${c?._id}`,
                      )
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="icon" variant="outline">
                        {deleteLoad?.toString() === c._id?.toString() ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this category?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteCategoryHandler(c?._id?.toString())
                          }
                          className="bg-red-500 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                <Alert>
                  <InfoIcon />
                  <AlertTitle>No Category Found</AlertTitle>
                </Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {categories?.length !== 0 && (
        <Pagination className="mt-3">
          <PaginationContent>
            <PaginationItem
              onClick={() => handlerPagination(currentPage - 1)}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              <PaginationPrevious href="#" />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p} onClick={() => handlerPagination(p)}>
                <PaginationLink isActive={p === currentPage} href="#">
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem
              onClick={() => handlerPagination(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

// <Alert>
//               <InfoIcon />
//               <AlertTitle>No Orders Found</AlertTitle>
//             </Alert>

// <TableRow>
//               <TableCell colSpan={4} className="flex justify-center p-4">
//                 <Spinner className="h-10 w-10" />
//               </TableCell>
//             </TableRow>
