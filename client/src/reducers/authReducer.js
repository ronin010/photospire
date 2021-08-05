
const initialState = {
  isAuthenticated: false,
  loading: false,
  user: {},
  error: "",
  visible: false,
  profile: {},
  tempImages: [],
  loaded: false,
  isFollowing: false
}

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case "LOGIN":
      return {
        ...state, 
        isAuthenticated: true, 
        user: action.payload,
        error: "",
        Loading: false
      }

    case "REGISTER":
      return {
        ...state, 
        isAuthenticated: true, 
        user: action.payload,
        error: "",
        Loading: false
      }

    case "SET_LOADING":
      return {
        ...state, loading: action.payload
      }

    case "SET_ERROR": 
      return {
        ...state, 
        error: action.payload,
        user: {},
        isAuthenticated: false,
        visible: true
      }

    case "SET_ERR_MSG":
      return {
        ...state,
        error: action.payload
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: ""
      }

    case "SET_VISIBLE":
      return {
        ...state,
        visible: action.payload
      }

    case "CLEAR_USER":
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      return {
        ...state, 
        user: {},
        isAuthenticated: false
      }

    case "GOOGLE_LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", action.payload.user.userId);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true
      }

    case "SET_USER":
      return {
        ...state,
        user: action.payload
      }

    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload
      }

    case "ADD_IMAGE":
        return {
          ...state,
          tempImages: [...state.tempImages, action.payload],
          loaded: true
        }

    case "SET_FOLLOWING":
      return {
        ...state,
        isFollowing: action.payload
      }

    default:
      return state;
  }
}

export default authReducer;