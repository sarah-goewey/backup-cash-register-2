import axios from "axios";

const items = (state = [], action) => {
  if (action.type === "SET_ITEMS") {
    return action.items;
  }
  return state;
};

export const fetchItems = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get(`/api/items`, {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_ITEMS", items: response.data });
  };
};

export default items;
