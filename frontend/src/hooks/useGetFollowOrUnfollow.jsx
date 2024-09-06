import { SERVER_API } from "@/lib/utils";
import { setIsFollowing } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetFollowOrUnfollow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchFollowOrUnfollow = async () => {
      try {
        const res = await axios.post(
          `${SERVER_API}/user/followorunfollow/${user._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setIsFollowing(res.data.success));
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollowOrUnfollow();
  }, [dispatch]);
};

export default useGetFollowOrUnfollow;
