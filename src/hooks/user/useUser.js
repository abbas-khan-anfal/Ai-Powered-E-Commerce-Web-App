'use client';
import axios from 'axios';
import React, { useState } from 'react'

function useUser() {

    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

  const getUsersHandler = async (page) => {
    setLoading(true);
    try
    {
        const res = await axios.get(`/api/user/get-users?page=${page}`);
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 0);
    }
    catch(error)
    {
        console.log(error?.message);
    }
    finally
    {
        setLoading(false);
    }
  }

  return {
    users,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    getUsersHandler
  }

}

export default useUser