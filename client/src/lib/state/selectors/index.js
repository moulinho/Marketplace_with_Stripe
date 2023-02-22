
export const calculateTotal = ($0, $1) => $0 + $1;
const selectItems = state => state.cart.items
export const selectDeliveryCost = state => state.cart?.delivery === "fast" ? 20.00 : 0.00
export const selectCartTotal = state => {
    const subTotal = selectItems(state).map(item => item.price * item.quantity).reduce(calculateTotal, 0) 
    const shippingCost = selectDeliveryCost(state)
    return subTotal + shippingCost
}