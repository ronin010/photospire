import React from "react";
import Tooltip from '@material-ui/core/Tooltip';

export default function ImageDataBox(props) {
  return (
    <Tooltip placement="top" title={props.title}>
      <div onClick={props.onClickFunc} className="image-data-box">  
        {props.children}  
      </div> 
    </Tooltip>
  )
}