import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { getProduct, updateProduct, getAllCategories } from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper";

const UpdateProduct = ({ match }) => {

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
        updatedProduct: "",
        getaRedirect: false,
        formData: ""
    });

    const { name, description, price, stock, photo, categories, category, loading, error, updatedProduct, getaRedirect, formData } = values;

    const preload = (productId) => {
        getProduct(productId).then(data => {
            console.log(data);
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock,
                    category: data.category._id,
                    formData: new FormData()
                })
                preloadCategories()
            }
        })
    }

    const preloadCategories = () => {
        getAllCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({ categories: data, formData: new FormData() })
            }
        })
    }


    useEffect(() => {
        preload(match.params.productId)
    }, []);

    //TODO: we will work on this
    const onUpdate = (event) => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true })
        updateProduct(match.params.productId, user._id, token, formData).then(data => {
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
                    updatedProduct: data.name,
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
            style={{ display: updatedProduct ? "" : "none" }}>
            <h4>{updatedProduct} Updated successfully</h4>
        </div>
    )

    const errorMessage = () => (
        <div className="alert alert-danger mt-3"
            style={{ display: error ? "" : "none" }}>
            <h4>Product updation failed</h4>
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
                onClick={onUpdate}
                className="btn btn-outline-success mb-3"
            >
                Update Product
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
                    {performRedirect()}

                </div>
            </div>
        </Base>
    );
};

export default UpdateProduct;
