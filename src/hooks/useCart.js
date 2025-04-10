import { useState, useEffect, useMemo } from "react"
import  { db }  from '../data/db.js'

export const useCart = () => {

     const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [data] = useState(db);
      const [ cart, setCart ] = useState(initialCart);
    
      const MIN_ITEMS = 1;
      const MAX_ITEMS = 5;
    
      useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
      }, [cart])
    
      
      //Para agregagar productos a un carrito de compras
    
      function addToCart(item) {
        const itemExist = cart.findIndex( guitar => guitar.id === item.id)
        if (itemExist >= 0) { // ya existe el carrito
          if(cart[itemExist].quantity >= MAX_ITEMS) return
          const updateCart = [...cart]
          updateCart[itemExist].quantity++
          setCart(updateCart);
    
        } else {
          item.quantity = 1
          setCart([...cart, item]);
        } 
      }
    
      function removeFromCart(id) {
        setCart(prevCart => prevCart.filter( guitar => guitar.id !== id))
      }
    
      function increaseQuantity(id) {
        const updateCart = cart.map(item => {
          if(item.id === id && item.quantity < MAX_ITEMS) {
           return {
            ...item,
            quantity: item.quantity + 1
           }
          }
          return item
        })
        setCart(updateCart)
      }
    
      function decreaseQuantity(id) {
        const updateCart = cart.map(item => {
          if (item.id === id && item.quantity > MIN_ITEMS) {
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updateCart)
      
      }
    
      function clearCart() {
        setCart([])
      }

       // State devivado
  const isEmpty = useMemo( () => cart.length === 0, [cart])
  const cartTotal = useMemo( () => cart.reduce( (total, item) => total + (item.quantity * item.price), 0 ), [cart])
    
    
   return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
   }
}
