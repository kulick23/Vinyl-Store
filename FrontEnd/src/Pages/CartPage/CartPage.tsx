import type React from "react"
import AuthGuard from "../../Components/AuthGuard/AuthGuard"
import Cart from "../../Components/Cart/Cart"

export const CartPage: React.FC = () => {
  return (
    <AuthGuard>
      <Cart />
    </AuthGuard>
  )
}

export default CartPage
