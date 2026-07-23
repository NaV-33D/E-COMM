import { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_BASE_URL;
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);

    //Fetch Cart form BE
    const fetchCart = async () => {
        try {
            const res = await authFetch(`${BASEURL}api/cart/`)
            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);
                // console.log(data); 
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    const fetchWishlist = async () => {
    try {
        const res = await authFetch(`${BASEURL}api/wishlist/`);
        const data = await res.json();

        setWishlistItems(data.items || []);
    } catch (error) {
        console.error(error);
    }
};

    useEffect(() => {
        fetchCart();
        fetchWishlist();

    }, []);

    const addToWishlist = async (productId) => {
    try {
        await authFetch(`${BASEURL}api/wishlist/add/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_id: productId,
            }),
        });

        fetchWishlist();

    } catch (error) {
        console.error(error);
    }
};

const removeFromWishlist = async (itemId) => {
    try {
        await authFetch(`${BASEURL}api/wishlist/remove/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                item_id: itemId,
            }),
        });

        fetchWishlist();

    } catch (error) {
        console.error(error);
    }
};

    //Add Product to Cart
    const addToCart = async (productId) => {
        const existingItem = cartItems.find((item) => item.product === productId);
        if (existingItem) {
            await updateQuantity(existingItem.id, existingItem.quantity + 1);
            return;
        }
        try{
            const response = await authFetch(`${BASEURL}api/cart/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product_id: productId }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not add item to cart");
            fetchCart();
            toast.success("Added to cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error(error.message);
        }
    }

    //Remove Product from Cart
    const removeFromCart = async (itemId) => {
        try{
            await authFetch(`${BASEURL}api/cart/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }

    //Update Quantity
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1){
            await removeFromCart(itemId);
            return;
        }
        try{
            const response = await authFetch(`${BASEURL}api/cart/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not update quantity");
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error(error.message);
        }
    }

    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    }

    return (
        <CartContext.Provider
value={{ cartItems, total, wishlistItems, addToWishlist, removeFromWishlist, addToCart, removeFromCart, updateQuantity, clearCart, }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
