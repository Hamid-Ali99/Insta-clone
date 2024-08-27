import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { SERVER_API } from "@/lib/utils";
import { setPosts } from "@/redux/postSlice";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(`${SERVER_API}/post/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
          console.log(res.data.posts);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAllPosts();
  }, []);
};
export default useGetAllPost;
