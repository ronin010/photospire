import React, { useEffect, useLayoutEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {loadImage} from "../../actions/imageActions";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {loadUser} from "../../actions/authActions";
import Comments from "./Comments"
import AddComment from "./AddComment";

export default function CommentsPage(props) {
	const dispatch = useDispatch();
	const {username, filename} = useParams();
	const token = localStorage.getItem("token");

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
	return (
		<div>
			<NavBar title="Comments" />
			<AddComment />
			<div className="divider"></div>
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