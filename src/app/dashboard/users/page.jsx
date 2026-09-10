"use client"
import { Pencil, Trash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
} from "@/components/ui/alert-dialog"
import toast from "react-hot-toast"
import { FieldLegend } from "@/components/ui/field"
import { deleteUserAction } from "@/actions/user/delete"
import useUser from "@/hooks/user/useUser"


export default function page() {
  
  const router = useRouter();

  const [deleteLoading, setDeleteLoading] = useState("");
  
  const {getUsersHandler, users, loading, totalPages, currentPage, setCurrentPage } = useUser();

  const handleEdit = (uId) => {
    router.push(`/dashboard/users/update-user/${uId}`);
  }

  const deleteHandler = async (userId) => {
    setDeleteLoading(userId);
    try
    {
      const result = await deleteUserAction(userId);
      if(result.success)
      {
        toast.success(result.message);
      }
      else
      {
        toast.error(result.message);
      }
    }
    catch(error)
    {
      console.log(error.message);
    }
    finally
    {
      setDeleteLoading("");
    }
  }


  useEffect(() => {
    getUsersHandler(currentPage);
  }, [currentPage]);

  const handlerPagination = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <>
    <div className="flex justify-between items-center">
      <FieldLegend>Add New User</FieldLegend>
      <Button onClick={() => router.push('/dashboard/users/add-user')}>
        <Plus/>
        Add New User
      </Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {
          !loading
          ?
          (
            users
            .map((u, i) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium">{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(u._id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Delete Button with dialogu box */}
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button size="icon" variant="outline">
                        {
                          deleteLoading && deleteLoading.toString() === u?._id.toString()
                          ?
                          <Spinner className="h-4 w-4" />
                          :
                          <Trash className="h-4 w-4" />
                        }
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you really sure to delete this user?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete user account and it's data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteHandler(u._id.toString())} className=" bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* Delete Button with dialogu box */}
                </TableCell>
              </TableRow>
            ))
          )
          :
          (
            <TableRow>
              <TableCell colSpan={4}>
                <span className="border flex justify-center items-center p-2"><Spinner className="h-10 w-10" /></span>
              </TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>

      <Pagination className="mt-3">
        <PaginationContent>

          {/* Prev */}
          <PaginationItem
            onClick={() => currentPage > 1 && handlerPagination(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          )
            .filter(
              (page) =>
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) <= 1
            )
            .map((page) => (
              <PaginationItem key={page} onClick={() => handlerPagination(page)}>
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
            onClick={() => currentPage < totalPages && handlerPagination(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          >
            <PaginationNext href="#" />
          </PaginationItem>

        </PaginationContent>
      </Pagination>

    </>
  )
}
