import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Fade, Avatar, Backdrop } from "@material-ui/core";
import FollowerCard from "./FollowerCard";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: "white",
    marginBottom: "400px",
    width: "70%",
    paddingBottom: "20px"
  },
}));

  export default function FollowModal(props) {
    const classes = useStyles();

    return (
      <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade className={classes.paper} in={props.open}>
          <div className="tags">
            <div style={{borderBottom: "1px solid lightgray", padding: "10px"}}>
              <h4 style={{textTransform: "capitalize", fontSize: "20px", fontWeight: "100"}}>
                {props.type === "followers" ? `${props.user.Followers.length} Followers` : `${props.user.Following.length} Following`}
                </h4>
            </div>
            {
              props.type === "followers" ? 
                props.user.Followers.length > 0 ? 
                  props.user.Followers.map((follower, idx) => (
                    <FollowerCard key={idx} username={follower} />
                  ))
                  :
                  <h4 style={{textAlign: "center", marginTop: "20px"}}>
                    User Has No Followers
                  </h4>
              :
                props.user.Following.length > 0 ?
                  props.user.Following.map((following, idx) => (
                    <FollowerCard key={idx} username={following} />
                  ))
                  :
                  <h4 style={{textAlign: "center",  marginTop: "20px"}}>
                    User Is Not Following Anyone
                  </h4>          
            }
          </div>
        </Fade>
      </Modal>
    </div>
    )
  }