import {combineReducers} from "redux";
import authReducer from "./authReducer";
import imageReducer from "./imageReducer";
import searchReducer from "./searchReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  images: imageReducer,
  search: searchReducer
})

export default rootReducer;