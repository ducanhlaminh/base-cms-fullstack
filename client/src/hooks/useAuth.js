import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/actions/authActions";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const loginUser = useCallback(
    async (credentials) => {
      try {
        await dispatch(login(credentials));
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
  };
};

export default useAuth;
