import React, {Component} from "react";
import GoogleLogin from "react-google-login";
import {connect, useDispatch} from "react-redux";
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import {googleLogin} from "../../actions/authActions";
import axios from "axios";

function GoogleAuth(props) {
  const dispatch = useDispatch();

  const responseGoogle = (response) => {
    const {givenName, familyName, email} = response.profileObj;

    const body = {
      firstName: givenName,
      lastName: familyName,
      email
    }

    axios.post("/api/users/google", body)
    .then((res) => {
      this.props.googleLogin(res.data);

    })
    .catch((err) => console.log(err));
  }

  const failureResponse = (response) => {
    console.log(response);
  }

  return (
    <div>
      <GoogleLogin 
        clientId="241327774156-p3lga8b20m4pah7s0nf5a4lnml45ubr5.apps.googleusercontent.com"
        buttonText="Continue with Google"
        onSuccess={responseGoogle}
        onFailure={failureResponse}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  )
}

export default GoogleAuth;