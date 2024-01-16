import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addRoom: (state, action) => {
      state.push(action.payload);
    },
  },
});
export const { addRoom } = authSlice.actions;

export default authSlice.reducer;
