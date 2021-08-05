import React, {useState, useEffect} from "react";
import NavBar from "../Navigation/NavBar";
import { Button, TextField } from "@material-ui/core";
import { useDispatch, useSelector} from "react-redux";
import {loadUser} from "../../actions/authActions";
import {setImage} from "../../actions/imageActions";
import Alert from '@material-ui/lab/Alert';
import {useHistory, Redirect} from "react-router-dom";
import FormData from "form-data";
import axios from "axios";

export default function AddNewImage(props) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const BASE_URL = ""
  const previewImage = useSelector(state => state.images.previewImage);
  const newImage = useSelector(state => state.images.newImage)  
  const imageLoaded = useSelector(state => state.images.imageLoaded)
  const [error, setError] = useState("");
  const [display, setDisplay] = useState("inherit")

  useEffect(() => {
    dispatch(loadUser(token));
  }, [dispatch])

 function onTitleChange(e) {
    
    setTitle(e.target.value);
  }

  function onTagsChange(e) {
    
    setTags(e.target.value);
  }

  function onImageChange(e) {
    setImage(e.target.files[0], URL.createObjectURL(e.target.files[0]));
  }

  function submit(e) {

    if (tags === "") {
      setError("Please Add At Least One Tag");
      setDisplay("none");
    } else {
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
  }

  if(loading) {
    return <div className="lds-ripple"><div></div><div></div></div>
  } else if (!imageLoaded) {
    return <Redirect to={`/`} />
  } else  {
    return (
      <div>
      <NavBar title="Add Post" />
       
        {
          imageLoaded ? 
            <Alert style={{marginTop: "20px", display: {display}}} severity="info">
              Click The Image To Select A Different One
            </Alert> : null
        }

        {
          error ? 
          <Alert style={{marginTop: "20px"}} severity="error">
            {error}
          </Alert> : null
        }
           
           <input
          id="contained-button-file"
          multiple
          type="file"
          style={{display: "none"}}
          onChange={onImageChange}
        />
        <label className="new-img-label"  htmlFor="contained-button-file">
          <div className="new-image-div">
          {
            imageLoaded ? 
              <img className="new-img" src={previewImage} alt="filename" />
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