import React, {Component} from "react";
import NavBar from "../NavBar";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import axios from "axios";
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Avatar} from "@material-ui/core";
import { withStyles} from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = (theme) => ({
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
});

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "",
      images: [],
      profileImage: ""
    }
  }

  componentDidMount() {
    if (!this.props.isAuth) {
      this.props.history.push("/");
    }

    if (typeof this.props.user.profileImage !== "undefined" && this.props.user.profileImage !== null) {
      this.setState({profileImage: this.props.user.profileImage.data})
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const config = {
      headers: {
        "Authorization": "Bearer " + token
      }
    }

    axios.get(`/api/images/load-feed/${userId}`, config)
        .then((res) => this.setState({images: res.data}))
        .catch((err) => this.setState({message: err.response.data.message}));
  }

  test = () => {
    console.log("test");
  }

  render() {

    return (
      <div>
        <NavBar title="PhotoSpire" />
        <h4>{this.state.message}</h4>
        <div className="add-post" onClick={this.test}>
          <div className="user-avatar">
            <Avatar src={`data:image/gif;base64,${this.state.profileImage}`} className={this.props.classes.large} />
          </div>
          <div className="post-button">
            <AddBoxIcon />
            <h3 className="add-text post-button">Add Post</h3>
          </div>
        </div>
        <div className="main-feed">
          {
            this.state.images.map((image, idx) => (
                <div key={idx} className="image-div">
                  <div className="image-postedby">
                    <h3>{image.postedBy}</h3>
                  </div>
                  <img src={`data:image/gif;base64,${image.image.data}`} className="follower-image"/>
                  <h4 className="post-header">{image.title}</h4>
                </div>
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAuth: state.auth.isAuthenticated
})

export default compose (
    withRouter,
    connect(mapStateToProps, {}),
    withStyles(styles, {withTheme: true})
)(Dashboard);