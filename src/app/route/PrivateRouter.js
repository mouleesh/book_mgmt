import React, {Component} from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute ({component: Component, ...rest}) {
    return (<Route {...rest} render={(props) => (localStorage.getItem('username')) 
        ? <Component {...props} /> 
        : <Redirect to = {{pathname : "/"}}/>}
        />
        );
}