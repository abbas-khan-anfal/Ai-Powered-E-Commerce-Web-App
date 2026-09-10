"use client";
import * as React from "react";
import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { createUserAction } from "@/actions/user/create";

export default function Add() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const result = await createUserAction(formData);
      if (result?.success) {
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        setAvatar(null);
        setImage(null);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-start items-center gap-0.5 pb-5">
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

        <FieldLegend>Add New User</FieldLegend>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet className="text-4xl">
            <FieldDescription>Add a new user to the system</FieldDescription>

            <FieldGroup>
              <Field>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Avatar</label>

                  <div className="relative group w-[100px] h-[100px]">
                    {/* Avatar */}
                    <img
                      src={image || "https://github.com/shadcn.png"}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full border"
                    />

                    {/* Overlay */}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
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
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="role">User Role</FieldLabel>
                <Select
                  value={role}
                  onValueChange={setRole}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding User..." : "Add User"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
