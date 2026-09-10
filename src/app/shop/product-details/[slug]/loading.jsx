import React from 'react'
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Spinner } from '@/components/ui/spinner';
import ProductSkeletonLoading from './skeletonLoading';

function loading() {
  return (
    <>
      <Navbar />
        <ProductSkeletonLoading />
      <Footer />
    </>
  )
}

export default loading