import React, {useState, useEffect} from "react";
import Comment from "./Comment";
import {useSelector} from "react-redux"

export default function Comments(props) {

  const [comment, setComment] = useState("");
  const newComment = useSelector(state => state.images.newComment);

  return (
    <div className="comments-main desktop-comments-main">
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