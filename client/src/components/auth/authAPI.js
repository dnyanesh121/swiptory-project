import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  loadUserSuccess,
  loadUserRequest,
  loadUserFailure,
} from "./authSlice";
import { getStoriesByUser } from "../story/storyAPI";

axios.defaults.withCredentials = true;
const apiRequest = async (dispatch, method, url, data = null) => {
  try {
    // Dispatch the appropriate request action based on the method
    const requestAction = {
      get: loadUserRequest,
      post: method === "login" ? loginRequest : method === "register" ? registerRequest : logoutRequest,
    }[method];
    
    if (requestAction) {
      dispatch(requestAction());
    }

    // Make the request
    const response = await axios[method](url, data);

    // Dispatch the success action and any additional actions based on the method
    const successAction = {
      get: loadUserSuccess,
      post: method === "login" ? loginSuccess : method === "register" ? registerSuccess : logoutSuccess,
    }[method];
    
    if (successAction) {
      dispatch(successAction(response.data));
    }

    // Perform additional actions based on the method
    if (method === "login") {
      dispatch(getStoriesByUser(response.data.userId));
      localStorage.setItem("username", JSON.stringify(response.data.username));
      toast.success("Login Successful", {
        position: "bottom-left",
        autoClose: 2000,
      });
    } else if (method === "register") {
      localStorage.setItem("username", JSON.stringify(response.data.username));
      toast.success("Register Successful", {
        position: "bottom-left",
        autoClose: 2000,
      });
    } else if (method === "logout") {
      localStorage.removeItem("username");
      toast.success("Logout Successful", {
        position: "bottom-left",
        autoClose: 1000,
      });
    }

    return response.data;
  } catch (error) {
    // Dispatch the failure action and handle errors
    const failureAction = {
      get: loadUserFailure,
      post: method === "login" ? loginFailure : method === "register" ? registerFailure : logoutFailure,
    }[method];

    if (failureAction) {
      dispatch(failureAction());
    }

    toast.error(error.response.data);

    throw error;
  }
};

export const loadUser = () => async (dispatch) => {
  const username = JSON.parse(localStorage.getItem("username"));
  return apiRequest(dispatch, "get", `/load/${username}`);
};

export const register = (values) => async (dispatch) => {
  return apiRequest(dispatch, "post", "/api/user/register", values);
};

export const login = (values) => async (dispatch) => {
  return apiRequest(dispatch, "post", "/login", values);
};

export const logout = () => async (dispatch) => {
  return apiRequest(dispatch, "post", "/api/user/logout");
};
