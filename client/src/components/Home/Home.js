import React, {Component} from "react";
import NavBar from "../Navigation/NavBar";
import {Typography} from "@material-ui/core";
import {withRouter, Redirect} from "react-router-dom";
import {loadUser} from "../../actions/authActions";
import {connect} from "react-redux";
import {compose} from "redux";

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  routeToPage = (page) => {
    this.props.history.push(page);
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
      }, 2000)
    } else {
      // if there is no token, then stop loading instantly
      this.setState({isLoading: false})
    }
  }

  render() {
    if (this.props.isAuth) {
      return <Redirect to="/feed" />
    } else if (this.state.isLoading) {
      return <div className="lds-ripple"><div></div><div></div></div>
    } else {
      return (
        
        <div className="home-div">
        <NavBar />
          <h2 className="home-header">
            PhotoSpire
          </h2>
          <h3 className="moto">
              Capture Your Inspiration
          </h3>  
          <div className="home-buttons">
            <button onClick={() => this.routeToPage("/register")} className="register-link">
              Create Free Account
            </button>
            <Typography variant="h6">
            Or
            </Typography>
            <button onClick={() => this.routeToPage("/login")} className="register-link">
              Login With Account
            </button>
          </div>
        </div>
       
      )
    }
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
})

export default compose(
  withRouter,
  connect(mapStateToProps, {loadUser})
)(Home);