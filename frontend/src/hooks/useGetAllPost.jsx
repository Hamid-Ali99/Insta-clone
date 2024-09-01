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
          const sortedPosts = res.data.posts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          dispatch(setPosts(sortedPosts));
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAllPosts();
  }, [dispatch]);
};
export default useGetAllPost;
