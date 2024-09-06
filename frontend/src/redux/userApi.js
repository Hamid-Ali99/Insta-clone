import { SERVER_API } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const followOrUnfollowUser = createAsyncThunk(
  "user/followorunfollow",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${SERVER_API}/user/followorunfollow/${userId}`,
        {}, // empty object as body
        {
          withCredentials: true, // This line is crucial
        }
      );
      return res.data;
    } catch (error) {
      console.log("Error in followOrUnfollowUser", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
