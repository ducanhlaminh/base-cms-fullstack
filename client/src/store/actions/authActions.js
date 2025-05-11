import api from "../../services/api";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "../reducers/authReducer";

// Login Action
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const response = await api.post("/auth/login", credentials);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: response.data.token,
        user: response.data.user,
      },
    });

    return Promise.resolve();
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || "Authentication failed",
    });

    return Promise.reject(error);
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Check Auth Status
export const checkAuthStatus = () => (dispatch, getState) => {
  const { auth } = getState();

  if (auth.token) {
    return true;
  }

  dispatch({ type: LOGOUT });
  return false;
};
