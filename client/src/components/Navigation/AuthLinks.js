import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {Button} from "@material-ui/core";

export default function AuthLinks() {
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutUser = () => {
    dispatch({type: "LOGOUT"});
    history.push("/");
  }

  const routeToPage = (page) => {
    history.push(page);
  }

  const user = useSelector(state => state.auth.user);

  return (
      <div className="drawer-links">
        <Button className="nav-link"><a href={`/profile/${user.UserName}`}>My Profile</a></Button>
        <Button className="nav-link" onClick={() => history.push("/search")}>Search</Button>
        <Button className="nav-link" onClick={() => history.push("/")}>Posts Feed</Button>
        <Button className="nav-link" onClick={() => history.push("https://github.com")}>Github repo</Button>
        <Button className="nav-link" onClick={() => history.push("/register")}>Privacy policy</Button>
        <Button className="nav-link" onClick={() => history.push("/faq")}>faq</Button>
        <Button className="nav-link" onClick={logoutUser}>Logout</Button>
      </div>
  )
}