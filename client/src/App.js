import './App.css';
import "./tablet.css"
import "./desktop.css"
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/auth/Register";
import Profile from "./components/Profile/Profile";
import Login from "./components/auth/Login";
import EditProfile from "./components/Profile/EditProfile";
import NoMatch from "./components/Navigation/NoMatch";
import PrivateRoute from "./PrivateRoute";
import AddNewImage from "./components/Images/AddNewImage";
import ImageDisplay from "./components/Images/ImageDisplay";
import CommentsPage from "./components/Comments/CommentsPage"
import ImageTagsList from "./components/Search/ImageTagsList";
import Search from "./components/Search/Search";
import Feed from "./components/Home/Feed";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/search/:value" component={Search} />
        <Route path="/profile/:username" component={Profile} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute>
          <Route path="/feed" component={Feed} />
          <Route path="/user/:username/edit" component={EditProfile} />
          <Route path="/:username/add-image" component={AddNewImage} />
          <Route path="/images/:username/:filename" component={ImageDisplay} />
          <Route path="/:username/:filename/comments" component={CommentsPage} />
          <Route path="/tags/:tag" component={ImageTagsList} />
        </PrivateRoute>
      <Route path="*" component={NoMatch} status={404}/>
      </Switch>
    </Router>
  );
}

export default App;
