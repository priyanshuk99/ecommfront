import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { isAutheticated } from '../auth/helper';
import Base from '../core/Base';
import { getCategory, updateCategory } from './helper/adminapicall';


const UpdateCategory = ({ match }) => {

    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false)

    const { user, token } = isAutheticated();

    const goBack = () => (
        <div className="mt-5">
            <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
        </div>
    )

    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                setName(data.name)
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId)
    }, []);

    const handleChange = event => {
        setError("")
        setName(event.target.value)
    }

    const onSubmit = event => {
        event.preventDefault();
        setError("");
        setSuccess(false)
        console.log({ name });
        //backend request fired
        updateCategory(match.params.categoryId, user._id, token, { name })
            .then(data => {
                if (data.error) {
                    setError(true)
                } else {
                    setError("");
                    setSuccess(true)
                    setName(data.name)
                }
            })
    }

    const successMessage = () => {
        if (success) {
            return <h4 className="text-success">Category updated successfully</h4>
        }
    }

    const warningMessage = () => {
        if (error) {
            return <h4 className="text-danger">Failed to update category</h4>
        }
    }

    const myCategoryForm = () => {
        return (
            <form>
                <div className="form-group">
                    <p className="lead">Update the category</p>
                    <input type="text"
                        className="form-control my-3"
                        onChange={handleChange}
                        value={name}
                        autoFocus
                        required
                        placeholder="For ex. Summer"
                        name="" id="" />
                    <button onClick={onSubmit} className="btn btn-outline-info mb-3">Update Category</button>
                </div>
            </form>
        )
    }
    return (
        <Base title="Create a category here" description="Add a new category for new T-shirts"
            className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {goBack()}
                    {myCategoryForm()}
                </div>
            </div>
        </Base>
    )
}
export default UpdateCategory;