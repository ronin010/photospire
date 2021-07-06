import React, {useState, useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadUser} from "../../actions/authActions";
import {useParams} from "react-router-dom";
import NavBar from "../Navigation/NavBar";
import {Button, TextField, Avatar} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Image from "../Images/Image";
import {runSearch, clearSearch} from "../../actions/imageActions";
import { makeStyles } from '@material-ui/core/styles';
import { SignalCellularNull } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

export default function Search(props) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState("users");
  const [color, setColor] = useState({users: "secondary", tags: "default"})
  const [error, setError] = useState("");
  
  const dataLoaded = useSelector(state => state.search.loaded)
  let results = useSelector(state => state.search.results);
  let users = useSelector(state => state.search.users);
  const userMessage = useSelector(state => state.search.userMessage);
  const imageMessage = useSelector(state => state.search.imageMessage);

  const classes = useStyles();

  useEffect(() => {

    dispatch(loadUser(token));
  }, [dispatch]);

  const changeHandler = (e) => {
    setQuery(e.target.value);
  }

  useLayoutEffect(() => {

  }, [dispatch])

  const changeOption = (o) => {
    setOption(o);

    if (o === "tags") {
      setColor({users: "default", tags:"secondary"})
    } else  {
      setColor({users:"secondary", tags: "default"})
    }
  }

  const submit = () => {

    if (dataLoaded) {
      dispatch({type: "SET_LOADED", payload: false});
    }
    
   
    if (results.length > 0 || users.length > 0) {
      results.length = 0;
      users.length = 0;
    }

    if (error !== "") {
      setError("");
    }

    if (query === "") {
      setError("Please Enter a Query");
    } else {
      setLoading(true);

      setTimeout(() => {
       dispatch(runSearch(query, token));
       setLoading(false);
      }, 2000)
    }
  }

  return (
    <div>
      <NavBar title="Search" />
      <div className="search-div">
        <TextField 
					placeholder="Search"
					color="secondary"
					onChange={changeHandler}
          value={query}
				/>
        <Button onClick={() => submit(option)}>
          <SearchIcon />
        </Button>
      </div>
      
        <div className="option-buttons">
          <Button className="option-button" color={color.users} style={{marginRight: "10px"}} variant="contained" onClick={() => changeOption("users")}>Users</Button>
          <Button className="option-button" color={color.tags} variant="contained" onClick={() => changeOption("tags")}>Images</Button>
        </div>
        {
          error ? <h4 style={{textAlign: "center"}}>{error}</h4> : null
        }
        {
          loading ? 
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
            <div className="lds-ripple"><div></div><div></div></div>
          </div> : null
        }
       
        {
          option === "users" ? 
            <div className="user-results">
              {dataLoaded && userMessage !== "" ? <h4 style={{textAlign: "center", margin: "20px 0px 20px 0px"}}>{userMessage}</h4> : null}
              {
                users.length > 0 ? <h4 style={{textAlign: "center", margin: "20px 0px 20px 0px"}}>{}</h4> : null
              }
              {
              users.length > 0  ?
                  users[0].map((user) => (
                    <div key={user._id} className="user-search-results">
                      <Avatar className={classes.large} src={`/uploads/${user.UserName}/avatar.jpg`} />
                      <a style={{marginLeft: "15px"}} className="profile-link" href={`/profile/${user.UserName}`}>
                        <h4>{user.UserName}</h4>
                      </a>
                    </div>
                  ))
                 
                  :
                  null
              }
            </div> : 

            <div className="images">
              {dataLoaded && imageMessage !== "" ? <h4 style={{textAlign: "center", margin: "20px auto 20px auto"}}>{imageMessage}</h4> : null}
              {
               results.length > 0 ? 
                  results[0].map((result) => (
                    <Image key={result.FileName} username={result.PostedBy} filename={result.FileName} />
                  ))
                  : 
                  null
              }
            </div>
        }
    </div>
  )
}