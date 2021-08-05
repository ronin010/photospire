import React from "react";
import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";

export default function NavLinks() {
  const history = useHistory();

  const routeToPage = (page) => {
    history.push(page);
  }

  return (
    <div className="drawer-links">
      <Button className="nav-link" onClick={() => routeToPage("/")}>Home</Button>
      <Button className="nav-link" onClick={() => routeToPage("/login")}>Sign In</Button>
      <Button className="nav-link" onClick={() => routeToPage("/register")}>Register</Button>
      <Button className="nav-link" onClick={() => window.open("https://github.com/ronin010/photospire", "_blank")}>Github</Button>
    </div>
  )
}