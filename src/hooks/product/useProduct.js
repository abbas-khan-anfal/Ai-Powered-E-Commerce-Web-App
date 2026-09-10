'use client';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function useProducts() {

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getProductsHandler = async (page) => {
    setIsLoading(true);
    console.log("Page : ", page);
    console.log("Page type: ", typeof page);
    try {
      const { data } = await axios.get(`/api/product/get-products-dashboard?page=${page}`);
      console.log(data);
      if (data?.success) {
        setProducts(data?.products || []);
        setTotalPages(data?.totalPages || 0);
      } else {
        console.log(data?.message || "Something went wrong");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      console.log(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    products,
    totalPages,
    currentPage,
    setCurrentPage,
    getProductsHandler,
  };
}

export default useProducts;