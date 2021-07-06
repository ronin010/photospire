import FormData from "form-data";
import axios from "axios";

const BASE_URL = ""

export const setCurrentActive = (imageId) => {
  return (dispatch) => {
    dispatch({type: "SET_ACTIVE", payload: imageId});
  }
}

export const storeImages = (images) => {
  return (dispatch) => {
    dispatch({type: "SET_USER_IMAGES", payload: images});
  }
}

export const addNewImage = (title, image, tags, token) => {
  return (dispatch, getState) => {
    dispatch({type: "SET_LOADING", payload: true})

    let imageData = new FormData();
    imageData.append("file", image);
    imageData.append("title", title);
    imageData.append("tags", tags)

    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "multipart/form-data"
      }
    }

    axios.post(BASE_URL + "/api/photos/add", imageData, config)
    .then((res) => {
      dispatch({type: "ADD_IMAGE", payload: res.data});
      dispatch({type: "SET_NEW_IMAGE", payload: res.data});
      
    })
    .catch(err => console.log(err));
  }
}

export const loadImage = (fileName, token, username) => {
  return (dispatch, getState) => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }


    axios.get(`${BASE_URL}/api/photos/${username}/${fileName}`, config)
    .then((res) => {
      dispatch({type: "SET_ACTIVE", payload: res.data.image});
      const length = res.data.image.Likes.length;
      dispatch({type: "SET_LENGTH", payload: length})
      const {user} = getState().auth;
      
      if (res.data.image.Likes.includes(user.UserName)) {
        dispatch({type: "SET_COLOR", payload: "#ed4956"})
      }
    })
    .catch((err) => console.log(err));
  }
}

export const addLikes = (token, filename, username) => {
  return (dispatch) => {

    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    axios.post(`${BASE_URL}/api/photos/${filename}/like`, {username}, config)
    .then((res) => {
      if (res.data.message.includes("added")) {
        dispatch({type: "INCREMENT_LIKES"})
        dispatch({type: "SET_COLOR", payload: "#ed4956"});
      }  else {
        dispatch({type: "DECREMENT_LIKES", payload: username})
        dispatch({type: "SET_COLOR", payload: "black"});
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }
}

export const addComment = (token, comment, filename) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    const body = {
      comment
    }

    axios.post(`${BASE_URL}/api/photos/${filename}/comments/add`, body, config)
    .then((res) => {
      dispatch({type: "SET_COMMENT", payload: res.data.comment})
    })
    .catch((err) => console.log(err));
  }
}

export const runSearch = (value, token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    axios.post(`${BASE_URL}/api/photos/discover/${value}`, {}, config)
    .then((res) => {
      const images = res.data.images;
      const users = res.data.users;

      dispatch({type: "SET_RESULTS", payload: images});
      dispatch({type: "SET_USERS", payload: users})
      dispatch({type: "SET_LOADED", payload: true})
      
      if (users.length < 1) {
        dispatch({type: "SET_USER_MESSAGE", payload: "No Results"})
      } else {
        dispatch({type: "SET_USER_MESSAGE", payload: ""})
      }

      if (images.length < 1) {
        dispatch({type: "SET_IMAGE_MESSAGE", payload: "No Results"})
      } else {
        dispatch({type: "SET_IMAGE_MESSAGE", payload: ""})
      }
    })
    .catch((err) => console.log(err));
  }
}

export const loadImagesByTag = (tag, token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    axios.post(`${BASE_URL}/api/photos/tags`, {tag}, config)
    .then((res) => {
      console.log(res.data.images)
      dispatch({type: "SET_IMAGES_BY_TAG", payload: res.data.images});
    })
    .catch((err) => console.log(err));
  }
}

export const searchUsers = (name, token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    axios.post(`${BASE_URL}/api/photos/discover/${name}/username`, {}, config)
    .then((res) => {
      dispatch({type: "SET_USERS", payload: res.data.users});
    })
    .catch((err) => console.log(err));
  }
}

export const deleteImage = (filename, token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "application/json"
      }
    }

    axios.delete(`${BASE_URL}/api/photos/${filename}`, config)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
  }
}

export const clearSearch = () => {
  return (dispatch) => {
    dispatch({type: "CLEAR_SEARCH"})
  }
}

export const setImage = (newImage, previewImage) => {
  return (dispatch) => {
    dispatch({type: "SET_IMAGE", payload: {newImage, previewImage}});
  }
}

export const search = (parameter) => {
  return (dispatch) => {

  }
}
