import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }

    let hastedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hastedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log("error while register", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Error while login", error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error while logging out", error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    let user = await User.findById(userId)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks");

    return res.status(201).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("errror in getProfile", error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const { file: profilePicture } = req; // Changed to access `req.file`

    console.log(profilePicture);

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      // console.log(cloudResponse);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(201).json({
      message: "Profile update successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("errror in editProfile", error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUsers) {
      return res.status(401).json({
        message: "Currently no user found",
        success: false,
      });
    }
    return res.status(201).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("errror in getSuggestedUsers", error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followkernawala = req.userId;
    const jiskofollowkrongoga = req.params.id;

    if (followkernawala === jiskofollowkrongoga) {
      return res.status(400).json({
        message: "You cannot follow or unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followkernawala);
    const targetUser = await User.findById(jiskofollowkrongoga);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(jiskofollowkrongoga);

    if (isFollowing) {
      // unfollow logic
      await User.findByIdAndUpdate(followkernawala, {
        $pull: { following: jiskofollowkrongoga },
      });
      await User.findByIdAndUpdate(jiskofollowkrongoga, {
        $pull: { followers: followkernawala },
      });
      res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
        isFollowing: false,
      });
    } else {
      // follow logic
      await User.findByIdAndUpdate(followkernawala, {
        $addToSet: { following: jiskofollowkrongoga },
      });
      await User.findByIdAndUpdate(jiskofollowkrongoga, {
        $addToSet: { followers: followkernawala },
      });
      res.status(200).json({
        message: "Followed successfully",
        success: true,
        isFollowing: true,
      });
    }
  } catch (error) {
    console.log("Error in followOrUnfollow", error);
    res.status(500).json({
      message: "An error occurred",
      success: false,
      error: error.message,
    });
  }
};
