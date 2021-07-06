const initialState = {
    results: [],
    users: [],
    loaded: false,
    userMessage: "",
    imageMessage: ""
}

const searchReducer = (state = initialState, action) => {
  switch(action.type) {
    case "SET_RESULTS":
      return {
          ...state,
          results: [...state.results, action.payload]
      }

    case "SET_USERS":
      return {
        ...state,
        users: [...state.users, action.payload]
      }

    case "SET_LOADED":
      return {
        ...state,
        loaded: action.payload
      }

    case "SET_USER_MESSAGE":
      return {
        ...state,
        userMessage: action.payload
      }

    case "SET_IMAGE_MESSAGE":
      return {
        ...state,
        imageMessage: action.payload
      }

    default:
      return state;
  }
} 

export default searchReducer;