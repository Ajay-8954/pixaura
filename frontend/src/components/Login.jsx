import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import logo from "../images/pixAura_logo.png";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);
  console.log(user);
  const navigate = useNavigate();

  // dispatching username =>calling function of redux

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://pixaura.onrender.com/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      //using dispatch

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));

        // if user get login successfully the we navigate it to home page
        toast.success(res.data.message, {
          theme: "dark",
        });
        navigate("/");

        setInput({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message, {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
        navigate("/");
    }
},[])

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        action=""
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
            Login to see photos and videos from your friends
          </p>
        </div>

        <div className="mb-4">
          <label className="font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            value={input.email}
            onChange={changeEventHandler}
            className="w-full border border-gray-300 rounded-md p-2 my-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="text"
            name="password"
            id="password"
            value={input.password}
            onChange={changeEventHandler}
            className="w-full border border-gray-300 rounded-md p-2 my-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        {/* //implementing loader */}

        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button className="bg-[#610C9F] text-[#FFFFFF] hover:bg-[#940B92]">
            Login
          </Button>
        )}

        <span className="text-center">
          Doesn't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            <Button className="px-4 py-2 bg-[#DA0C81] text-white rounded-md hover:bg-[#E95793] transition-colors duration-300 ease-in-out shadow-md">
              Signup
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
        </a>
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

export default Login;
