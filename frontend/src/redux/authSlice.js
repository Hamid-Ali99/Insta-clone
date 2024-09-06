import { createSlice } from "@reduxjs/toolkit";
import { followOrUnfollowUser } from "./userApi";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(followOrUnfollowUser.fulfilled, (state, action) => {
      if (state.userProfile) {
        const isFollowing = state.userProfile.followers.includes(
          state.user._id
        );
        if (isFollowing) {
          state.userProfile.followers = state.userProfile.followers.filter(
            (id) => id !== state.user._id
          );
        } else {
          state.userProfile.followers.push(state.user._id);
        }
      }
      if (state.user) {
        const isFollowing = state.user.following.includes(action.meta.arg);
        if (isFollowing) {
          state.user.following = state.user.following.filter(
            (id) => id !== action.meta.arg
          );
        } else {
          state.user.following.push(action.meta.arg);
        }
      }
    });
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
} = authSlice.actions;
export default authSlice.reducer;
