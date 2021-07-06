import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {loadUser} from "../../actions/authActions";

export default function UserSearch(props) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser(token));
  }, [dispatch])

  return (
    <div>
      
    </div>
  )
}