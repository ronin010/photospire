import React, {useState, useEffect, useLayoutEffect} from "react";
import NavBar from "../Navigation/NavBar";
import {useParams, useHistory} from "react-router-dom";
import {loadUser} from "../../actions/authActions";
import {loadImagesByTag} from "../../actions/imageActions";
import {useDispatch, useSelector} from "react-redux";
import Image from "../Images/Image";
import {TextField} from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search';

export default function ImageTagsList(props) {
	const {tag} = useParams();
	const token = localStorage.getItem("token");
	const history = useHistory();
	const dispatch = useDispatch();
	const [value, setValue] = useState(tag)
	const [isLoading, setLoading] = useState(false);

	const images = useSelector(state => state.images.imagesByTag);

	const onChange = (e) => {
		setValue(e.target.value);
	}

	const submit = (e) => {
		e.preventDefault();
		setLoading(true);

		setTimeout(() => {
			dispatch(loadImagesByTag(value, token));
			setLoading(false)
			history.push("/tags/" + value);
		}, 2000)
	}

	useEffect(() => {
    setLoading(true)

		dispatch(loadUser(token));

		setTimeout(() => {
			dispatch(loadImagesByTag(tag, token))
      setLoading(false);
		}, 2000)
		
	}, [dispatch])

	useLayoutEffect(() => {
		dispatch({type: "SET_IMAGES_BY_TAG", payload: []})
	}, [dispatch])

	if (isLoading) {
		return (
			<div style={{margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
				<div className="lds-ripple"><div></div><div></div></div>
			</div>
		)
	} else {
		return (
		<div>
			<NavBar title="Tags" />
			<div className="search-div">
				<TextField 
					value={value}
					color="secondary"
					onChange={onChange}
				/>
				<div onClick={submit} style={{cursor: "pointer"}} className="search-button">
					<SearchIcon />
				</div>
			</div>
				<div className="images">
          {
            isLoading ? 
            <div style={{margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
              <div className="lds-ripple"><div></div><div></div></div>
            </div>
            : 	
            images.length > 0 ? 

						images.map((image, idx) => (
							<Image key={idx} username={image.PostedBy} filename={image.FileName} />
						))

						: 

						null
          }
				</div>
		</div>
	)
	}

	
}