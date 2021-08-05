import React, {Component} from "react"
import {AppBar, Toolbar, IconButton, Typography, Drawer} from "@material-ui/core"
import {Menu} from "@material-ui/icons";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {compose} from "redux";
import {logout} from "../../actions/authActions";
import NavLinks from "./NavLinks";
import AuthLinks from "./AuthLinks";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import {setImage} from "../../actions/imageActions";

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  setOpen = () => {
    this.setState({isOpen: true});
  }

  setClose = () => {
    this.setState({isOpen: false});
  }

  routeToPage = (page) => {
    this.props.history.push(page);
  }

  onImageChange = (e) => {
    this.props.setImage(e.target.files[0], URL.createObjectURL(e.target.files[0]))
    this.props.history.push(`/${this.props.user.UserName}/add-image`)
  }

  render() {
    return (
      <div style={{position: "sticky", top: "0", zIndex: "10"}}>
        <AppBar position="static" style={{background: "#00070c"}}>
          <Toolbar>
            <IconButton style={{color: "white"}} onClick={this.setOpen} edge="start" arial-label="menu" >
              <Menu />
            </IconButton>
            <div onClick={() => this.props.history.push("/feed")} className="page-header" style={{flexGrow: 1, marginTop: "5px", cursor: "pointer"}}>
              <Typography variant="h5" style={{textAlign: "center", color: "white"}}>
                PhotoSpire
              </Typography>
            </div>
            {
              this.props.isAuth ? 
              <div>
                <input
                  id="contained-button-file"
                  multiple
                  type="file"
                  style={{display: "none"}}
                  onChange={this.onImageChange}
                />
                <label className="upload-label" style={{cursor: "pointer"}} htmlFor="contained-button-file">
                  <h4 className="upload-text">Upload</h4>
                  <CameraAltIcon />

                </label>
              </div>
              : null
            }  
          </Toolbar>
        </AppBar>
         <Drawer 
          anchor="left"
          open={this.state.isOpen}
          onClose={this.setClose}
        >
          <div className="drawer-div">
            <div className="drawer-header">
              <Typography variant="h5">
                PhotoSpire
              </Typography>
            </div>
            {
              this.props.isAuth ? 
                <AuthLinks />
                  :
                <NavLinks />
            }
          </div>
        </Drawer>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
})

export default compose(
  withRouter,
  connect(mapStateToProps, {logout, setImage})
)(NavBar);
