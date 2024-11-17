import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useRegisterMutation } from "../../ReduxToolkit/api/userApiSlice";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../ReduxToolkit/features/auth/authSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User registered successfully");
    } catch (error) {
      console.log(error);
      toast.warn(error?.data?.msg || error.message);
    }
  };

  return (
    <section className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form className="container w-[40rem]" onSubmit={submitHandler}>
          <div className="my-[2rem]">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="my-[2rem]">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect${redirect}` : `/login`}
              className="text-blue-500 hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://img.freepik.com/premium-photo/hand-holds-list-with-marks-3d-render-illustration_567294-1906.jpg?uid=R158812868&ga=GA1.1.969974228.1723491158&semt=ais_hybrid"
        alt=""
        className="h-auto mt-10 xl:block md:hidden sm:hidden rounded-3xl"
      />
    </section>
  );
};

export default Register;
