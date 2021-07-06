import React, {useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {loadUser} from "../../actions/authActions";
import SettingsIcon from '@material-ui/icons/Settings';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import Image from "../Images/Image";
import UserStats from "./UserStats";
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => createStyles({
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

const Profile = (props) => {
  const [profile, setProfile] = useState({});
  const AuthUser = useSelector(state => state.auth.user);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const {username} = useParams();
  const token = localStorage.getItem("token");
  const classes = useStyles();
  const history = useHistory();

  const imagePath = `/uploads/${username}/avatar.jpg`
  const pngPath = `/uploads/${username}/avatar.png`

  const BASE_URL = ""
  
  useEffect(() => {
    dispatch(loadUser(token));

    axios.get(`${BASE_URL}/api/users/profile/${username}`)
      .then((response) => {
        let user = response.data.user;
        setProfile(user)
        setLoading(false)
      })
      .catch((err) => console.log(err));
  }, [dispatch])

  const loadUploadPage = () => {
    history.push(`/${AuthUser.UserName}/add-image`)
  }

  if (isLoading) {
    return (
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    )
  } else {
    return (
      <div>
        <NavBar title="PhotoSpire"/>
        <div className="profile-header">
          <Avatar className={classes.large} src={`/uploads/${username}/avatar.jpg`} />
          <div className="text-info">
            <h3 className="name-header">
              {profile.FullName}
            </h3>
          </div>
        </div>
        <div className="profile-stats">   
          <UserStats number={profile.Images.length} title="Posts" />
          <UserStats number={0} title="Tags" />
          <UserStats number={0} title="Liked" />
        </div>    
        <div 
          className="edit-button" 
          style={{display: profile._id === AuthUser._id ? "flex" : "none"}}
          onClick={() => history.push(`/user/${profile.UserName}/edit`)}
        >
          <span style={{opacity: "0.8"}}>Edit Profile</span>
        </div>

        <div className="images">
          {
            profile.Images.length < 1 ? <h4 style={{margin: "0 auto"}}>No Posts Yet</h4> :

            profile.Images.map((image, idx) => (
                <Image key={idx} filename={image.FileName} username={username} />
            ))
          }
        </div>
      </div>
    )
  }
}

export default Profile;