import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../fakeData';
// import fakeData from '../../fakeData';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    // const first10 = fakeData.slice(0, 10);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    // get products from database instead of fakeData
    useEffect( () => {
        fetch('https://protected-thicket-07134.herokuapp.com/products')
        .then(res => res.json())
        .then(data => setProducts(data))
    }, [])

    const handleAddProduct = (product) => {
        //    console.log("handle is clicked.", product); 
        const toBeAddedKey = product.key;
        const sameProduct = cart.find(pd => pd.key === product.key);
        let newCart;
        let count = 1;
        if (sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAddedKey);
            newCart = [...others, sameProduct];
            
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count);
    }

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        console.log(products);
        fetch('https://protected-thicket-07134.herokuapp.com/productsByKeys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
        
    }, [])

    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    products.map(productIndividual => <Product showAddToCart={true} handleAddProduct={handleAddProduct} product={productIndividual} key={productIndividual.key}></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to="/review"><button className="main-button">Review order</button></Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;