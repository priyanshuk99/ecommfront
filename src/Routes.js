import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import ManageCategories from './admin/ManageCategories';
import ManageProducts from './admin/ManageProducts';
import UpdateCategory from './admin/UpdateCategory';
import UpdateProduct from './admin/UpdateProduct';
import AdminRoute from './auth/helper/AdminRoutes';
import PrivateRoute from './auth/helper/PrivateRoutes';
import Home from './core/Home'
import AdminDashBoard from './user/AdminDashBoard';
import Signin from './user/Signin';
import Signup from './user/Signup';
import UserDashBoard from './user/UserDashBoard';
import Cart from "./core/Cart";


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/signin' component={Signin} />
                <Route path="/cart" exact component={Cart} />
                <PrivateRoute exact path='/user/dashboard' component={UserDashBoard} />
                <AdminRoute exact path='/admin/dashboard' component={AdminDashBoard} />
                <AdminRoute exact path='/admin/create/category' component={AddCategory} />
                <AdminRoute exact path='/admin/categories' component={ManageCategories} />
                <AdminRoute exact path='/admin/create/product' component={AddProduct} />
                <AdminRoute exact path='/admin/products' component={ManageProducts} />
                <AdminRoute exact path='/admin/product/update/:productId' component={UpdateProduct} />
                <AdminRoute exact path='/admin/category/update/:categoryId' component={UpdateCategory} />

            </Switch>
        </BrowserRouter>
    )
}