import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import fakeData from '../../fakeData';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product, setProduct] = useState({});

    useEffect( () => {
        fetch('https://protected-thicket-07134.herokuapp.com/product/' + productKey)
        .then(res => res.json())
        .then(data => setProduct(data));
    }, [productKey])
    // const product = fakeData.find(pd => pd.key === productKey);
    console.log(product);
    return (
        <div>
            <h1>This is {productKey} detail</h1>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;