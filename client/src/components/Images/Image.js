import React from "react";
import {useHistory} from "react-router-dom";

export default function Images(props) {
  const history = useHistory();
  
  const loadImage = () => {
    history.push(`/images/${props.username}/${props.filename}`);
  }

  return (
      <div onClick={loadImage} className="image fadeIn profile-image-div">
        <img 
          className="user-image profile-image"
          src={`/uploads/${props.username}/${props.filename}`} 
          height="170px" 
          width="170px" 
          alt="filename" />
      </div>
  )
}