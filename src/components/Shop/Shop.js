import React, { useState } from 'react';
import '../../fakeData';
import fakeData from '../../fakeData';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    // const first10 = fakeData.slice(0, 10);
    const [products, setProducts] = useState(fakeData);
    const [cart, setCart] = useState([]);

   const handleAddProduct = (product) =>{
       console.log("handle is clicked.", product); 
       const newCart = [...cart, product];
       setCart(newCart);
   }

    return (
        <div className="shop-container">
            <div className="product-container">
                {
                    products.map(productIndividual => <Product handleAddProduct={handleAddProduct} product={productIndividual}></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;