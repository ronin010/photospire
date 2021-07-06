import React, {useState, useEffect} from "react";
import NavBar from "../Navigation/NavBar";
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import TextField from '@material-ui/core/TextField';
import {connect, useDispatch, useSelector} from "react-redux";
import {loadUser} from "../../actions/authActions";
import {addNewImage, setImage} from "../../actions/imageActions";
import Alert from '@material-ui/lab/Alert';
import {compose} from "redux";
import {withRouter, useHistory, Redirect} from "react-router-dom";
import FormData from "form-data";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AddNewImage(props) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [border, setBorder] = useState("1px solid darkgrey")
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = ""
  const previewImage = useSelector(state => state.images.previewImage);
  const newImage = useSelector(state => state.images.newImage)  
  const imageLoaded = useSelector(state => state.images.imageLoaded)

  useEffect(() => {
    const config = {
      headers: {
        "Authorization": token
      }
    }

    dispatch(loadUser(token));
  }, [dispatch])

 function onTitleChange(e) {
    
    setTitle(e.target.value);
  }

  function onTagsChange(e) {
    
    setTags(e.target.value);
  }

  function onDescChange(e) {
    setDescription(e.target.value);
  }

  function onImageChange(e) {
    setImage(e.target.files[0], URL.createObjectURL(e.target.files[0]));
  }

  function submit(e) {
    setLoading(true)
    
    e.preventDefault();

    let imageData = new FormData();
    imageData.append("file", newImage);
    imageData.append("title", title);
    imageData.append("tags", tags)

    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "multipart/form-data"
      }
    }

    axios.post(BASE_URL + "/api/photos/add", imageData, config)
    .then((res) => {
      
      setTimeout(() => {
        history.push(`/images/${user.UserName}/${res.data.image.FileName}`)
      }, 3000)
    })
    .catch((err) => console.log(err));
    
  }

  

  if(loading) {
    return <div className="lds-ripple"><div></div><div></div></div>
  } else if (!imageLoaded) {
    return <Redirect to={`/`} />
  } else  {
    return (
      <div>
      <NavBar title="Add Post" />
        <div className="draft-div">
          <Button className="draft-button" variant="outlined" color="primary">
            Save As Draft
          </Button>
        </div>
        {
          imageLoaded ? 
            <Alert style={{marginTop: "20px"}} severity="info">
              Click The Image To Select A Different One
            </Alert> : null
        }
           
           <input
          id="contained-button-file"
          multiple
          type="file"
          style={{display: "none"}}
          onChange={onImageChange}
        />
        <label style={{cursor: "pointer"}} htmlFor="contained-button-file">
          <div className="new-image-div">
          {
            imageLoaded ? 
              <img style={{objectFit: "contain"}} src={previewImage} height="250px" width="300px" />
            :
              null

          }
          </div>
        </label>
        <div className="new-image-inputs">
          <div className="title-field">
            <TextField
              label="Caption"
              className="image-input"
              onChange={onTitleChange}
              type="text"
              name="title"
              color="secondary"
            />
          </div>
          <div className="title-field">
            <TextField
              label="Tags"
              className="image-input"
              onChange={onTagsChange}
              type="text"
              name="tags"
              color="secondary"
            />
            <h5 className="tags-info">Seperate Using ','. Example: Food,Tech,Gaming...</h5>
          </div>
          <div className="new-image-buttons">
            <Button onClick={submit} variant="outlined" color="secondary">
              Submit
            </Button>
            <Button onClick={() => history.push("/profile/" + user.UserName)} 
              variant="outlined" 
              color="secondary">
              Cancel
            </Button>
          </div>
        </div>
        
      </div>
    )
  }


}