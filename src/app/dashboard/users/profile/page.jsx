'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { FieldLegend } from '@/components/ui/field';
import { User } from 'lucide-react';
import axios from 'axios';
import useAdminAuthStore from '@/store/useAdminAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';

function page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const dashboardUser = useAdminAuthStore(state => state.dashboardUser);

    const loadUserHandler = async (uid) => {
    setIsLoading(true);
    try
    {
        const res = await axios.get(`/api/user/get-user?uid=${uid}`);
        if(res?.data?.success)
        {
          // console.log(res.data.user);
          setLoggedInUser(res.data.user);
        }
        else
        {
          console.log(res.data.message);
        }
    }
    catch(error)
    {
      console.log(error.message);
    }
    finally
    {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(dashboardUser)
    {
      loadUserHandler(dashboardUser?._id);
    }
  }, [dashboardUser]);
  
  return (
    <div className='w-full max-w-md'>
        <div className='flex justify-start items-center gap-0.5 pb-5'>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Go Back"
                className="mr-2"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon />
              </Button>

              <FieldLegend>Profile</FieldLegend>
            </div>
        {
          isLoading
          ?
          (
            <div className='p-5'>
              <Spinner className="size-10" />
            </div>
          )
          :
          (
            <>
              <div className='mb-3'>
            <p className='text-foreground font-medium text-sm mb-2'>Profile Photo</p>
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-muted">
                  {
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={loggedInUser?.avatar_path}
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-sm text-center">No Photo Uploaded</AvatarFallback>
                    </Avatar>
                  }
            </div>
        </div>

        <div className='mb-3'>
          <p className='text-foreground font-medium text-sm mb-2'>Email</p>
          <p className='text-base text-muted-foreground'>{loggedInUser?.email}</p>
        </div>

        <div className='mb-3'>
          <p className='text-foreground font-medium text-sm mb-2'>Username</p>
          <p className='text-base text-muted-foreground'>{loggedInUser?.username}</p>
        </div>

        <div className='mb-3'>
          <p className='text-foreground font-medium text-sm mb-2'>Bio</p>
          <p className='text-base text-muted-foreground text-justify'>{loggedInUser?.bio}</p>
        </div>

        <div className='mb-3'>
          <Button className="disabled:opacity-50 disabled:cursor-not-allowed" disabled={loggedInUser?.role !== "admin"} onClick={() => router.push(`/dashboard/users/profile/edit-profile/${loggedInUser?._id}`)} >Edit Profile</Button>
          {
            loggedInUser?.role !== 'admin' && (
              <p className='text-sm text-muted-foreground mt-2 text-red-400'>Only admin can edit user profile.</p>
            )
          }
        </div>
            </>
          )
        }
        
    </div>
  )
}

export default page;