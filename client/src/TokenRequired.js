import React from 'react';
import { Redirect, Route } from "react-router-dom";

function TokenRequired({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem("token") ? (
            <Redirect
            to={{
              pathname: "/feed",
              state: { from: location }
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}
export default TokenRequired;