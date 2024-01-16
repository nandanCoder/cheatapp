import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../featuchers/authSlice";
import roomSlice from "../featuchers/roomSlice";
const store = configureStore({
  name: "auth",
  reducer: {
    auth: authSlice,
    rooms: roomSlice,
  },
});
export default store;
