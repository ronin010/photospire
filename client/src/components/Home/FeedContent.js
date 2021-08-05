import React, {useState} from "react";
import { Avatar, TextField } from "@material-ui/core";
import { useHistory } from "react-router";
import SearchIcon from '@material-ui/icons/Search';

export default function FeedContent(props) {
  const history = useHistory()

  const [query, setQuery] = useState("");

  const searchHandler = e => {
    setQuery(e.target.value);
  }

  return (
    <div className="feed-content">
      <div className="feed-profile">
        <Avatar src={`/uploads/${props.username}/avatar.jpg`} />  
        <h3 onClick={() => history.push(`/profile/${props.username}`)} className="feed-acc-header">
          {props.username}
        </h3>
      </div>
      <div className="feed-suggestions">
        <h3 className="suggestions-header">Suggested Tags</h3>
        <h4 onClick={() => history.push("/tags/technology")} className="feed-tag">Technology</h4>
        <h4 onClick={() => history.push("/tags/cyrptocurrency")} className="feed-tag">Cryptocurrency</h4>
        <h4 onClick={() => history.push("/tags/music")} className="feed-tag">Music</h4>
        <h4 onClick={() => history.push("/tags/travel")} className="feed-tag">Travel</h4>
        <h4 onClick={() => history.push("/tags/photography")} className="feed-tag">Photography</h4>
      </div>
      
    </div>
  )
}