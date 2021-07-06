import React, {Component} from "react";
import NavBar from "../Navigation/NavBar";
import {Button} from "@material-ui/core";
import GoogleLogin from "react-google-login";
import {connect} from "react-redux";
import {register, loadUser} from "../../actions/authActions";
import Alert from '@material-ui/lab/Alert';
import {compose} from "redux";
import {withRouter, Redirect} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleAuth from "./GoogleAuth";

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullName: "",
      userName: "",
      email: "",
      password: "",
      isLoading: true
    }
  }

  componentDidMount() {
    // try to load the token and userId if a current logged in user
    const token = localStorage.getItem("token")
    
    // if there is a token and userId present
    // attempt to load the user
    if (token) {
      setTimeout(() => {
        this.props.loadUser(token);
        // when the user is loaded and they are authenticated, stop loading
        if (this.props.isAuth) {
          this.setState({isLoading: false})
        }
      }, 1500)
    } else {
      // if there is no token, then stop loading instantly
      this.setState({isLoading: false})
    }
  }

  changeHandler = (e) => {
    this.setState({...this.state, [e.target.name]: e.target.value});
  }

  submit = () => {

    const {fullName, userName, email, password} = this.state;

    const user = {
      FullName: fullName,
      UserName: userName,
      Email: email,
      Password: password
    }

    this.props.register(user);
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
            <input onChange={this.changeHandler} name="fullName" type="text" className="register-input" placeholder="Full Name" />
            <input onChange={this.changeHandler} name="userName" type="text" className="register-input" placeholder="UserName" />
            <input onChange={this.changeHandler} name="email" type="text" className="register-input" placeholder="Email" />
            <input onChange={this.changeHandler} name="password" type="password" className="register-input" placeholder="Password" />
            <Button onClick={this.submit} className="register-button" variant="outlined" color="secondary">Register</Button>
            <a style={{textAlign: "center", marginTop: "20px"}} href="/login">Already Have An Account?</a>
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
  connect(mapStateToProps, {register, loadUser})
)(Register);