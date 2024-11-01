// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    following: {}, // Store following status for users
  },
  reducers: {
    setFollowing: (state, action) => {
      const { userId, isFollowing } = action.payload;
      state.following[userId] = isFollowing;
    },
  },
});

export const { setFollowing } = userSlice.actions;
export default userSlice.reducer;
