import { Link } from "react-router-dom";
import bgImage from "../assets/blog-1.jpg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="text-center space-y-8 p-10 bg-black bg-opacity-50 backdrop-blur-md rounded-xl shadow-xl">
        <h1 className="text-5xl font-extrabold text-white">
          Explore the World of Blogging
        </h1>
        <p className="text-lg text-gray-300">
          Dive into a universe of stories, share your experiences, and connect
          with like-minded individuals.
        </p>
        <div className="flex justify-center space-x-6">
          <Link to={"/login"} className="btn btn-info w-32">
            Start Your Journey
          </Link>
          <Link to={"/signup"} className="btn  btn-primary w-32">
            Join the Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
