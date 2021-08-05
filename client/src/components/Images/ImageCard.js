import React, {useEffect, useState, useLayoutEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {useHistory, useParams} from "react-router-dom";
import { deleteImage, addLikes } from "../../actions/imageActions";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/authActions";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Avatar from '@material-ui/core/Avatar';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import ImageDataBox from "./ImageDataBox";
import ImageDataModal from "./ImageDataModal";
import DeleteImageModal from "./DeleteImageModal";
import axios from "axios";
import Comment from "../Comments/Comment";
import AddComment from "../Comments/AddComment";
import {Button, TextareaAutosize} from "@material-ui/core"

export default function ImageCard(props) {
  const {username, filename} = useParams();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false); 
  const [image, setImage] = useState({});
  const user = useSelector(state => state.auth.user);
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const token = localStorage.getItem("token");
  const [likesLength, setLength] = useState(0);
  const [likeColor, setColor] = useState("")
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState({});
  const BASE_URL = "http://localhost:8000"

  const [type, setType] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(loadUser(token));

    setTimeout(() => {
			const config = {
				headers: {
					"Authorization": token
				}
			}

			axios.get(`${BASE_URL}/api/photos/images/${props.postedBy}/${props.filename}`, config)
			.then((res) => {
				setImage(res.data.image)

				if (res.data.image.Likes.includes(user.UserName)) {
					setColor("#ed4956");
          setLength(res.data.image.Likes.length);
				}
			})
			.catch((err) => console.log(err));
    })

  }, [dispatch])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const like = () => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    axios.post(`${BASE_URL}/api/photos/${props.filename}/like`, {username: user.UserName}, config)
    .then((res) => {
      if (res.data.message.includes("added")) {
        setLength(likesLength + 1)
        setColor("#ed4956");
      }  else {
        setLength(likesLength - 1);
        setColor("");
      }
    })
    .catch((err) => {
      console.log(err);
    })
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
    dispatch(deleteImage(props.filename, token))
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

    axios.post(`${BASE_URL}/api/photos/${props.filename}/comments/add`, body, config)
    .then((res) => {
      setNewComment(res.data.comment);
    })
    .catch((err) => console.log(err));
  }

  if (loading) {
    return (
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    )
  } else {
      return (
        <div className="feed-card">
          <div className="image-functions display-functions">
            <Avatar src={`/uploads/${props.postedBy}/avatar.jpg`} />  
              <a style={{marginLeft: "10px"}} className="profile-link" href={`/profile/${props.postedBy}`}>
              <h5 >{props.postedBy}</h5>
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
              isAuth && user.UserName === props.postedBy ? 
              <div>
                <MenuItem onClick={openConfirmDelete}>Delete</MenuItem>
              </div>
              : 
              null
            }
            <MenuItem onClick={() => window.open(`/uploads/${props.postedBy}/${props.filename}`)}>Full Size</MenuItem>
          </Menu>
          <DeleteImageModal confirmDelete={deletion} cancelDelete={closeConfirmDelete} open={deleteOpen} />
          </div>
          <h6 className="date-header">{props.datePosted}</h6>
          <div className="image-page-div feed-image-page">
            {
              !props.title ? 
              <div className="loading-div">
                <div className="lds-ripple"><div></div><div></div></div>
              </div> :
              <img 
                className="feed-img"
                onClick={() => history.push(`/images/${props.postedBy}/${props.filename}`)}
                src={`/uploads/${props.postedBy}/${props.filename}`} 
                alt="filename"
              />
            }
          </div>
          <div className="image-data">
            {
            props.title ? 
              <div className="image-data">
                <ImageDataBox title="Like" onClickFunc={like}>
                  <FavoriteIcon style={{color: likeColor}} /> 
                  <h4 style={{marginTop: "4px", marginLeft: "4px"}}>{likesLength}</h4>
                </ImageDataBox>
                <ImageDataBox title="Tags" onClickFunc={() => handleOpen("tags", props.tags)}>
                  <LocalOfferIcon /> 
                  <h4 style={{marginTop: "4px", marginLeft: "4px"}}>{props.tags.length}</h4>
                </ImageDataBox>
                <ImageDataBox title="Comments" onClickFunc={() => history.push(`/images/${props.postedBy}/${props.filename}`)}>
                  <ChatBubbleIcon />
                  <h4 style={{marginTop: "4px", marginLeft: "4px"}}>{props.comments.length}</h4>
                </ImageDataBox>
              </div>
              :
              <div className="loading"></div>
          } 
          <ImageDataModal open={open} handleClose={close} type={type} data={data} />
          </div> 
          <div className="post-content">
            <h4 style={{marginRight: "5px"}}>{props.postedBy} - </h4>
            {
                props.title ? props.title : <div className="loading"></div>
            }
          </div>  
          <div className="divider feed-divider"></div>
          <div className="comments-main">
            { 

              Object.entries(image).length === 0 ? 
              <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div className="lds-ripple"><div></div><div></div></div></div> 
              :
              image.Comments && image.Comments.length > 0 ? 
                <div>
                  {
                    image.Comments.slice(0, 2).map((comment, idx) => (
                      <Comment key={idx} postedBy={comment.postedBy} text={comment.text} date={comment.datePosted} />
                    ))
                  }
                   <a className="all-comments-link" href={`/${props.postedBy}/${props.filename}/comments`}>
                    <h5>View All Comments</h5>
                  </a>
									
                </div>
               : 
                <div>
                  <div className="comments-add-div">	
                    <div className="comments-functions">
                      <TextareaAutosize value={comment} onChange={commentChangeHandler} style={{resize: "none"}} className="comment-input" placeholder="Add Comment" rowsMin="1" rowsMax="2" />
                      <Button onClick={postComment} className="post-comment-button" color="secondary">
                        Post
                      </Button>
                    </div>
                  </div>

                  {Object.entries(newComment).length > 0 ? null : <h4 className="no-comments">No Comments Yet</h4>}
									<div className="divider"></div>
                </div>
            }
            {
              Object.entries(newComment).length > 0 ? <Comment postedBy={newComment.postedBy} text={newComment.text} date={newComment.datePosted} /> : null
            }
          </div>
        </div>
      )
    }
}
