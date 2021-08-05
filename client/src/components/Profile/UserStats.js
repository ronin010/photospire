import React, {useState} from "react";

export default function UserStats(props) {

  return (
      <div onClick={props.onClickFunc} className={props.title === "posts" ? "data" : "posts-count"}>
        <h4 className="posts-data">{props.number}</h4>
        <h4 className="posts-data">{props.title}</h4>
      </div>
  )
}