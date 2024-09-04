import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { SERVER_API } from "@/lib/utils";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `${SERVER_API}/message/all/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAllMessages();
  }, [selectedUser]);
};
export default useGetAllMessages;
