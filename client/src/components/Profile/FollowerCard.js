import React from "react";
import { Avatar } from "@material-ui/core";
import {useHistory} from "react-router-dom";

export default function FollowerCard(props) {
  const history = useHistory();



  return (
    <div className="follow-div">
      <Avatar src={`/uploads/${props.username}/avatar.jpg`} />
      <h3 style={{cursor: "pointer"}} onClick={() => history.push("/profile/" + props.username)}>
        <a href={"/profile/" + props.username}>{props.username}</a>
      </h3>
    </div>
  )
}