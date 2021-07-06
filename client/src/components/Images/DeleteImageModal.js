import React, {useState, useEffect, useLayoutEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Button, Modal, Fade, Backdrop } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: "white",
    marginBottom: "400px",
    width: "80%",
    paddingBottom: "20px",
    paddingTop: "20px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
}));
  
export default function DeleteImageModal(props) {
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
          <div className="confirm-delete">
            <h3>Confirm Deletion</h3>
            <div className="delete-buttons">
              <Button variant="contained" onClick={props.confirmDelete} color="secondary">
                Confirm
              </Button>
              <Button variant="contained" onClick={props.cancelDelete} color="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}