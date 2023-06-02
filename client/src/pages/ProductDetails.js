import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";


const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
  

    // Get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(
                `/api/v1/product/get-product/${params.slug}`
            );
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (params.slug) {
            getProduct();
        }
    }, [params.slug]);

    //get similar products
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(
                `/api/v1/product/related-product/${pid}/${cid}`
            );
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 mt-2">
                    <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        height={300}
                        width={350}
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="text-center">Product Details</h1>
                    <h6>Name: {product.name}</h6>
                    <h6>Description: {product.description}</h6>
                    <h6>Price: ₹ {product.price}</h6>
                    <h6>Category: {product.category?.name}</h6>{" "}
                    {/* Access category name */}
                    <button className="btn btn-secondary ms-1">
                        Add to cart
                    </button>
                </div>
            </div>
            <hr />
            <div className="row container">
                <h4>Similar products</h4>
                {relatedProducts.length<1 && (<p className="text-center">No Similar products found</p>)}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.map((product) => (
                        <div
                            className="card m-2"
                            style={{ width: "18rem" }}
                            key={product._id}
                        >
                            <img
                                src={`/api/v1/product/product-photo/${product._id}`}
                                className="card-img-top"
                                alt={product.name}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    {product.description.substring(0, 30)}
                                    ...
                                </p>
                                <p className="card-text">₹ {product.price}</p>
                                
                                <button className="btn btn-secondary ms-1">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
