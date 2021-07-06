import React, {useState} from "react"
import {addComment} from "../../actions/imageActions";
import {Button, TextareaAutosize} from "@material-ui/core"
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";

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
    dispatch(addComment(token, comment, filename))
  }

 	return (
	 	<div className="comments-add-div">	
			<div className="comments-functions">
				<TextareaAutosize onChange={commentChangeHandler} style={{resize: "none"}} className="comment-input" placeholder="Add Comment" rowsMin="1" rowsMax="2" />
				<Button onClick={postComment} className="post-comment-button" color="secondary">
					Post
				</Button>
			</div>
		</div>
  )
}