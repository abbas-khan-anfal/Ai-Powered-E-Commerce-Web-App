import { create } from 'zustand';

const useCartStore = create((set) => ({
    cartItems : [],
    setCartItems : (items) => set({cartItems : items}),
    addToCart : (item) => set((state) => ({cartItems : [...state.cartItems, item]})),
    removeFromCart : (itemId) => set((state) => ({cartItems : state.cartItems.filter((cartItem) => cartItem._id !== itemId)})),
    cartTotal : 0,
    setCartTotal : (total) => set({cartTotal : total}),
    isLoading : true,
    setIsLoading : (loading) => set({isLoading : loading}),
}));

export default useCartStore;