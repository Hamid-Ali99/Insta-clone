import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  // Here you would fetch data from your backend API and map over it to create Post components.
  const { posts } = useSelector((state) => state.post);
  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
