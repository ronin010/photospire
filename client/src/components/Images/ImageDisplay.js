import React, {useEffect, useState, useLayoutEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {useHistory, useParams} from "react-router-dom";
import { loadImage, deleteImage, addLikes } from "../../actions/imageActions";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/authActions";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Avatar from '@material-ui/core/Avatar';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { TextareaAutosize, Button } from "@material-ui/core";
import ImageDataBox from "./ImageDataBox";
import Comment from "../Comments/Comment";
import ImageDataModal from "./ImageDataModal";
import AddComment from "../Comments/AddComment";
import DeleteImageModal from "./DeleteImageModal";
import axios from "axios";

export default function ImageDisplay(props) {
  const {username, filename} = useParams();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const image = useSelector(state => state.images.currentActive);
  const user = useSelector(state => state.auth.user);
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const newComment = useSelector(state => state.images.newComment);
  const [comment, setComment] = useState("");
  const [postedComment, setNewComment] = useState({});
  
  const token = localStorage.getItem("token");
  const likesLength = useSelector(state => state.images.likesLength);
  const likeColor = useSelector(state => state.images.likeColor);

  const [type, setType] = useState("");
  const [data, setData] = useState([]);

  const BASE_URL = "http://localhost:8000"

  useEffect(() => {

    dispatch(loadUser(token));

    // set a time out buffer to allow the image to load
    setTimeout(() => {
      dispatch(loadImage(filename, token, username));
    }, 1500)

  }, [dispatch])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const like = () => {
    dispatch(addLikes(token, image.FileName, user.UserName))
  }

  const openConfirmDelete = () => {
    setDeleteOpen(true)
  }

  const closeConfirmDelete = () => {
    setDeleteOpen(false);
  }

  const deletion = () => {
    setDeleteOpen(false);
    setLoading(true);
    dispatch(deleteImage(filename, token))
    setTimeout(() => {
      history.push(`/profile/${user.UserName}`);
    }, 2000)
  }

  const close = () => {
    setOpen(false);
  }

  const handleOpen = (type, newData) => {
    setType(type);
    setData(newData)
    setOpen(true)
  }

  const commentChangeHandler = (e) => {
    setComment(e.target.value);
  }

  const postComment = (e) => {
    e.preventDefault()
	  setComment("");
    
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    const body = {
      comment
    }

    axios.post(`${BASE_URL}/api/photos/${image.FileName}/comments/add`, body, config)
    .then((res) => {
      setNewComment(res.data.comment);
    })
    .catch((err) => console.log(err));
  }

  useLayoutEffect(() => {
    return () => {
      dispatch({type: "SET_ACTIVE", payload: ""})
    }
  }, [dispatch])

  if (loading) {
    return (
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    )
  } else {
      return (
        <div>
          <NavBar title="PhotoSpire" />
          <div className="display-main">
          <div className="image-display">
            {
              Object.entries(image).length === 0 ? null :
              <div className="image-functions">
            <Avatar src={`/uploads/${username}/avatar.jpg`} />  
              <a style={{marginLeft: "10px"}} className="profile-link" href={`/profile/${username}`}>
              <h5 >{username}</h5>
              </a>
            <div style={{cursor: "pointer"}} onClick={handleClick}> 
              <MoreHorizIcon />
            </div>
            <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          > 
            { 
              isAuth && user.UserName === username ? 
              <div>
                <MenuItem onClick={openConfirmDelete}>Delete</MenuItem>
              </div>
              : 
              null
            }
            <MenuItem onClick={() => window.open(`/uploads/${username}/${image.FileName}`)}>Full Size</MenuItem>
          </Menu>
          <DeleteImageModal confirmDelete={deletion} cancelDelete={closeConfirmDelete} open={deleteOpen} />
          </div>
            }
          
          <h6 className="date-header">{image.DatePosted}</h6>
          <div className="image-page-div display-image-div">
            {
              Object.entries(image).length === 0 ? 
              <div className="loading-div">
                <div className="lds-ripple"><div></div><div></div></div>
              </div> :
              <img 
                className="feed-img display-img"
                src={`/uploads/${username}/${image.FileName}`} 
                 
                alt="filename"
              />
            }
          </div>
          <div className="image-data">
            {
            image.Title ? 
              <div className="image-data">
                <ImageDataBox title="Like" onClickFunc={like}>
                  <FavoriteIcon style={{color: likeColor}} /> 
                  <h4 style={{marginTop: "4px", marginLeft: "4px"}}>{likesLength}</h4>
                </ImageDataBox>
                <ImageDataBox title="Tags" onClickFunc={() => handleOpen("tags", image.Tags)}>
                  <LocalOfferIcon /> 
                  <h4 style={{marginTop: "4px", marginLeft: "4px"}}>{image.Tags.length}</h4>
                </ImageDataBox>
                <ImageDataBox title="Comments" onClickFunc={() => history.push(`/${username}/${image.FileName}/comments`)}>
                  <ChatBubbleIcon />
                  <h4 style={{marginTop: "4px", marginLeft: "4px"}}>{image.Comments.length}</h4>
                </ImageDataBox>
              </div>
              :
              <div className="loading"></div>
          } 
          <ImageDataModal open={open} handleClose={close} type={type} data={data} />
          </div> 
          <div className="post-content">
            <h4 style={{marginRight: "5px"}}>{username} - </h4>
            {
                image.Title ? image.Title : <div className="loading"></div>
            }
          </div>  
          <div className="divider display-divider"></div>
          </div>
          
          <div className="comments-main">
            { 

              Object.entries(image).length === 0 ? 
              <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div className="lds-ripple"><div></div><div></div></div></div> 
              :
              image.Comments && image.Comments.length > 0 ? 
              <div>
                <div className="mobile-comments">
                  {
                    image.Comments.slice(0, 2).map((comment, idx) => (
                      <Comment key={idx} postedBy={comment.postedBy} text={comment.text} date={comment.datePosted} />
                    ))
                  }
                   <a className="all-comments-link" href={`/${username}/${image.FileName}/comments`}>
                    <h5>View All Comments</h5>
                  </a>
                </div>
                <div className="comments-add-div">	
                    <div className="comments-functions">
                      <TextareaAutosize value={comment} onChange={commentChangeHandler} style={{resize: "none"}} className="comment-input" placeholder="Add Comment" rowsMin="1" rowsMax="2" />
                      <Button onClick={postComment} className="post-comment-button" color="secondary">
                        Post
                      </Button>
                    </div>
                  </div>
                <div className="desktop-comments">
                {
                    image.Comments.map((comment, idx) => (
                      <Comment key={idx} postedBy={comment.postedBy} text={comment.text} date={comment.datePosted} />
                    ))
                  }
                </div>
                </div>
                
               : 
                <div>
                  <AddComment />
                  {newComment ? null : <h4 className="no-comments">No Comments Yet</h4>}
                </div>
            }
            {
              Object.entries(postedComment).length > 0 ? <Comment postedBy={postedComment.postedBy} text={postedComment.text} date={postedComment.datePosted} /> : null
            }
          </div>  
          </div>
        </div>
      )
    }
}
