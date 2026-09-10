"use client";
import { useState } from "react";
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
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
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
import toast from "react-hot-toast";
import { FieldLegend } from "@/components/ui/field";
import { deleteProductAction } from "@/actions/product/delete";
import useProducts from "@/hooks/product/useProduct";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function ProductsPage() {
  const router = useRouter();

  const [deleteLoad, setDeleteLoad] = useState("");
  const {
    getProductsHandler,
    products,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useProducts();

  const handleEdit = (pid) => {
    router.push(`/dashboard/products/update-product/${pid}`);
  };

  // delete category
  const deleteProductHandler = async (proId) => {
    setDeleteLoad(proId);
    try {
      const result = await deleteProductAction(proId);
      if (result.success) {
        toast.success(result.message);
        // fetch products
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          getProductsHandler(currentPage);
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
    getProductsHandler(currentPage);
  }, [currentPage]);

  const handlerPagination = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <FieldLegend>Products</FieldLegend>
        <Button onClick={() => router.push("/dashboard/products/add-product")}>
          <Plus className="mr-2" />
          Add New Product
        </Button>
      </div>

      {
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Original Price</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Stock</TableHead>
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
            ) : products.length > 0 ? (
              products.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    {item?.name?.toString().substring(0, 15) + "..."}
                  </TableCell>
                  <TableCell>
                    {item?.description?.toString().substring(0, 25) + "..."}
                  </TableCell>
                  <TableCell>{item?.price?.toString()}</TableCell>
                  <TableCell>{item?.discountPrice?.toString()}</TableCell>
                  <TableCell>{item?.stock?.toString()}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(item._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete Button with dialogu box */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button size="icon" variant="outline">
                          {deleteLoad.toString() === item?._id?.toString() ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you really sure to delete this product?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteProductHandler(item._id?.toString())
                            }
                            className=" bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {/* Delete Button with dialogu box */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <Alert>
                    <InfoIcon />
                    <AlertTitle>No Products Found</AlertTitle>
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      }

      {products?.length !== 0 && (
        <Pagination className="mt-3">
          <PaginationContent>
            {/* Prev */}
            <PaginationItem
              onClick={() =>
                currentPage > 1 && handlerPagination(currentPage - 1)
              }
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              <PaginationPrevious href="#" />
            </PaginationItem>

            {/* 1 */}
            <PaginationItem onClick={() => handlerPagination(1)}>
              <PaginationLink isActive={currentPage === 1} href="#">
                1
              </PaginationLink>
            </PaginationItem>

            {/* Left Ellipsis */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Middle pages: currentPage -1, currentPage, currentPage +1 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) <= 1,
              )
              .map((page) => (
                <PaginationItem
                  key={page}
                  onClick={() => handlerPagination(page)}
                >
                  <PaginationLink isActive={page === currentPage} href="#">
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {/* Right Ellipsis */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last */}
            {totalPages > 1 && (
              <PaginationItem onClick={() => handlerPagination(totalPages)}>
                <PaginationLink isActive={currentPage === totalPages} href="#">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next */}
            <PaginationItem
              onClick={() =>
                currentPage < totalPages && handlerPagination(currentPage + 1)
              }
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
