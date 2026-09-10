'use client';
import { Alert, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import useCart from '@/hooks/cart/useCart';
import ChatSheet from './floating-chat';

function ProuctDetailsCard({product}) {

    const { addToCartHandler } = useCart();

    const [mainImage, setMainImage] = useState(product?.img_paths[0] || '/placeholder-img.png');
    const imageChangeHandler = async (img) => {
      if(!img) return;
      setMainImage(img);
    }

  return (
    <>
        {/* MAIN */}
              <div className="flex flex-col lg:flex-row gap-10 p-5">
                
                {/* LEFT - IMAGES */}
                <div className="w-full lg:max-w-lg">
                  <div className="h-[350px] sm:h-[400px] bg-muted rounded-xl mb-3">
                    {
                      // product?.img_paths?.length > 0
                      // ?
                      // (
                        <Image
                          src={mainImage}
                          width={500}
                          height={500}
                          alt="product"
                          className="w-full h-full object-contain rounded-xl"
                        />
                      // )
                      // :
                      // (
                      //   <Image
                      //     src="/placeholder-img.png"
                      //     width={500}
                      //     height={500}
                      //     alt="product"
                      //     className="w-full h-full object-cover rounded-xl"
                      //   />
                      // )
                    }
                  </div>
        
                  <div className="flex gap-2">
                    {
                      product?.img_paths?.length > 0
                      ?
                      (
                        product?.img_paths?.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            width={100}
                            height={100}
                            alt="thumb"
                            onClick={() => imageChangeHandler(img)}
                            // onClick={() => setActiveImg(img)}
                            className={`h-[60px] w-[60px] rounded-md cursor-pointer object-contain border-3  ${img === mainImage ? "border-primary" : "border-transparent ring-1 ring-muted-foreground"}`}
                          />
                        ))
                      )
                      :
                      (
        
                        <Alert>
                          <InfoIcon />
                          <AlertTitle>No Images Found</AlertTitle>
                        </Alert>
                      )
                    }
                  </div>
                </div>
        
                {/* RIGHT - DETAILS */}
                <div className="w-full lg:max-w-lg space-y-4">
                  
                  {/* Breadcrumb */}
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{product?.category?.name}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
        
                  {/* Info */}
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {product?.name || "Product Name"}
                    </h1>
        
                    {/* <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Brand:</span> Bata
                    </p> */}
        
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Category:</span> {product?.category?.name || "Category"}
                    </p>
        
                    <p className={`${product?.stock > 0 ? "text-success" : "text-destructive"} font-medium mt-1`}>{
                      product?.stock > 0 ? `In Stock (${product?.stock})` : `Out of Stock (${product?.stock})`
                      }</p>
                  </div>
        
                  {/* Quantity */}
                  {/* <div>
                    <p className="font-medium mb-2">Quantity</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => qty > 1 && setQty(qty - 1)}
                      >
                        <Minus size={16} />
                      </Button>
        
                      <Input
                        value={qty}
                        readOnly
                        className="w-[80px] text-center"
                      />
        
                      <Button
                        variant="outline"
                        onClick={() => setQty(qty + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div> */}
        
                  {/* Price */}
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      Rs. {product?.discountPrice}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      Rs. {product.price}
                    </p>
                  </div>
        
                  {/* Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full py-5" onClick={() => addToCartHandler(product?._id)}>
                      <ShoppingCart size={20} /> Add To Cart
                    </Button>
        
                    {/* <Button
                      variant="secondary"
                      className="w-full py-5"
                      onClick={() => setOpenChat(true)}
                    >
                      <Bot size={20} /> Ask AI About Product
                    </Button> */}
                    <ChatSheet product={product} />
                    
                  </div>
                </div>
              </div>
        
              {/* DESCRIPTION (FULL, no toggle) */}
              <div className="p-5 max-w-4xl">
                <h2 className="text-xl font-semibold mb-2">Product Details</h2>
                <p className="text-muted-foreground leading-7">
                  {product?.description}
                </p>
              </div>
    </>
  )
}

export default ProuctDetailsCard