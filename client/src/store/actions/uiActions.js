import { TOGGLE_SIDEBAR, SET_SIDEBAR_COLLAPSED } from "../reducers/uiReducer";

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
});

export const setSidebarCollapsed = (collapsed) => ({
  type: SET_SIDEBAR_COLLAPSED,
  payload: collapsed,
});
