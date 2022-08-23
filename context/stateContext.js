import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        //Checking if the product is already in the cart
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        //Increasing the qty and total price if the product is in cart
        if(checkProductInCart) {
           
            //Updating the product in the cart
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    }
                }
            })
            setCartItems(updatedCartItems);
            toast.success(`${qty} ${product.name} add to the cart.`);
        } else {

            //Updating the product qty if we dont already have the product in the cart
            product.quantity = quantity;

            setCartItems([ ...cartItems, { ...product } ]);
            toast.success(`${qty} ${product.name} added to the cart.`);
        }
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
        toast.success(`An item has been removed from the cart.`);
        
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.find((product) => product._id === id);

        const newCartItems = cartItems.filter((item) => item._id !== id);

        if(value === 'increament') {
            setCartItems([ ...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if(value === 'decreament') {
            if(foundProduct.quantity > 1) {
                setCartItems([ ...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
            
        }
    }

    const increaseQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decreaseQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) {
                return 1
            }
            return prevQty - 1
        })
    }

    return (
        <Context.Provider value={{
            showCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            increaseQty,
            decreaseQty,
            onAdd,
            setShowCart,
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);