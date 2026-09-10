import { create } from 'zustand';

const useAuthStore = create((set) => ({
    email : "",
    setEmail : (email) => set({email : email}),
    password : "",
    setPassword : (password) => set({password : password}),
    confirmPassword : "",
    setConfirmPassword : (confirmPassword) => set({confirmPassword : confirmPassword}),
    otp : "",
    setOtp : (otp) => set({otp : otp}),
}));

export default useAuthStore;