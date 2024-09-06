import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    // isFollowing: false,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    // setIsFollowing: (state, action) => {
    //   state.isFollowing = action.payload;
    // },
  },
});

export const {
  setPosts,
  setSelectedPost,
  // setIsFollowing
} = postSlice.actions;

export default postSlice.reducer;
