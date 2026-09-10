"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  User,
  ShoppingCart,
  Search,
  Heart,
  Menu,
  X,
  Trash2,
  MoveRight,
  LogIn,
  InfoIcon,
  Warehouse,
  UserRound,
  UserStar,
} from "lucide-react";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";
import axios from "axios";
import useCartStore from "@/store/useCartStore";
import useCart from "@/hooks/cart/useCart";
import { removeCartItemAction } from "@/actions/cart/useCartActions";
import { Spinner } from "./ui/spinner";
import { Alert, AlertTitle } from "./ui/alert";

function Navbar() {
  const router = useRouter();
  const params = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const isDebounce = useRef(false);
  const { data: session, status } = useSession();
  const [isRemoveLoading, setIsRemoveLoading] = useState("");

  const { cartItems, removeFromCart, cartTotal } = useCartStore();

  const { getCartItemsHandler } = useCart();

  // signout handler
  const signoutHandler = async () => {
    await signOut();
  };

  // get cart items and count
  
  useEffect(() => {
    getCartItemsHandler();
  }, []);

  // useEffect(() => {
  //   if (session) {
  //     console.log(session);
  //   }
  // }, [session]);

  // remove cart item
  const removeItem = async (id) => {
    if (!id || id?.toString().trim() == "") return;
    setIsRemoveLoading(id?.toString());
    try {
      const res = await removeCartItemAction(id);
      if (res?.success) {
        removeFromCart(id);
        getCartItemsHandler();
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsRemoveLoading("");
    }
  };

  // update url
const updateSearchInUrlHandler = (e) => {
  e.preventDefault();

  const newParams = new URLSearchParams();

  newParams.set("search", searchTerm);
  newParams.set("page", "1");

  router.push(`/shop?${newParams.toString()}`);
};

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      {/* ================= HEADER ================= */}
      <div className="h-[60px] flex items-center justify-between px-3 md:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          {/* MOBILE MENU BUTTON */}
          <Button
            onClick={() => setIsNavOpen(true)}
            variant="outline"
            size="icon"
            className="md:hidden"
          >
            <Menu />
          </Button>

          {/* LOGO */}
          <Link href="/" className="w-[100px] h-[40px]">
            <Image
              src="/b-logo.png"
              width={200}
              height={200}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </Link>
        </div>

        {/* SEARCH (DESKTOP) */}
        <div
          ref={searchRef}
          className="hidden md:block relative w-[400px] lg:w-[550px]"
        >
          <form className="flex" onSubmit={updateSearchInUrlHandler}>
            <Input
              placeholder="Search products..."
              className="rounded-l-md h-[40px]"
              // onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Button type="submit" className="rounded-r-md h-[40px]">
              <Search size={18} />
            </Button>
          </form>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* // modal with cart icon button */}
          <Sheet>
            <SheetTrigger asChild>
              <span className="relative cursor-pointer">
                <ShoppingCart />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1 rounded-full">
                  {cartItems.length}
                </span>
              </span>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription>Items you added</SheetDescription>
              </SheetHeader>
              <div className="h-full overflow-y-auto">
                <div className="h-full flex flex-col justify-between border-t">
                  <div className="p-3 flex flex-col gap-2">
                    {cartItems.length > 0 ? (
                      cartItems.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-lg border bg-secondary p-4 space-y-3"
                        >
                          {/* Product Name */}
                          <p className="font-medium break-words">
                            {item?.productId?.name?.toString().substring(0, 100)+" ..."}
                          </p>

                          {/* Bottom Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                <strong>Qty:</strong> {item?.qty}
                              </span>

                              <span>
                                <strong>Rs:</strong>{" "}
                                {item?.productId?.discountPrice}
                              </span>

                              {/* <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  item?.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : item?.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {item?.status || "Pending"}
                              </span> */}
                            </div>

                            <button
                              onClick={() => removeItem(item._id)}
                              disabled={isRemoveLoading === item._id.toString()}
                              className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                            >
                              {isRemoveLoading === item._id.toString() ? (
                                <Spinner />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Alert>
                        <InfoIcon />
                        <AlertTitle>Your cart is empty</AlertTitle>
                      </Alert>
                    )}
                  </div>
                  <div className="sticky bottom-0 left-0 bg-background p-3 border-t">
                    <div className="mb-2">
                      {/* // total */}
                      <span className="font-semibold text-sm">
                        Total : RS {cartTotal}
                      </span>
                    </div>
                    <Link href="/cart">
                      <Button className="w-full">
                        View Cart <MoveRight size={18} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {/* // modal with cart icon button */}

          <Link href="/wishlist" className="hidden md:block">
            <Heart />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src={session?.user?.avatar}
                    alt={session?.user?.username}
                  />
                  <AvatarFallback>
                    {session?.user?.username
                      ?.toString()
                      ?.substring(0, 1)
                      ?.toUpperCase() || "G"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              {session?.user ? (
                <>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/account")}>
                    <UserRound />
                    Your Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signoutHandler()}>
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => router.push("/auth/login")}>
                  <LogIn />
                  Login
                </DropdownMenuItem>
              )}

              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem
                className="whitespace-nowrap"
                onClick={() => router.push("/dashboard/auth/become-a-seller")}
              >
                <UserStar />
                Become A Seller
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= MOBILE SEARCH ================= */}
      <div className="md:hidden px-3 pb-2">
        <div className="flex">
          <Input
            placeholder="Search..."
            className="rounded-l-md"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Button className="rounded-r-md">
            <Search size={18} />
          </Button>
        </div>
      </div>

      {/* ================= DESKTOP NAV LINKS ================= */}
      <div className="hidden md:flex items-center gap-6 px-6 py-2 border-t">
        <Link href="/" className="hover:text-primary font-medium">
          Home
        </Link>
        <Link href="/shop" className="hover:text-primary font-medium">
          Shop
        </Link>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-[75%] sm:w-[60%] 
        bg-background shadow-lg z-50 transform transition-transform duration-300 
        ${isNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold">Menu</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsNavOpen(false)}
          >
            <X />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          <Link href="/" className="block hover:text-primary">
            Home
          </Link>
          <Link href="/" className="block hover:text-primary">
            Shop
          </Link>

          <div className="border-t pt-3 mt-3 space-y-2">
            <Link href="/wishlist" className="flex gap-2 items-center">
              <Heart /> Wishlist
            </Link>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {isNavOpen && (
        <div
          onClick={() => setIsNavOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    </nav>
  );
}

export default Navbar;
