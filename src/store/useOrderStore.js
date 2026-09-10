import { create } from 'zustand';

const useOrderStore = create((set) => ({
    fullName : "",
    setFullName : (name) => set({fullName : name}),
    email : "",
    setEmail : (email) => set({email : email}),
    phone : "",
    setPhone : (phone) => set({phone : phone}),
    city : "",
    setCity : (city) => set({city : city}),
    country : "pakistan",
    setCountry : (country) => set({country : country}),
    address1 : "",
    setAddress1 : (address1) => set({address1 : address1}),
    address2 : "",
    setAddress2 : (address2) => set({address2 : address2}),
    paymentMethod : "cod",
    setPaymentMethod : (method) => set({paymentMethod : method}),
    isLoading : false,
    setIsLoading : (loading) => set({isLoading : loading}),
}));

export default useOrderStore;