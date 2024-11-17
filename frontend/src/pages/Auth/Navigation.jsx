import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../ReduxToolkit/api/userApiSlice";
import { logout } from "../../ReduxToolkit/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const togleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.error("Logged out");
      setDropdownOpen(!dropdownOpen);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between items-center p-2 text-white bg-black w-[5%] hover:w-[10%] ease-in-out duration-700 h-screen fixed overflow-hidden group`}
      // id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden group-hover:block mt-[3rem]">HOME</span>{" "}
        </Link>
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden group-hover:block mt-[3rem]">SHOP</span>{" "}
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden group-hover:block mt-[3rem]">CART</span>{" "}
        </Link>
        <Link
          to="/favourite"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden group-hover:block mt-[3rem]">
            WISHLIST
          </span>{" "}
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center text-gray-800 focus:outline-none ${
            !userInfo?.isAdmin ? "mb-5" : ""
          }`}
        >
          {userInfo ? (
            <span className="text-white font-semibold">
              {userInfo.username}
            </span>
          ) : (
            <></>
          )}
          {userInfo && (
            <RiArrowDropDownLine
              className={`${
                dropdownOpen ? "transform rotate-180" : ""
              } text-white font-bold text-xl mt-1`}
            />
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute space-y-1 bg-gray-900 text-gray-600 ${
              !userInfo.isAdmin ? "bottom-16" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    Users
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul className="mb-10">
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden group-hover:block mt-[3rem]">
                LOGIN
              </span>{" "}
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden group-hover:block mt-[3rem]">
                REGISTER
              </span>{" "}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
