'use client';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useProfileStore from "@/store/useProfileStore";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Profile() {

    const setActiveTab = useProfileStore((state) => state.setActiveTab);
    const profile = useProfileStore((state) => state.profile);
    const setProfile = useProfileStore((state) => state.setProfile);
    const isLoading = useProfileStore((state) => state.isLoading);
    const setIsLoading = useProfileStore((state) => state.setIsLoading);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {
        !isLoading
        ?
        (
          profile
        ?
        (
          <>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>

              <p className="font-medium">{profile?.username}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>

              <p className="font-medium">{profile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Bio</p>

              <p className="font-medium">{profile?.bio}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Joined at</p>

              <p className="font-medium">{dayjs(profile?.createdAt).format("MMM D, YYYY")}</p>
            </div>
          </div>
          <div className="space-y-4 mt-5">
        <div className="border rounded-xl p-4 bg-background">
          <p className="text-sm text-muted-foreground mb-4">
            Update your account information and personal details.
          </p>

          <Button onClick={() => setActiveTab("edit-profile")}>
            Edit Profile
          </Button>
        </div>
      </div>
      </>
        )
        :
        (
          <div className="space-y-4 mt-5">
            <div className="border rounded-xl p-4 bg-background">
              <p className="text-sm text-muted-foreground mb-4">
                Something went wrong, please login to continue
              </p>
              <Link href="/auth/login">
                <Button>
                Login
              </Button>
              </Link>
            </div>
          </div>
        )
        )
        :
        (
          <Spinner className="size-15" />
        )
      }

    </div>
  );
}

export default Profile;
