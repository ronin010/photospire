import React, {Component} from "react";
import NavBar from "../Navigation/NavBar";
import {connect} from "react-redux";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import NoMatch from "../Navigation/NoMatch";
import {Button, Avatar} from "@material-ui/core";
import { withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {updateUser, loadUser, setError} from "../../actions/authActions";
import FormData from 'form-data'
import Alert from '@material-ui/lab/Alert';
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";


const styles = (theme) => ({
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
});

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      email: "",
      fullName: "",
      userName: "",
      profileImage: null,
      accountType: "",
      newProfileImage: null
    }
  }

  componentDidMount() {

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Authorization": token
      }
    }

    setTimeout(() => {
      const BASE_URL = ""
      this.props.loadUser(token);
      axios.get(`${BASE_URL}/api/users/`, config)
          .then((response) => {
            // delete the password from the user response object
            // this stops the password from being stored with Redux
            // the token is stored, then deleted from the object so it isn't stored in redux
            delete response.data.password

            const {user} = response.data;
            this.setState({
              email: user.Email,
              fullName: user.FullName,
              userName: user.UserName,
              accountType: user.AccountType,
              profileImage: user.ProfileImage,
              isLoading: false
            })
          })
          .catch((err) => console.log(err));
    }, 1000)
  }

  onTextChange = (e) => {
    this.setState({...this.state, [e.target.name]: e.target.value});
  }

  onImageChange = (e) => {
    this.setState({
      newProfileImage: e.target.files[0], 
      profileImage: URL.createObjectURL(e.target.files[0])
    });
  }

  cancel = () => {
    this.props.history.goBack();
  }

  saveChanges = () => {
    this.setState({isLoading: true})

    let {email, fullName, userName, newProfileImage} = this.state;

    const body = {
      Email: email,
      FullName: fullName,
      UserName: userName
    }

    const token = localStorage.getItem("token");
   
    this.props.updateUser(body, token, newProfileImage);

    setTimeout(() => {   
        this.setState({isLoading: false})
        this.props.history.push(`/profile/${this.props.user.UserName}`);
       
    }, 3000)
  }

  	render() {
    	const {profileImage, newProfileImage} = this.state;
    	const {user} = this.props;

    	if (this.state.isLoading) {
      		return (
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
              <div className="lds-ripple"><div></div><div></div></div>
            </div>
          )
    	} else {
      		return (
        		<div>
          				<NavBar title="Edit Profile" />
          <div className="profile-image-div">
            <Avatar
              className={this.props.classes.large}
              src={
                profileImage == null ? `/uploads/${this.props.user.UserName}/avatar.jpg` : profileImage
              }
            />
            <input
              id="new-profile-picture"
              multiple
              type="file"
              style={{display: "none"}}
              onChange={this.onImageChange}
            />
            <label htmlFor="new-profile-picture">
              <Button className="upload-button" variant="outlined" component="span">
                Change
              </Button>
            </label>
          </div>
          <div className="edit-error">
            {
              this.props.errorMsg ? <Alert severity="error">{this.props.errorMsg}</Alert> : null
            }
          </div>
          <div className="edit-fields">
            {
              this.state.accountType !== "google" ?
                <div className="field-div">
                  <h3 className="field-header">Email Address</h3>
                  <input
                    className="edit-input"
                    onChange={this.onTextChange}
                    type="text"
                    name="email"
                    value={this.state.email}
                  />
                </div> : null
            }
            <div className="field-div">
              <h3 className="field-header">FullName</h3>
              <input
                className="edit-input"
                onChange={this.onTextChange}
                type="text"
                name="fullName"
                value={this.state.fullName}
              />
            </div>
            <div className="field-div">
              <h3 className="field-header">UserName</h3>
              <input
                className="edit-input"
                onChange={this.onTextChange}
                type="text"
                name="userName"
                value={this.state.userName}
              />
            </div>
            <div className="password-div">
              <a style={{textAlign: "center"}} href="/password-reset">Want To Reset Password?</a>
            </div>
          </div>
          <div className="save-div">
            <Button onClick={this.saveChanges} className="save-button" variant="outlined">
              Save
            </Button>
            <Button onClick={this.cancel} className="save-button" variant="outlined">
              Cancel
            </Button>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user,
  errorMsg: state.auth.error
})

export default compose (
    withRouter,
    connect(mapStateToProps, {updateUser, loadUser, setError}),
    withStyles(styles, { withTheme: true }),
)(EditProfile);
