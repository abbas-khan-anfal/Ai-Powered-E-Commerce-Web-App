import { create } from "zustand";

const useAdminAuthStore = create((set) => ({
    dashboardUser : null,
    setDashboardUser : (user) => set({dashboardUser : user}),
}));

export default useAdminAuthStore;