import { SERVER_API } from "@/lib/utils";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${SERVER_API}/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          // const sortedPosts = res.data.user.posts.sort(
          //   (a, b) => b.createdAt - a.createdAt
          // );
          dispatch(setUserProfile(res.data.user));
          console.log(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId, dispatch]);
};
export default useGetUserProfile;
