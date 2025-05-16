import React, { useState, useEffect,  useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiFillCamera,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
const axios=require("axios");

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate=useNavigate();

  // const handleImageSearch = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   console.log(" File selected:", file);
  
  //   const formData = new FormData();
  //   formData.append("image", file);
  
  //   try {
  //     console.log(" Sending image to Flask API...");
  
  //     const response = await fetch("http://127.0.0.1:5000/compare", {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Server responded with ${response.status}: ${errorText}`);
  //     }
  
  //     const data = await response.json();
  //     console.log("API Response:", data);
  
  //     if (data.results) {
  //       setSearchData(data.results);
  //     } else {
  //       console.warn(" No results found in API response");
  //       setSearchData([]);
  //     }
  //   } catch (error) {
  //     console.error(" Image search failed:", error.message);
  //     setSearchData([]);
  //   }
  // };

  
const handleImageSearch = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("http://127.0.0.1:5000/compare", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.results && data.results.length > 0) {
      navigate("/search", { state: { results: data.results } });
    } else {
      navigate("/search", { state: { results: [] } });
    }
  } catch (error) {
    console.error("Image search failed:", error.message);
    navigate("/search", { state: { results: [] } });
  }
};
  
  
  

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchData([]); // Close dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearchData]);

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                  src="https://i.ibb.co/8KNKx97/Logo.png"
                  alt="Logo"
                  style={{
                    height: "80px",
                    width: "auto",
                    filter: "sepia(1) hue-rotate(170deg) saturate(400%) brightness(0.4)"
                  }}
              />
            </Link>
          </div>
          {/* search box */}
           <div  ref={searchRef} className=" w-[50%] flex items-center gap-2 relative">
            {/* Text Search Box */}
             <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={25}
                className="absolute right-2 top-2 cursor-pointer text-[#3957db]"
              />
            </div> 

            {/* Image Search Button */}
             <div className="relative">
              
              <button
                onClick={() => document.getElementById("imageSearchInput").click()}
                className="w-10 h-10 rounded-full bg-[#004E5d] text-white flex items-center justify-center hover:bg-[#050f0a] transition"
                title="Search by Image"
              >
                <AiFillCamera size={20} />
              </button>


              <input
                id="imageSearchInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSearch}
              />
            </div> 

            {/* Search Result Dropdown */}
            {searchData && searchData.length !== 0 ? (
              <div className="absolute top-[45px] left-0 w-[93%] bg-white border rounded-md shadow-lg max-h-[50vh] overflow-y-auto z-50">
                {searchData.map((i) => (
                  <Link to={`/product/${i._id}`} key={i._id}>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 transition">
                      <img
                        src={`${i.images[0]?.url}`}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                      <h1 className="text-sm font-semibold text-gray-800 truncate">{i.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div> 




          <div className={`${styles.button}`}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Go To Dashboard" : "Become Seller"}{" "}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#004E5d] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 font-sans bg-zinc-100 text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-black w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-black w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
      className={`${
        active ? "fixed top-0 left-0 z-20 shadow bg-white" : ""
      } w-full h-[60px] bg-white z-50 800px:hidden`}
    >
      <div className="w-full h-full flex items-center justify-between px-4">
        {/* Menu Icon */}
        <BiMenuAltLeft
          size={32}
          className="text-gray-700 cursor-pointer"
          onClick={() => setOpen(true)}
        />

        {/* Logo */}
        <Link to="/">
          <img
            src="https://i.ibb.co/8KNKx97/Logo.png"
            alt="Logo"
             style={{
                    height: "50px",
                    width: "auto",
                    filter: "sepia(1) hue-rotate(170deg) saturate(400%) brightness(0.4)"
                  }}
          />
        </Link>

        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
          <AiOutlineShoppingCart size={28} className="text-gray-800" />
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {cart?.length || 0}
          </span>
        </div>

        {openCart && <Cart setOpenCart={setOpenCart} />}
        {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
      </div>

      {/* Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40">
          <div className="fixed top-0 left-0 w-[80%] max-w-sm h-full bg-white z-50 shadow-lg overflow-y-auto px-4 pt-6 pb-10">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  setOpenWishlist(true);
                  setOpen(false);
                }}
              >
                <AiOutlineHeart size={24} className="text-gray-700" />
                <span className="absolute -top-1 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist?.length || 0}
                </span>
              </div>
              <RxCross1
                size={24}
                className="text-gray-700 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Search Box */}
            <div className="relative w-full mb-6">
              <input
                type="search"
                placeholder="Search Product..."
                className="w-full h-10 px-3 border border-blue-600 rounded-md"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchData?.length > 0 && (
                <div className="absolute w-full bg-white shadow-md rounded-md mt-2 z-50 p-2 max-h-[200px] overflow-y-auto">
                  {searchData.map((i) => {
                    const Product_name = i.name.replace(/\s+/g, "-");
                    return (
                      <Link
                        key={i._id}
                        to={`/product/${Product_name}`}
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
                          <img
                            src={i.images?.[0]?.url}
                            alt={i.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <h5 className="text-sm font-medium text-gray-700 truncate">
                            {i.name}
                          </h5>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation */}
            <Navbar active={activeHeading} />

            {/* Become Seller */}
            <div className="mt-4 flex justify-center">
              <Link
                to="/shop-create"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#004E5d] text-white text-sm rounded hover:bg-[#003B44] transition"
              >
                Become Seller <IoIosArrowForward className="ml-1" />
              </Link>
            </div>

            {/* Auth Links */}
            <div className="mt-6 flex justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/profile">
                <img
                  src={user?.avatar?.url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-black"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          </div>
        </div>
      )}
    </div>

    </>
  );
};

export default Header;
