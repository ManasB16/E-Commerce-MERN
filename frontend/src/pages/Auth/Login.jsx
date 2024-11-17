import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../ReduxToolkit/api/userApiSlice";
import { setCredentials } from "../../ReduxToolkit/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // console.log(email, password);
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      toast.success("Login successful");
    } catch (error) {
      toast.error(error?.data?.msg || error.message);
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Log In</h1>

          <form className="container w-[40rem]" onSubmit={submitHandler}>
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="mt-1 p-2 border rounded w-full"
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
                placeholder="Enter password"
                className="mt-1 p-2 border rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? "Loggin In..." : "Log In"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-4">
            <p className="text-white">
              New Customer ?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-blue-600 hover:underline ml-1"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
        <img
          src="https://img.freepik.com/premium-vector/modern-design-concept-logged-design_637684-220.jpg?uid=R158812868&ga=GA1.1.969974228.1723491158&semt=ais_hybrid"
          alt=""
          className="h-auto mt-10 xl:block md:hidden sm:hidden rounded-3xl"
        />
      </section>
    </div>
  );
};

export default Login;
