"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useCategory() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getCategoriesHandler = async (page) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/category/get-categories?page=${page}&limit=${3}`);

      if (data?.success) {
        setCategories(data?.categories || []);
        setTotalPages(data?.totalPages || 0);
      } else {
        console.log(data?.message);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };


  return {
    isLoading,
    categories,
    totalPages,
    currentPage,
    setCurrentPage,
    getCategoriesHandler,
  };
}
