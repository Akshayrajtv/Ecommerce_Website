import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    //total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price;
            });
            return total.toFixed(2);
        } catch (error) {
            console.log(error);
        }
    };

    // Delete items from the cart
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1); // Fix: Use splice instead of slice
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-center bg-light p-2">
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className="text-center">
                            {cart?.length > 0
                                ? `You have ${cart.length} item${
                                      cart.length > 1 ? "s" : ""
                                  } in your cart ${
                                      auth?.token
                                          ? ""
                                          : ": Please login to checkout"
                                  }`
                                : "Cart is empty"}
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        {cart?.map((product) => (
                            <div
                                className="row mb-2 card flex-row p-2"
                                key={product._id}
                            >
                                <div className="col-md-4">
                                    {" "}
                                    <img
                                        src={`/api/v1/product/product-photo/${product._id}`}
                                        className="card-img-top"
                                        alt={product.name}
                                        width={150}
                                        height={150}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <h5>{product.name}</h5>
                                    <p>
                                        {product.description.substring(0, 30)}
                                    </p>
                                    <p>
                                        Price: <b>₹{product.price}</b>
                                    </p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            removeCartItem(product._id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4 text-center">
                        <h4>Cart Summary</h4>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4> Total : ₹{totalPrice()}</h4>
                        {auth?.user?.address?(
                          <>
                          <div className="mb-3">
                            <h4>Current Address</h4>
                            <h5>{auth?.user?.address}</h5>
                            <button className="btn btn-outline-warning" onClick={()=>navigate('/dashboard/user/profile')}>Update Address</button>
                          </div>
                          </>

                        ):(
                          <div className="mb-3">
                            {auth?.token?(
                              <button className="btn btn-outline-warning" onClick={()=>navigate('/dashboard/user/profile')}>Update Profile</button>
                            ):(
                              <button className="btn btn-outline-warning" onClick={()=>navigate('/login')}>Please Login to checkout</button>
                            )}
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
