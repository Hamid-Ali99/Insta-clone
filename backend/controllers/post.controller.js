import sharp from "sharp";

import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image)
      return res.status(401).json({
        message: "image is required",
      });

    // optimize the image
    const optimizeImageBuffer = await sharp(image.buffer)
      .resize({ height: 800, width: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // get image uri
    const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString(
      "base64"
    )}`;

    // upload to cloud
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post Added",
      post,
      success: true,
    });
  } catch (error) {
    console.log("Error in addNewPost", error);
  }
};

export const getAllPost = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error in getAllPost", error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const userId = req.id;

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(201).json({ posts, success: true });
  } catch (error) {
    console.log("Error in getUserPost", error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(401)
        .json({ message: "Post not found", success: false });

    // like logic
    await post.updateOne({ $addToSet: { likes: likeKarneWaleUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKarneWaleUserKiId).select(
      "username profilePicture"
    );

    const postOwnerId = await post.author.toString();

    if (postOwnerId !== likeKarneWaleUserKiId) {
      // emit notification event
      const notification = {
        type: "like",
        userId: likeKarneWaleUserKiId,
        userDetails: user,
        postId,
        message: "your post was liked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(201).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log("Error in likePost", error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(401)
        .json({ message: "Post not found", success: false });

    // dislike post logic
    await post.updateOne({ $pull: { likes: likeKarneWaleUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKarneWaleUserKiId).select(
      "username profilePicture"
    );
    const postOwnerId = await post.author.toString();
    if (postOwnerId !== likeKarneWaleUserKiId) {
      // emit notification event
      const notification = {
        type: "dislike",
        userId: likeKarneWaleUserKiId,
        userDetails: user,
        postId,
        message: "your post was disliked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(201).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log("Error in dislikePost", error);
  }
};

export const addComment = async (req, res) => {
  try {
    const commentKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!text)
      return res
        .status(401)
        .json({ message: "Text is required", success: false });

    const comment = await Comment.create({
      text,
      post: postId,
      author: commentKarneWaleUserKiId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    await post.comments.push(comment._id);
    await post.save();

    return res
      .status(201)
      .json({ message: "Comment Added", success: true, comment });
  } catch (error) {
    console.log("Error in addComment", error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!comments)
      res.status(401).json({
        message: "No comments found for this post",
        success: false,
      });

    res.status(201).json({
      comments,
      success: true,
    });
  } catch (error) {
    console.log("Error in getCommentsOfPost", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const authorId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(404).json({ message: "Unauthorized", success: false });
    }

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post
    const user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    res.status(201).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    console.log("Error in deletePost", error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const authorId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post)
      res.status(401).json({
        message: "post not found",
        success: false,
      });

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(201).json({
        type: "unsaved",
        message: "removed from bookmarks",
        success: true,
      });
    } else {
      // bookmark the post
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(201).json({
        type: "saved",
        message: "Post saved",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error in bookmarkPost", error);
  }
};
