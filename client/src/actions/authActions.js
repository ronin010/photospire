
import axios from "axios";
import FormData from 'form-data'

let BASE_URL = ""

export const register = (body) => {
  return (dispatch) => {
    dispatch({type: "SET_LOADING", payload: true});
    axios.post(BASE_URL + "/api/users/register", body)
    .then((res) => {
        console.log(res)
        localStorage.setItem("token", res.data.token);
        dispatch({type: "REGISTER", payload: res.data.user});
    })
    .catch((err) => {
      localStorage.removeItem("token");
      dispatch({type: "SET_ERROR", payload: err.response.data.error})
      setTimeout(() => {
        dispatch({type: "SET_VISIBLE", payload: false});
      }, 2000);
    });
  }
}

export const login = (email, password) => {

  return (dispatch) => {
    dispatch({type: "SET_LOADING", payload: true});

    const body = {
      Email: email,
      Password: password
    }

    axios.post(BASE_URL + "/api/users/login", body)
    .then((res) => {
      console.log(res)
      localStorage.setItem("token", res.data.token);
      dispatch({type: "LOGIN", payload: res.data.user});
      dispatch({type: "SET_LOADING", payload: false})
    })
    .catch((err) => {
      localStorage.removeItem("token");
      dispatch({type: "SET_ERROR", payload: err.response.data.error})
      setTimeout(() => {
        dispatch({type: "SET_VISIBLE", payload: false});
      }, 2000);
    });
  }
}

export const loadUser = (token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization": token
      }
    }

    axios.get(`${BASE_URL}/api/users`, config)
    .then((response) => {
      delete response.data.user.Password
      dispatch({type: "LOGIN", payload: response.data.user});
    })
    .catch((err) => {
      dispatch({type: "SET_ERROR", payload: err.response.data.error})
      setTimeout(() => {
        dispatch({type: "SET_VISIBLE", payload: false});
      }, 2000);
    });
  }
}

export const loadProfile = (token, username) => {
  return (dispatch, getState) => {
    const config = {
      headers: {
        "Authorization": token
      }
    }

    axios.get(`${BASE_URL}/api/users/profile/${username}`, config)
      .then((response) => {  
        let user = response.data.user;
        dispatch({type: "SET_PROFILE", payload: user});
        dispatch({type: "SET_FOLLOWERS", payload: {followers: user.Followers, following: user.Following}})
        dispatch({type: "SET_FOLLOWING_LENGTH", payload: {followerLength: user.Followers.length, followingLength: user.Following.length}})

        let authUser = getState().auth.user;

        if (user.Followers.includes(authUser.UserName)) {
          dispatch({type: "SET_FOLLOWING", payload: true});
        }
      })
      .catch((err) => {
       
      });
  }
}

export const googleLogin = (response) => {
  return (dispatch) => {
    dispatch({type: "GOOGLE_LOGIN", payload: response})
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch({type: "LOGOUT"});
  }
}

export const updateUser = (body, token, profileImage) => {
  return (dispatch) => {
    dispatch({type: "SET_LOADING", payload: true});

    let config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "multipart/form-data"
      }
    }

    if (profileImage !== null) {
      let imageData = new FormData();
      imageData.append("profileImage", profileImage);
      axios.post(`${BASE_URL}/api/users/update-profile-image`, imageData, config)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
    }

    config = {
      headers: {
        "Authorization" : token,
        "Content-Type": "Application/json"
      }
    }

    axios.post(`${BASE_URL}/api/users/update-profile`, body, config)
        .then((res) => {
          dispatch({type: "SET_USER", payload: res.data.user})
        })
        .catch((err) => console.log(err));
  }
}

export const addNewImage = (image, userId) => {
  return (dispatch) => {
    let imageData = new FormData().append("file", image);

    const config = {
      headers: {
        "Authorization" : localStorage.getItem("token"),
        "Content-Type": "multipart/form-data"
      }
    }

    axios.post(BASE_URL + "/add-image", imageData, config)
        .then((res) => dispatch({type: "ADD_IMAGE", payload: res.data}))
        .catch((err) => console.log(err));
  }
}

export const setError = (msg) => {
  return (dispatch) => {
    dispatch({type: "SET_ERR_MSG", payload: msg});
  }
}

export const followUser = (username, followerName, token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization": token
      }
    }

    const body = {
      username, followerName
    }

    axios.post(`${BASE_URL}/api/users/follow/add`, body, config)
    .then((res) => {
      dispatch({type: "SET_FOLLOWING", payload: true});
      dispatch({type: "INCREMENT_FOLLOWER"})
    })
    .catch((err) => console.log(err));
  }
}

export const unfollowerUser = (username, followerName, token) => {
  return (dispatch) => {
    const config = {
      headers: {
        "Authorization": token
      }
    }

    const body = {
      username, followerName
    }

    axios.post(`${BASE_URL}/api/users/follow/remove`, body, config)
    .then((res) => {
      dispatch({type: "SET_FOLLOWING", payload: false});
      dispatch({type: "DECREMENT_FOLLOWER"})
    })
    .catch((err) => console.log(err));
  }
}