import React, {useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import {Avatar, Button} from '@material-ui/core';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {loadUser, followUser, unfollowerUser, loadProfile} from "../../actions/authActions";
import Image from "../Images/Image";
import UserStats from "./UserStats";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import FollowModal from "./FollowModal";

const useStyles = makeStyles((theme) => createStyles({
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

const Profile = (props) => {
  const profile = useSelector(state => state.auth.profile)
  const AuthUser = useSelector(state => state.auth.user);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {username} = useParams();
  const token = localStorage.getItem("token");
  const classes = useStyles();
  const history = useHistory();
  const isFollowing = useSelector(state => state.auth.isFollowing);
  const [type, setType] = useState("followers");
  const [open, setOpen] = useState(false);

  const followerLength = useSelector(state => state.images.followerLength);
  const followingLength = useSelector(state => state.images.followingLength);
    
  useEffect(() => {
    setLoading(true)
    dispatch(loadUser(token));

   setTimeout(() => {
    dispatch(loadProfile(token, username))
    setLoading(false);
   }, 2000)
  }, [dispatch])

  const follow = () => {
    dispatch(followUser(username, AuthUser.UserName, token));
  }

  const unfollow = () => {
    dispatch(unfollowerUser(username, AuthUser.UserName, token));
  }

  const clickHandler = (type) => {
    setType(type);
    setOpen(true);
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
        <div className="follow-button-div">
        {
          profile.UserName !== AuthUser.UserName ? 

          isFollowing ? 
            <Button className="follow-button" onClick={unfollow} color="secondary" variant="contained">
              Following &#10004;
            </Button>
            :
            <Button className="follow-button" onClick={follow} color="secondary" variant="outlined">
              Follow
            </Button>
            :
            null
        }  
        </div>
        <div>   
          {
            Object.entries(profile).length > 0 ? 
              <div className="profile-stats">
                <UserStats number={profile.Images.length} title="Posts" /> 
                <UserStats onClickFunc={() => clickHandler("followers")} number={followerLength} title="Followers" />
                <UserStats onClickFunc={() => clickHandler("following")} number={followingLength} title="Following" />
                <FollowModal type={type} open={open} handleClose={() => setOpen(false)} user={profile} />
              </div >
              
              :
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
              <div className="lds-ripple"><div></div><div></div></div>
            </div>
          }
         
        </div>   
        <div className="edit-button-div">
          <div 
            className="edit-button" 
            style={{display: profile._id === AuthUser._id ? "flex" : "none"}}
            onClick={() => history.push(`/user/${profile.UserName}/edit`)}
          >
            <span style={{opacity: "0.8"}}>Edit Profile</span>
          </div>
        </div> 
        <div className="images profile-images">
          {
            Object.entries(profile).length > 0 ?
            profile.Images.length < 1 ? <h4 className="posts-header">No Posts Yet</h4> :

            profile.Images.map((image, idx) => (
                <Image key={idx} filename={image.FileName} username={username} />
            ))
            : 

            <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
              <div className="lds-ripple"><div></div><div></div></div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Profile;