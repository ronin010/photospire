import React, {useState, useEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {Button} from "@material-ui/core";
import {useSelector, useDispatch} from "react-redux";
import {register, loadUser} from "../../actions/authActions";
import Alert from '@material-ui/lab/Alert';
import {useHistory, Redirect} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Register(props) {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const history = useHistory();

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(true);

  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const visible = useSelector(state => state.auth.visible)
  const error = useSelector(state => state.auth.error)

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

  const nameHandler = (e) => {
    setFullName(e.target.value);
  }

  const userNameHandler = (e) => {
    setUserName(e.target.value);
  }

  const emailHandler = (e) => {
    setEmail(e.target.value);
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  }

  const submit = () => {
    const user = {
      FullName: fullName,
      UserName: userName,
      Email: email,
      Password: password
    }

    dispatch(register(user));
  }

  if (isAuth) {
    return <Redirect to="/feed" />
  }
     else if (isLoading) {
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
           
            <input onChange={nameHandler} name="fullName" type="text" className="register-input" placeholder="Full Name" />
            <input onChange={userNameHandler} name="userName" type="text" className="register-input" placeholder="UserName" />
            <input onChange={emailHandler} name="email" type="text" className="register-input" placeholder="Email" />
            <input onChange={passwordHandler} name="password" type="password" className="register-input" placeholder="Password" />
            <Button onClick={submit} className="register-button" variant="outlined" color="secondary">Register</Button>
            <a style={{textAlign: "center", marginTop: "20px"}} href="/login">Already Have An Account?</a>
          </div>
        </div>
      )
    }
}

