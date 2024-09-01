import { SERVER_API } from "@/lib/utils";
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${SERVER_API}/user/suggested`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
          // console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetSuggestedUsers;
