import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import styles from "../../../styles/styles";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
return (
  <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
    {/* Logo */}
    <div>
      <Link to="/dashboard">
        <img
          src="https://i.ibb.co/8KNKx97/Logo.png"
          alt="Logo"
          style={{
            height: "80px",
            width: "auto",
            filter:
              "sepia(1) hue-rotate(170deg) saturate(400%) brightness(0.4)",
          }}
        />
      </Link>
    </div>

    {/* Go to Website Button */}
    {/* <div className={`${styles.button}`}>
      
    </div> */}

    {/* Dashboard Icons and Seller Avatar */}
    <div className="flex items-center">
      <Link to="/">
        <h1 className="text-white bg-black px-4 py-2 rounded-md mt-0 flex items-center">Go to Website</h1>
      </Link>

      <Link to="/dashboard/cupouns" className="hidden 800px:block">
        <AiOutlineGift color="#555" size={30} className="mx-5 cursor-pointer" />
      </Link>
      <Link to="/dashboard-events" className="hidden 800px:block">
        <MdOutlineLocalOffer
          color="#555"
          size={30}
          className="mx-5 cursor-pointer"
        />
      </Link>
      <Link to="/dashboard-products" className="hidden 800px:block">
        <FiShoppingBag
          color="#555"
          size={30}
          className="mx-5 cursor-pointer"
        />
      </Link>
      <Link to="/dashboard-orders" className="hidden 800px:block">
        <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
      </Link>
      <Link to="/dashboard-messages" className="hidden 800px:block">
        <BiMessageSquareDetail
          color="#555"
          size={30}
          className="mx-5 cursor-pointer"
        />
      </Link>
      <Link to={`/shop/${seller._id}`}>
        <img
          src={seller.avatar?.url}
          alt="Seller"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
      </Link>
    </div>
  </div>
  );

};

export default DashboardHeader;
