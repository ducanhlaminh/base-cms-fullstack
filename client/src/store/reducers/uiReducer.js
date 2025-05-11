// Action Types
export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
export const SET_SIDEBAR_COLLAPSED = "SET_SIDEBAR_COLLAPSED";

// Initial State
const initialState = {
  sidebarCollapsed: false,
};

// Reducer
const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    case SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;
