import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { db } from "../../firebase-config";
import {getDoc, doc, } from "firebase/firestore";

export const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route { ...rest } render={ props => (
            localStorage.getItem('role') == 'admin' ? 
            <Component {...props} /> : 
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        ) }
        />
    );
};