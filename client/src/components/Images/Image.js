import React, { useEffect } from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

export default function Images(props) {
  const user = useSelector(state => state.auth.user);
  const history = useHistory();
  
  const loadImage = () => {
    history.push(`/images/${props.username}/${props.filename}`);
  }

  return (
    <div>
      
      <div onClick={loadImage} className="image fadeIn">
        <img className="user-image" src={`/uploads/${props.username}/${props.filename}`} height="170px" width="170px" />
      </div>
    </div>
  )
}