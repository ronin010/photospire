import React, {useState, useEffect, useLayoutEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {loadImage, addComment} from "../../actions/imageActions";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useHistory} from "react-router-dom";
import {loadUser} from "../../actions/authActions";
import {Button, TextareaAutosize, Tooltip,} from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Comments from "./Comments"
import AddComment from "./AddComment";

export default function CommentsPage(props) {
	const dispatch = useDispatch();
	const {username, filename} = useParams();
	const token = localStorage.getItem("token");
	const history = useHistory();

	const [comment, setComment] = useState("");

	useEffect(() => {

		dispatch(loadUser(token));

		// set a time out buffer to allow the image to load
    setTimeout(() => {
      dispatch(loadImage(filename, token, username));
    }, 1500)
	}, [dispatch])

	useLayoutEffect(() => {
    return () => {
      dispatch({type: "SET_ACTIVE", payload: ""})
    }
  }, [dispatch])

  

	const image = useSelector(state => state.images.currentActive);
	const user = useSelector(state => state.auth.user);

	return (
		<div>
			<NavBar title="Comments" />
			<AddComment />
			<div style={{borderBottom: "2px solid #00070c", width: "260px", margin: "10px auto", opacity: "0.4"}}></div>
			{
				image.Comments ? 
				<Comments comments={image.Comments} /> 
					: 

					<div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
	        	<div className="lds-ripple"><div></div><div></div></div>
	      	</div>
			}
			
		</div>
	)
}