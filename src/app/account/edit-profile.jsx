'use client';
import { editProfileAction } from "@/actions/user/frontend-user/useUserAction";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useProfileStore from "@/store/useProfileStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EditProfile() {

  const email = useProfileStore(state => state.email);
  const bio = useProfileStore(state => state.bio);
  const setBio = useProfileStore(state => state.setBio);
  const username = useProfileStore(state => state.username);
  const setUsername = useProfileStore(state => state.setUsername);
  const avatar = useProfileStore(state => state.avatar);
  const setAvatar = useProfileStore(state => state.setAvatar);
  const isLoading = useProfileStore(state => state.isLoading);
  const setIsLoading = useProfileStore(state => state.setIsLoading);

  // loadings
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try
    {
      const res = await editProfileAction(formData);
      if (res.success) {
        toast.success(res.message);
        window.location.reload();
      }
      else
      {
        toast.error(res.message);
      }
    }
    catch(error)
    {
      console.log(error.message);
    }
    finally
    {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Username</FieldLabel>
          <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} disabled={isLoading} />
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
        <Input placeholder="Email Address" disabled={true} value={email} />
        <FieldDescription>Email is not changing</FieldDescription>
        </div>

        <div>
          <FieldLabel>Bio</FieldLabel>
        <Textarea placeholder="Bio" disabled={isLoading} onChange={(e) => setBio(e.target.value)} value={bio} />
        </div>

        <div>
          <FieldLabel>Upload New Profile Avatar</FieldLabel>
          <Input type="file" onChange={(e) => setAvatar(e.target.files[0])}/>
        </div>
      </div>

      {/* <div className="mt-4">
        <Input placeholder="Address" />
      </div> */}

      <Button type="submit" disabled={isLoading} className="mt-5 disabled:bg-pink-200">
        {isUpdating ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}

export default EditProfile;
