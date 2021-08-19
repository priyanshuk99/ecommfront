import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAutheticated } from '../auth/helper'
import { cartEmpty, loadCart } from './helper/cartHelper'
import StripeCheckoutButton from "react-stripe-checkout"
import { API } from '../backend'
import { createOrder } from './helper/orderHelper'


const StripeCheckout = ({ products, setReload = f => f, reload = undefined }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })

    const userId = isAutheticated() && isAutheticated().user._id
    const usertoken = isAutheticated() && isAutheticated().token

    const getFinalAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount + p.price;
        })
        return amount;
    }
    const makePayment = (token) => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log(response)
            //write further methods such as create_order
            const { status } = response;
            console.log("STATUS", status)

            const orderData = {
                products: products,
                transaction_id: response.id,
                amount: response.amount
            }
            console.log(token);
            createOrder(userId, usertoken, orderData)

            cartEmpty(() => {
                console.log("Crash?????");
            })
            setReload(!reload)
        })
            .catch(err => console.log(err))
    }

    const showStripeButton = () => {
        return isAutheticated() ? (
            <StripeCheckoutButton
                stripeKey={process.env.REACT_APP_STRIPEKEY}
                token={makePayment}
                amount={getFinalAmount() * 100}
                name="Buy T-shirts"
                shippingAddress
                billingAddress
                currency="INR"
            >
                <button className="btn btn-success">Pay with stripe</button>
            </StripeCheckoutButton >
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Signin</button>
            </Link>
        )
    }


    return (
        <div>
            <h3 className="text-white">Stripe checkout {getFinalAmount()}</h3>
            {showStripeButton()}
        </div>
    )
}

export default StripeCheckout
