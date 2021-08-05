import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/authActions";
import NavBar from "../Navigation/NavBar";
import ImageCard from "../Images/ImageCard";
import {Button, TextField} from "@material-ui/core"
import { useHistory } from "react-router";
import axios from "axios";
import {sortPosts} from "../../actions/imageActions";
import FeedContent from "./FeedContent";
import SearchIcon from '@material-ui/icons/Search';

export default function Feed(props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector(state => state.auth.user)
  const [posts, setPosts] = useState([]);
  const history = useHistory()
  const [loading, setLoading] = useState(true);
  const BASE_URL = ""
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(loadUser(token))

    setTimeout(() => {
      
      const config = {
        headers: {
          "Authorization": token
        }
      }
  
      axios.get(`${BASE_URL}/api/photos/feed/all`, config)
      .then((res) => {
        if (res.data.posts.length > 0) {
          
          setPosts([...posts, res.data.posts]);
          console.log(res.data.posts);

         sortPosts(res.data.posts)
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
    }, 2000)
    
  }, [dispatch])

  const searchHandler = e => {
    setQuery(e.target.value);
  }
 
    return (
    <div >
      <NavBar title="Feed" />
      <div className="feed-search">
        <TextField onChange={searchHandler} placeholder="Search..." color="secondary" className="search-input" type="text" variant="standard" />
        <div onClick={() => history.push("/search/" + query)} className="feed-search-button">
          <SearchIcon />
        </div>
      </div>
      <div className="feed-div">
        <div className="feed-main">
          {
            loading && posts.length === 0 ? 
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "200px"}}>
              <div className="lds-ripple"><div></div><div></div></div>
            </div>
          : 
            
            posts.length > 0 ? 

              posts[0].map((post, idx) => ( 
                <ImageCard 
                  key={idx}
                  header="Feed"
                  postedBy={post.PostedBy} 
                  filename={post.FileName} 
                  datePosted={post.DatePosted}
                  title={post.Title}
                  comments={post.Comments}
                  tags={post.Tags}
                />
              ))
              
              : 
              <div className="welcome-div">
                <h3 style={{textAlign: "center", marginTop: "10px", marginBottom: "10px"}}>Welcome To PhotoSpire!</h3>
                <p style={{textAlign: "center", marginBottom: "20px"}}>A Free And Open Source Image Sharing Social Site. Star Finding Images Now!</p>
                <Button onClick={() => history.push("/search")} variant="contained" color="secondary">
                  Let's Go!
                </Button>
              </div>
              
          }
        </div>
        {
          loading && posts.length === 0 ? 
          null
          :
          <FeedContent username={user.UserName} />
        }
        
      </div>
    </div>
  )
}