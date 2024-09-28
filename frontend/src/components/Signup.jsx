import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import logo from "../images/pixAura_logo.png";

const Signup = () => {
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message, {
          theme: "dark",
        });
        navigate("/");
        setInput({ username: "", email: "", password: "" });
      }
    } catch (err) {
      console.error(err); // Log error details
      toast.error(err.response?.data?.message || "An error occurred", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    alert(
      "1. Please sign up with your correct email because there is no verification step yet.\n" +
        "2. Please remember your password because there is no forgotten password feature yet.\n" +
        "3. If any problem occurs, please send an email to: 89543633a@gmail.com (Ajay)."
    );
  }, []);

  return (
    <div className="flex items-center w-screen  h-auto justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-48 h-auto md:w-64 lg:w-72"
            />
          </div>
          <h1 className="text-center font-bold text-xl mt-4">Welcome!</h1>
          <p className="text-sm text-center mt-2">
            Signup to see photos and videos from your friends
          </p>
        </div>

        <div className="mb-4">
          <span className="font-medium">Username</span>
          <input
            className="w-full border border-gray-300 rounded-md p-2 my-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <span className="font-medium">Email</span>
          <input
            className="w-full border border-gray-300 rounded-md p-2 my-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <span className="font-medium">Password</span>
          <input
            className="w-full border border-gray-300 rounded-md p-2 my-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Enter your password"
          />
        </div>

        {loading ? (
          <button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </button>
        ) : (
          <Button className="px-6 py-2 bg-[#610C9F] text-white rounded-md hover:bg-[#940B92] transition-colors duration-300 ease-in-out shadow-md">
            Signup
          </Button>
        )}

        <span className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#DA0C81] hover:text-[#E95793] transition-colors duration-200"
          >
            <Button className="px-4 py-2 bg-[#DA0C81] text-white rounded-md hover:bg-[#E95793] transition-colors duration-300 ease-in-out shadow-md">
              Login
            </Button>
          </Link>
        </span>
      </form>

      <div class="fixed bottom-0 w-full text-center py-2 bg-purple-900 text-sm text-white">
        Made with <span class="text-purple-400">❤️</span> | Developed by{" "}
        <a
          href="https://www.instagram.com/ajay__8954/"
          class="text-white-400 bg-black-600 font-semibold hover:underline hover:text-purple-300 transition duration-200"
        >
          Ajay
        </a>{" "}
        <br />
        <a
          className="text-decoration:none"
          href="https://www.linkedin.com/in/ajay-kumar-243136259/"
        >
          Click here to know more
        </a>
      </div>
    </div>
  );
};

export default Signup;
