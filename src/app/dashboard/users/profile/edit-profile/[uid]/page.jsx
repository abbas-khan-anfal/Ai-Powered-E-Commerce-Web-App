"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, Camera } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { updateUserAction } from "@/actions/user/update";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAdminAuthStore from "@/store/useAdminAuthStore";

export default function Update() {
  const { uid } = useParams();
  const router = useRouter();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isShowRole, setIsShowRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");
  const dashboardUser = useAdminAuthStore(state => state.dashboardUser);

  // our roles
  const availableRoles = ["admin", 'seller'];

  const loadUserHandler = async () => {
    setIsLoading(true);
    try
    {
        const res = await axios.get(`/api/user/get-user?uid=${uid}`);
        if(res?.data?.success)
        {
            setUsername(res.data.user.username);
            if(res.data.user.role && res.data.user.role === "admin")
            {
                setRole(res.data.user.role);
                setIsShowRole(res.data.user.role);
            }
            setBio(res.data.user.bio);
            if(res.data?.user?.avatar_path)
            {
                setImage(res.data.user.avatar_path);
            }
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

  // Load user data
  useEffect(() => {
    loadUserHandler();
  }, [uid]);

  useEffect(() => {
    if(dashboardUser && dashboardUser?.role !== "admin")
    {
      router.back();
    }
  }, [dashboardUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    const formData = new FormData();
    if(!uid)
    {
      toast.error("Something went wrong! reload the page.");
      return;
    }
    formData.append("uid", uid);
    formData.append("username", username);
    formData.append("role", role);
    formData.append("bio", bio);
    if (password) {
      formData.append("password", password);
    }
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try
    {
      const res = await updateUserAction(formData);
      if (res.success) {
        toast.success("Profile updated successfully");
        router.push("/dashboard/users/profile");
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
      setUpdateLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setImage(URL.createObjectURL(file));
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
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

              <FieldLegend>Edit Profile</FieldLegend>
            </div>

            <FieldDescription>Edit your profile</FieldDescription>

            {/* AVATAR */}
            <Field>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Avatar</label>

                  <div className="relative group w-24 h-24">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={image}
                        alt="Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>

                    <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Camera className="text-white" size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                </div>
              </Field>
            {/* NAME */}
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                placeholder="Enter name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={updateLoading || isLoading}
              />
            </Field>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea placeholder="Enter your bio" value={bio} onChange={(e) => setBio(e.target.value)} disabled={updateLoading || isLoading}/>
              <FieldDescription>Maximum 200 characters</FieldDescription>
            </Field>

            {/* PASSWORD */}
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                placeholder="Enter new password (optional)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={updateLoading || isLoading}
              />
              <FieldDescription className="text-success">Leave empty to keep existing password</FieldDescription>
            </Field>

            {/* ROLE */}
            {
              isShowRole && isShowRole === "admin" && (
                <Field>
              <FieldLabel>Role</FieldLabel>

              <Select value={role} onValueChange={setRole} disabled={updateLoading || isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {availableRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
              )
            }


            <Field>
              <Button type="submit" className="w-full mt-4" disabled={updateLoading || isLoading}>
                {updateLoading ? "Updating..." : "Update"}
              </Button>
            </Field>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}
