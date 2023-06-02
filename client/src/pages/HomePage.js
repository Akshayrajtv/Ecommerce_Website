import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";
import { Button, Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    // Fetch all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            setCategories(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategories();
        getTotal();
    }, []);

    // Fetch all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data?.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    // Get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    // Load more products
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // Handle category filter
    const handleCategoryFilter = (value, id) => {
        let newChecked;
        if (value) {
            newChecked = [...checked, id];
        } else {
            newChecked = checked.filter((c) => c !== id);
        }
        setChecked(newChecked);
    };

    // Handle price filter
    const handlePriceFilter = (value) => {
        setRadio(value);
    };

    // Filter products
    const filterProducts = async () => {
        try {
            const { data } = await axios.post("/api/v1/product/product-filters", {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (checked.length || radio.length) {
            filterProducts();
        } else {
            getAllProducts();
        }
    }, [checked, radio]);

    return (
        <div>
            <Layout title="All Products - Best offers">
                <div className="container-fluid row mt-3">
                    <div className="col-md-2">
                        <h4 className="text-center">Filter By Category</h4>
                        <div className="d-flex flex-column">
                            {categories?.map((category) => (
                                <Checkbox
                                    key={category._id}
                                    onChange={(e) =>
                                        handleCategoryFilter(
                                            e.target.checked,
                                            category._id
                                        )
                                    }
                                >
                                    {category.name}
                                </Checkbox>
                            ))}
                        </div>

                        <h4 className="text-center mt-3">Filter By Price</h4>
                        <div className="d-flex flex-column">
                            <Radio.Group
                                onChange={(e) => handlePriceFilter(e.target.value)}
                                value={radio}
                            >
                                {Prices?.map((price) => (
                                    <Radio key={price._id} value={price.array}>
                                        {price.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                        <div className="d-flex flex-column mt-3">
                            <button
                                className="btn btn-danger"
                                onClick={() => window.location.reload()}
                            >
                                RESET FILTERS
                            </button>
                        </div>
                    </div>

                    <div className="col-md-9 ms-5">
                        <h1 className="text-center">All Products</h1>
                        <div className="d-flex flex-wrap">
                            {products?.map((product) => (
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
                                        <Button
                                            className="btn btn-primary ms-1"
                                            onClick={() => navigate(`/product/${product.slug}`)}
                                        >
                                            More Details
                                        </Button>
                                        <Button
                                            className="btn btn-secondary ms-1"
                                            onClick={() => {
                                                setCart([...cart, product]);
                                                localStorage.setItem('cart',JSON.stringify([...cart,product]))
                                                toast.success("Item Added to Cart");
                                            }}
                                        >
                                            Add to cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="m-2 p-3">
                            {products && products.length < total && (
                                <button
                                    className="btn btn-warning"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(page + 1);
                                    }}
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default HomePage;
