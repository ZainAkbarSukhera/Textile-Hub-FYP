import React, { useState, useEffect } from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import axios from "axios";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [bidAmount, setBidAmount] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Add a staggered entrance animation effect
    const timer = setTimeout(() => setAnimationPhase(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBidAmountChange = (e) => setBidAmount(e.target.value);

  const addToCartHandler = () => {
    if (cart.some((i) => i._id === data._id)) {
      toast.error("Item already in cart!");
      return;
    }
    if (data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Item added to cart successfully!");
  };

  const placeBidHandler = async () => {
    if (!bidAmount || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v2/event/place-bid/${data._id}`,
        { bidAmount: parseFloat(bidAmount) },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setBidAmount("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
  );

return (
  <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 relative">
    {/* Discount Ribbon */}
    {discountPercentage > 0 && (
      <div className="absolute -right-6 top-6 bg-red-600 text-white py-1 px-8 transform rotate-45 z-10 text-xs font-semibold shadow">
        {discountPercentage}% OFF
      </div>
    )}

    {/* Image Section */}
    <div className="relative w-full cursor-pointer" onClick={toggleExpand}>
      <img
        src={data.images[0]?.url}
        alt={data.name}
        className="w-full h-48 object-cover grayscale-[10%]"
      />
      {/* Countdown */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10">
        <div className="bg-white/80 px-4 py-1 rounded-md shadow text-xs font-medium text-gray-800">
          <CountDown data={data} />
        </div>
      </div>
    </div>

    {/* Info & Actions */}
    <div className="p-5 flex flex-col justify-between min-h-[260px]">
      {/* Product Name */}
      <h2 className="text-md font-medium text-gray-800 mb-1 truncate">
        {data.name}
      </h2>

      {/* Price & Sold */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-baseline space-x-2">
          <span className="line-through text-sm text-red-600">Rs {data.originalPrice}</span>
          <span className="text-base font-bold text-gray-800">Rs {data.discountPrice}</span>
        </div>
        <span className="text-sm text-gray-700">{data.sold_out} sold</span>
      </div>

      {/* Current Highest Bid */}
      <div className="bg-amber-100 rounded-md px-4 py-2 border-l-4 border-amber-500 mb-3">
        <div className="flex justify-between items-center text-amber-800 text-sm font-semibold">
          <span>Current Highest</span>
          <span>Rs {data.currentHighestBid || 0}</span>
        </div>
      </div>

      {/* Bid Input */}
      <div className="relative mb-4">
        <input
          type="number"
          placeholder="Enter your bid..."
          value={bidAmount}
          onChange={handleBidAmountChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={placeBidHandler}
          className="absolute top-1 right-1 h-8 px-4 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Bid Now
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Link to={`/product/${data._id}?isEvent=true`}>
          <button className="w-full text-sm bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition">
            See Details
          </button>
        </Link>
        <button
          onClick={addToCartHandler}
          className="w-full text-sm bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);


};

export default EventCard;