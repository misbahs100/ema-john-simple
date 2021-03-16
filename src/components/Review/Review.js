import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
// import Product from '../Product/Product';
import happyGif from '../../images/giphy.gif';

const Review = () => {
    const [cart, setCart] = useState([]);
    const [placedOrder, setPlacedOrder] = useState(false);
    const history = useHistory();
    const handleProceedCheckout = () => {
        history.push("/shipment");
       
    }
     
    let thankYou;
    if(placedOrder){
        thankYou = <img src={happyGif} alt=""/>
    }

    const handleRemoveItem = (productKey) => {
        console.log('remove clicked');
        const newCart = cart.filter(pd => pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKey = Object.keys(savedCart);
        // console.log(productKey);

        const cartProducts = productKey.map(key => {
            const product = fakeData.find(pd => pd.key === key)
            product.quantity = savedCart[key];  // adding a quantity property to product object
            return product;
        })
        console.log(cartProducts);
        setCart(cartProducts);


    }, [])


    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    // cart.map(pd => <Product product={pd}></Product>);   // i can do that tooo
                    cart.map(pd => <ReviewItem handleRemoveItem={handleRemoveItem} product={pd} key={pd.key}></ReviewItem>)
                }
                {
                    thankYou
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link><button className="main-button" onClick={handleProceedCheckout}>Proceed Checkout</button></Link>
                </Cart>
            </div>
        </div>
    );
};

export default Review;