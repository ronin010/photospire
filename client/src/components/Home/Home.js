import React, {Component} from "react";
import NavBar from "../Navigation/NavBar";
import {Typography, Button} from "@material-ui/core";
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {withRouter, Redirect} from "react-router-dom";
import {loadUser} from "../../actions/authActions";
import {connect} from "react-redux";
import {compose} from "redux";
import CircularProgress from '@material-ui/core/CircularProgress';

const theme = createMuiTheme({
  palette: {
    main: "white"
  },
});

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
      {/* redirect to the profile of the current loaded user */ }
      {/* the userId is loaded from local storage after the user is loaded */}
      return <Redirect to={`/profile/${this.props.user.UserName}`} />
    } else if (this.state.isLoading) {
      return <div className="lds-ripple"><div></div><div></div></div>
    } else {
      return (
        <div>
          <div className="home-div">
          <NavBar />
            <Typography variant="h4" style={{borderBottom: "2px solid #f50057", width: "300px", textAlign: "center", margin: "125px auto 10px auto"}}>
              PhotoSpire
            </Typography>
            <Typography variant="h6">
                Capture Your Inspiration
            </Typography>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "70px"}}>
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