
import axios from "axios";
import FormData from 'form-data'

let BASE_URL = ""

export const register = (body) => {
  return (dispatch) => {

    axios.post(BASE_URL + "/api/users/register", body)
    .then((response) => {
        localStorage.setItem("token", response.data.token);
        delete response.data.user.Password
        dispatch({type: "REGISTER", payload: response.data.user});
    })
    .catch((err) => {
      localStorage.removeItem("token", "userId");
      dispatch({type: "SET_ERROR", payload: err.response.data.message})
      setTimeout(() => {
        dispatch({type: "SET_VISIBLE", payload: false});
      }, 2000);
    });
  }
}

export const loadUser = (token, username) => {
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
    .catch((err) => console.log(err));
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
      localStorage.removeItem("token", "userId");
      dispatch({type: "SET_ERROR", payload: err.response.data.message})
      setTimeout(() => {
        dispatch({type: "SET_VISIBLE", payload: false});
      }, 2000);
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

