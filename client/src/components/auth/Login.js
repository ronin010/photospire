import React, {Component, useState, useEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {Button} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import {login, loadUser} from "../../actions/authActions";
import {connect, useSelector, useDispatch} from "react-redux";
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Login(props) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(true);

  const isAuth = useSelector(state => state.auth.isAuthenticated)
  const visible = useSelector(state => state.auth.visible)
  const error = useSelector(state => state.auth.error);

  const emailHandler = (e) => {
    setEmail(e.target.value);
  }

  const passwordhandler = (e) => {
    setPassword(e.target.value);
  }

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        dispatch(loadUser(token));

        if (isAuth) {
          setLoading(false);
        }
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [dispatch])

  const submit = () => {
    dispatch(login(email, password));
  }

  if (isAuth) {
    return <Redirect to="/feed" />
  } else if (isLoading) {
    return <CircularProgress />
  } else {
    return (
      <div>
        <NavBar title="Register" />
        <div className="register-div">
          {
            error ?  <div className={visible?'fadeIn':'fadeOut'} id="error-div">
                      <Alert severity="error">{error}</Alert>
                    </div>
                  : null
          }
          <input onChange={emailHandler} name="email" type="text" className="register-input" placeholder="Email" />
          <input onChange={passwordhandler} name="password" type="password" className="register-input" placeholder="Password" />
          <Button onClick={submit} className="register-button" variant="outlined">Login</Button>
          <a style={{textAlign: "center", marginTop: "20px"}} href="/register">Need An Account?</a>
        </div>
      </div>
    )
  }
}
