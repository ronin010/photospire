
const initialState = {
  currentActive: {},
  images: [],
  newImage: null,
  previewImage: null,
  likes: [],
  likesLength: 0,
  likeColor: "black",
  imageLoaded: false,
  newComment: "",
  imagesByTag: [],
  followingImages: [],
  feedPosts: [],
  following: [],
  followers: [],
  followingLength: 0,
  followerLength: 0
}

const imageReducer = (state = initialState, action) => {
  switch(action.type) {
    case "SET_ACTIVE":
      return {
        ...state,
        currentActive: action.payload
      }

    case "SET_USER_IMAGES":
      return {
        ...state,
        images: [...state.images, action.payload]
      }

    case "ADD_IMAGE":
      return {
        ...state,
        images: [...state.images, action.payload]
      }

      case "SET_NEW_IMAGE":
        return {
          ...state,
          newImage: action.payload
        }

      case "SET_LIKES":
        return {
          ...state,
          likes: [...state.likes, action.payload],
          
        }

      case "INCREMENT_LIKES":
        return {
          ...state,
          likesLength: state.likesLength + 1
        }

      case "DECREMENT_LIKES":
        return {
          ...state,
          likesLength: state.likesLength - 1
        }

      case "SET_LENGTH":
        return {
          ...state,
          likesLength: action.payload
        }

      case "SET_COLOR":
        return {
          ...state,
          likeColor: action.payload
        }

      case "SET_IMAGE":
        return {
          ...state,
          newImage: action.payload.newImage,
          previewImage: action.payload.previewImage,
          imageLoaded: true
        }

      case "SET_COMMENT":
        return {
          ...state,
          newComment: action.payload
        }

      case "SET_IMAGES_BY_TAG":
        return {
          ...state,
          imagesByTag: action.payload
        }

      case "SET_FOLLOWING_IMAGES":
        return {
          ...state,
          followingImages: [...state.followingImages, action.payload]
        }

      case "SET_FEED_POSTS":
        return {
          ...state,
          feedPosts: [...state.feedPosts, action.payload]
        }

      case "SET_FOLLOWERS": 
        return {
          ...state,
          followers: [...state.followers, action.payload.followers],
          following: [...state.following, action.payload.following]
        }

      case "SET_FOLLOWING_LENGTH": 
        return {
          ...state,
          followerLength: action.payload.followerLength,
          followingLength: action.payload.followingLength
        }

      case "INCREMENT_FOLLOWER":
        return {
          ...state,
          followerLength: state.followerLength + 1
        }

      case "DECREMENT_FOLLOWER":
        return {
          ...state,
          followerLength: state.followerLength - 1
        }

    default:
      return state;
  }
}

export default imageReducer;