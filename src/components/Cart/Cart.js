import React from 'react';

const Cart = (props) => {
    console.log("cart: ", props);
    const cart = props.cart;

    // item price
    const total = cart.reduce( (total, product) => total+product.price , 0);

    // shipping
    let shipping = 0;
    if(total>35) shipping = 0;
    else if(total > 15) shipping = 4.99;
    else if(total > 0) shipping = 12.99;

    // tax
    const tax = (total * 0.1).toFixed(2);

    // grandTotal
    const grandTotal = (total + shipping + Number(tax)).toFixed(2);
    

    return (
        <div>
            <h1>Order Summary</h1>
            <h3>Items ordered: {cart.length}</h3>
            <p>Item: {total}</p>
            <p>Shipping: {shipping}</p>
            <p>Tax: {tax}</p>
            <p>Total: {grandTotal}</p>
        </div>
    );
};

export default Cart;