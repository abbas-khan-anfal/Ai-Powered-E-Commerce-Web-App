"use client";
import { useEffect, useState } from "react";
import { User, Package } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Profile from "./profile";
import EditProfile from "./edit-profile";
import Orders from "./orders";
import useProfileStore from "@/store/useProfileStore";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "orders",
    label: "Orders",
    icon: Package,
  },
];

export default function CustomerProfilePage() {
  const activeTab = useProfileStore((state) => state.activeTab);
  const setActiveTab = useProfileStore((state) => state.setActiveTab);
  const email = useProfileStore((state) => state.email);
  const setEmail = useProfileStore((state) => state.setEmail);
  const bio = useProfileStore((state) => state.bio);
  const setBio = useProfileStore((state) => state.setBio);
  const username = useProfileStore((state) => state.username);
  const setUsername = useProfileStore((state) => state.setUsername);
  const avatar = useProfileStore((state) => state.avatar);
  const setAvatar = useProfileStore((state) => state.setAvatar);
  const isLoading = useProfileStore((state) => state.isLoading);
  const setIsLoading = useProfileStore((state) => state.setIsLoading);
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const display_avatar = useProfileStore((state) => state.display_avatar);
  const setDisplay_avatar = useProfileStore((state) => state.setDisplay_avatar);

  const getUserHandler = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/user/get-user");
      setProfile(res?.data?.user);
      setEmail(res?.data?.user?.email);
      setUsername(res?.data?.user?.username);
      setBio(res?.data?.user?.bio);
      setDisplay_avatar(res?.data?.user?.avatar_path);
    } catch (error) {
      console.log(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserHandler();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background p-5">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="bg-muted rounded-2xl p-5 h-fit">
            {/* USER */}
            <div className="flex flex-col items-center text-center border-b pb-5 mb-5">
              {!isLoading ? (
                <>
                  {
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage src={profile?.avatar_path} alt={profile?.username} />
                      <AvatarFallback>{profile?.username?.toString()?.substring(0, 1)?.toUpperCase() || "G"}</AvatarFallback>
                    </Avatar>
                  }

                  <h2 className="font-semibold text-lg">{profile?.username}</h2>

                  <p className="text-sm text-muted-foreground">
                    {profile?.email}
                  </p>
                </>
              ) : (
                <Spinner className="size-15" />
              )}
            </div>

            {/* TABS */}
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3 bg-muted rounded-2xl p-6">
            {/* PROFILE */}
            {activeTab === "profile" && <Profile />}

            {/* ORDERS */}
            {activeTab === "orders" && <Orders />}

            {/* EDIT PROFILE */}
            {activeTab === "edit-profile" && <EditProfile />}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
