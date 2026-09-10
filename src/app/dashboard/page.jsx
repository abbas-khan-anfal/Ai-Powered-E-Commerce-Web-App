'use client';
import { SellerBarChart } from '@/components/chart/seller-chart';
import { SectionCards } from '@/components/section-cards'
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function page() {

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); 
  const [totalOrders, setTotalOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCatalogHandler = async () => {
    setIsLoading(true);
    try
    {
      const res = await axios.get('/api/catalog');
      if(res?.data?.success)
      {
        setTotalProducts(res?.data?.totalProducts);
        setTotalCategories(res?.data?.totalCategories);
        setTotalUsers(res?.data?.totalUsers);
        setTotalOrders(res.data.totalOrders);
      }
    }
    catch (error)
    {
      console.log(error);
    }
    finally
    {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCatalogHandler();
  }, []);

  return (
    <div>
      {
        isLoading
        ?
        (
          <div className="col-span-full py-5 flex justify-center items-center">
            <Spinner className="size-10" />
          </div>
        )
        :
        (
          <>
            <SectionCards 
            totalProducts={totalProducts} 
            totalCategories={totalCategories}
            orders={totalOrders} 
            totalUsers={totalUsers}
            />
            {/* <SellerBarChart orders={totalOrders} /> */}
          </>
        )
      }
    </div>
  )
}

export default page