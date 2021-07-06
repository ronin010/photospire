import React, {useState, useEffect} from "react";
import Comment from "./Comment";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from "@material-ui/core/Button"
import {useSelector} from "react-redux"

export default function Comments(props) {

  const [comment, setComment] = useState("");
  const newComment = useSelector(state => state.images.newComment);

  const commentChange = (e) => {
    setComment(e.target.value);
  }

  const postComment = (e) => {
    e.preventDefault()
    console.log(comment);
  }

  useEffect(() => {
    console.log(props.comments);
  }, [])

  return (
    <div className="comments-main">
      {
        newComment ? <Comment postedBy={newComment.postedBy} text={newComment.text} date={newComment.datePosted} /> : null
      }
      { 
        props.comments && props.comments.length > 0 ? 

        props.comments.map((comment, idx) => (
          <Comment 
            key={idx}
            postedBy={comment.postedBy} 
            text={comment.text} 
            date={comment.datePosted} 
          />
        ))
        :
        <h4 style={{textAlign: "center", opacity: ".6"}}>No Comments Yet</h4>
      }
    </div>
  )
}