import React from "react";
import {Avatar, makeStyles} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  }
}));

export default function Comment(props) {
  const classes = useStyles();

  return (
    <div className="comment-div">
      <div className="comment">
      <Avatar className={classes.small + " comment-avatar"} src={`/uploads/${props.postedBy}/avatar.jpg`} />
      <div className="comment-info">
        <a className="profile-link" href={`/profile/${props.postedBy}`}>
          <h3 style={{fontSize: "17px"}}>{props.postedBy}</h3>
        </a>
        <h6 style={{opacity: ".6"}}>{props.date}</h6>
      </div>
      
    </div>
    <div className="comment-text">
      <p className="comment-content" >
        {props.text}
      </p>
    </div>
    </div>
  )
}