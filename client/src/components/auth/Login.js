import React, {Component} from "react";
import NavBar from "../Navigation/NavBar";
import {Button} from "@material-ui/core";
import GoogleLogin from "react-google-login";
import Alert from '@material-ui/lab/Alert';
import {login, loadUser, googleLogin} from "../../actions/authActions";
import {connect} from "react-redux";
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleAuth from "./GoogleAuth";

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      isLoading: true
    }
  }

  changeHandler = (e) => {
    this.setState({...this.state, [e.target.name]: e.target.value});
  }

  submit = () => {
    const {email, password} = this.state;

    this.props.login(email, password);
  }

  componentDidMount() {
    // try to load the token and userId if a current logged in user
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    
    // if there is a token and userId present
    // attempt to load the user
    if (token && userId) {
      setTimeout(() => {
        this.props.loadUser(token, userId);
        // when the user is loaded and they are authenticated, stop loading
        if (this.props.isAuth) {
          this.setState({isLoading: false})
        }
      }, 1000)
    } else {
      // if there is no token, then stop loading instantly
      this.setState({isLoading: false})
    }
  }

  render() {
    if (this.props.isAuth) {
      {/* redirect to the profile of the current loaded user */ }
      {/* the userId is loaded from local storage after the user is loaded */}
      return <Redirect to={`/profile/${this.props.user.UserName}`} />
    } else if (this.state.isLoading) {
      return <CircularProgress />
    } else {
      return (
        <div>
          <NavBar title="Register" />
          <div className="register-div">
            <div className="google-login-div">
              <GoogleAuth />
            </div>  
            <div className={this.props.visible?'fadeIn':'fadeOut'} id="error-div">
              <Alert severity="error">{this.props.error}</Alert>
            </div>
            <input onChange={this.changeHandler} name="email" type="text" className="register-input" placeholder="Email" />
            <input onChange={this.changeHandler} name="password" type="password" className="register-input" placeholder="Password" />
            <Button onClick={this.submit} className="register-button" variant="outlined">Login</Button>
            <a style={{textAlign: "center", marginTop: "20px"}} href="/register">Need An Account?</a>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  error: state.auth.error,
  visible: state.auth.visible,
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
})

export default compose(
  withRouter,
  connect(mapStateToProps, {login, loadUser})
)(Login);