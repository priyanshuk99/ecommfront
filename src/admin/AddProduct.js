import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { createaProduct, getAllCategories } from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper";

const AddProduct = () => {

    const { user, token } = isAutheticated()

    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getaRedirect: false,
        formData: {}
    });

    const { name, description, price, stock, photo, categories, category, loading, error, createdProduct, getaRedirect, formData } = values;

    const preload = () => {
        getAllCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, categories: data, formData: new FormData() })
            }
        })
    }

    useEffect(() => {
        preload()
    }, []);

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true })
        createaProduct(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    photo: "",
                    stock: "",
                    loading: false,
                    createdProduct: data.name,
                    getaRedirect: true
                })
            }
        })
    };

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({ ...values, [name]: value })
    };

    const successMessage = () => (
        <div className="alert alert-success mt-3"
            style={{ display: createdProduct ? "" : "none" }}>
            <h4>{createdProduct} created successfully</h4>
        </div>
    )

    const errorMessage = () => (
        <div className="alert alert-danger mt-3"
            style={{ display: error ? "" : "none" }}>
            <h4>Product creation failed</h4>
        </div>
    )

    const performRedirect = () => {
        if (getaRedirect) {
            return <Redirect to="/admin/dashboard" />
        }
    }
    const createProductForm = () => (
        <form>
            <span>Post photo</span>
            <div className="form-group mb-3">
                <label className="btn btn-block btn-success">
                    <input
                        className="form-control"
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group mb-3">
                <input
                    onChange={handleChange("name")}
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group mb-3">
                <textarea
                    onChange={handleChange("description")}
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group mb-3">
                <input
                    onChange={handleChange("price")}
                    name="price"
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group mb-3">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories &&
                        categories.map((cate, index) => (
                            <option key={index} value={cate._id}>{cate.name}</option>
                        ))}
                </select>
            </div>
            <div className="form-group mb-3">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    value={stock}
                />
            </div>

            <button
                type="submit"
                onClick={onSubmit}
                className="btn btn-outline-success mb-3"
            >
                Create Product
            </button>
        </form>
    );

    return (
        <Base
            title="Add a product here!"
            description="Welcome to product creation section"
            className="container bg-info p-4"
        >
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
                Admin Home
            </Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {createProductForm()}
                    {setInterval(() => {
                        performRedirect()
                    }, 2000)}

                </div>
            </div>
        </Base>
    );
};

export default AddProduct;
