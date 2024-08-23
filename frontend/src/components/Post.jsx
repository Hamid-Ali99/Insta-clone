import { useState } from "react";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { FaRegHeart } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

import CommentDialog from "./CommentDialog";

const Post = () => {
  const [openCommentModel, setOpenCommentModel] = useState(false);
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={"/profile.png"} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>username</h1>
          </div>
        </div>
        <Dialog>
          <DialogTitle>
            <VisuallyHidden.Root></VisuallyHidden.Root>
          </DialogTitle>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            className="flex flex-col items-center text-sm text-center"
          >
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>

            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={"https://pixlr.com/images/index/ai-image-generator-one.webp"}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {/* <FaHeart size={"24"} className="cursor-pointer text-red-600" /> */}
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle
            onClick={() => setOpenCommentModel(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      <span className="font-medium block mb-2">1000 likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>

      <span
        onClick={() => setOpenCommentModel(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all 10 comments
      </span>

      <CommentDialog
        openCommentModel={openCommentModel}
        setOpenCommentModel={setOpenCommentModel}
      />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
