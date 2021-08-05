import React, {useState, useLayoutEffect} from "react"
import {addComment} from "../../actions/imageActions";
import {Button, TextareaAutosize} from "@material-ui/core"
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import { set } from "mongoose";

export default function AddComment(props) {
	const [comment, setComment] = useState("");
	const dispatch = useDispatch();
	const token = localStorage.getItem("token");
	const {filename} = useParams();

	const commentChangeHandler = (e) => {
    setComment(e.target.value);
  }

  const postComment = (e) => {
    e.preventDefault()
	setComment("");
    dispatch(addComment(token, comment, filename ? filename : props.filename))
  }

  useLayoutEffect(() => {
	  dispatch({type: "SET_COMMENT", payload: ""})
  }, [dispatch])

 	return (
	 	<div className="comments-add-div">	
			<div className="comments-functions">
				<TextareaAutosize value={comment} onChange={commentChangeHandler} style={{resize: "none"}} className="comment-input" placeholder="Add Comment" rowsMin="1" rowsMax="2" />
				<Button onClick={postComment} className="post-comment-button" color="secondary">
					Post
				</Button>
			</div>
		</div>
  )
}