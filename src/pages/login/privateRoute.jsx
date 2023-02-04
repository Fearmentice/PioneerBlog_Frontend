import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { db } from "../../firebase-config";
import {getDoc, doc, } from "firebase/firestore";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        userInfo();
    }, [])


    const userInfo = async() => {
        if(!localStorage.getItem("jwtToken")) return;
        const docRef = doc(db, "users", localStorage.getItem("jwtToken"));
        const docSnap = await getDoc(docRef);
        const user = docSnap.data();
        setUser(user);
      }

    return (
        <Route { ...rest } render={ props => (
            localStorage.getItem('role') == 'admin' ? 
            <Component {...props} /> : 
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        ) }
        />
    );
};