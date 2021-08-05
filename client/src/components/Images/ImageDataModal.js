import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import {useHistory} from "react-router-dom";

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

export default function ImageDataModal(props) {
  const classes = useStyles();
  const history = useHistory();

  const routeToPage = (path) => {
    history.push(path);
  }
  
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
              <h4 style={{textTransform: "capitalize", fontSize: "20px", fontWeight: "100"}}>{props.type + ":"}</h4>
            </div>
            {
              props.type === "tags" ? 
                props.data.map((d, idx) => (
                  <div key={idx} onClick={() => routeToPage("/tags/" + d)} className="tag-div">
                    <a className="tag-link" >{d}</a>
                  </div>
                ))
                :
                null
            }
          </div>
        </Fade>
      </Modal>
    </div>
  )
}