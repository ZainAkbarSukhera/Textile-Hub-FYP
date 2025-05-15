import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center px-4 py-12">
      <Lottie options={defaultOptions} width={250} height={250} />

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-6">
        Order Placed Successfully!
      </h2>
      <p className="text-gray-500 mt-2 text-sm md:text-base">
        Thank you for your purchase. We hope you enjoy your order!
      </p>

      <Link to="/" className="mt-6">
        <button className="px-6 py-3 rounded-md bg-[#004E5d] text-white font-medium hover:bg-[#053a41] transition duration-300">
          Keep Surfing the Website
        </button>
      </Link>
    </div>
  );
};

export default OrderSuccessPage;