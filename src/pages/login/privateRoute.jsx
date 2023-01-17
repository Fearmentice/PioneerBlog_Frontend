import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route { ...rest } render={ props => (
            localStorage.getItem("jwtToken") ? 
            <Component {...props} /> : 
            <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
        ) }
        />
    );
};