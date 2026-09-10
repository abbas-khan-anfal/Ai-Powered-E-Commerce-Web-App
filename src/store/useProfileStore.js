import { create } from "zustand";

const useProfileStore = create((set) => ({
    activeTab : "profile",
    setActiveTab : (tab) => set({activeTab : tab}),
    profile : null,
    setProfile : (profile) => set({profile : profile}),
    isLoading : true,
    setIsLoading : (loading) => set({isLoading : loading}),
    email : "",
    setEmail : (email) => set({email : email}),
    username : "",
    setUsername : (username) => set({username : username}),
    bio : "",
    setBio : (bio) => set({bio : bio}),
    avatar : null,
    setAvatar : (avatar) => set({avatar : avatar}),
    display_avatar : "",
    setDisplay_avatar : (display_avatar) => set({display_avatar : display_avatar}),
}));

export default useProfileStore;