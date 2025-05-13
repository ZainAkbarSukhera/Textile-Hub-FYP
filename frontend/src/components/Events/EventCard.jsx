// import React, { useState, useEffect } from "react";
// import styles from "../../styles/styles";
// import CountDown from "./CountDown";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addTocart } from "../../redux/actions/cart";
// import { toast } from "react-toastify";
// import axios from "axios"; // Import axios for API requests



// const EventCard = ({ active, data }) => {
//   const { cart } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();

//   // State for handling the bid amount and user data
//   const [bidAmount, setBidAmount] = useState("");
//   // Handle bid amount change
//   const handleBidAmountChange = (e) => {
//     setBidAmount(e.target.value);
//   };

//   // Handle adding item to cart
//   const addToCartHandler = (data) => {
//     const isItemExists = cart && cart.find((i) => i._id === data._id);
//     if (isItemExists) {
//       toast.error("Item already in cart!");
//     } else {
//       if (data.stock < 1) {
//         toast.error("Product stock limited!");
//       } else {
//         const cartData = { ...data, qty: 1 };
//         dispatch(addTocart(cartData)); // Add to Redux cart state
//         toast.success("Item added to cart successfully!");
//       }
//     }
//   };

//   const placeBidHandler = async () => {
//     if (!bidAmount || bidAmount <= 0) {
//       toast.error("Please enter a valid bid amount.");
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/v2/event/place-bid/${data._id}`, // Replace :id with data._id
//         {
//           bidAmount: parseFloat(bidAmount), // Parse the bid amount to float
//         },
//         {
//           withCredentials: true, // Ensure cookies are sent with the request
//         }
//       );
  
//       toast.success(response.data.message);
//       setBidAmount(""); // Clear the bid input field after successful bid
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong!");
//     }
//   };
//   return (
//     <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
//       <div className="w-full lg:w-[50%] m-auto">
//         <img src={`${data.images[0]?.url}`} alt={data.name} />
//       </div>
//       <div className="w-full lg:w-[50%] flex flex-col justify-center">
//         <h2 className={`${styles.productTitle}`}>{data.name}</h2>
//         <p>{data.description}</p>
//         <div className="flex py-2 justify-between">
//           <div className="flex">
//             <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
//               {data.originalPrice}$
//             </h5>
//             <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
//               {data.discountPrice}$
//             </h5>
//           </div>
//           <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
//             {data.sold_out} sold
//           </span>
//         </div>
//         <CountDown data={data} />
//         <br />

//         {/* Bid input */}
//         <div className="flex items-center py-4">
//           <input
//             type="number"
//             placeholder="Enter bid amount"
//             value={bidAmount}
//             onChange={handleBidAmountChange}
//             className="border p-2 rounded w-40"
//           />
//           <button onClick={placeBidHandler} className={`${styles.button} text-[#fff] ml-5`}>
//             Place Bid
//           </button>
//         </div>

//         {/* Add to cart and See Details buttons */}
//         <div className="flex items-center">
//           <Link to={`/product/${data._id}?isEvent=true`}>
//             <div className={`${styles.button} text-[#fff]`}>See Details</div>
//           </Link>
//           <div
//             className={`${styles.button} text-[#fff] ml-5`}
//             onClick={() => addToCartHandler(data)}
//           >
//             Add to cart
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;


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
    <div
      className={`w-full max-w-md bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden 
      transition-all duration-500 ease-out ${
        animationPhase === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${isExpanded ? "shadow-2xl scale-105" : "shadow-lg hover:shadow-xl"}`}
    >
      {/* Ribbon */}
      {discountPercentage > 0 && (
        <div className="absolute -right-12 top-6 bg-red-500 text-white py-1 px-12 transform rotate-45 z-10 shadow-md">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Image Container */}
      <div 
        className="relative w-full cursor-pointer" 
        onClick={toggleExpand}
      >
        <div className="absolute inset-0 bg-black/50 mix-blend-multiply z-0"></div>
        <img
          src={data.images[0]?.url}
          alt={data.name}
          className={`w-full object-cover transition-all duration-700 ${
            isExpanded ? "h-64 grayscale-0" : "h-56 grayscale-[30%]"
          }`}
        />
        
        {/* Floating Info Card */}
        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 truncate">{data.name}</h2>
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 text-xs line-through">${data.originalPrice}</span>
              <span className="text-red-500 font-bold text-lg">${data.discountPrice}</span>
            </div>
            <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {data.sold_out} sold
            </div>
          </div>
        </div>
        
        {/* Countdown Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center">
          <div className="bg-black/80 backdrop-blur-md rounded-lg px-4 py-2 inline-block">
            <CountDown data={data} />
          </div>
        </div>
      </div>

      {/* Content Area with Floating Effect */}
      <div className={`relative bg-white p-5 transition-all duration-500 ${
        isExpanded ? "-mt-6" : "-mt-2"
      } rounded-t-3xl z-20 shadow-lg`}>
        
        {/* Pull Handle Indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full"></div>
        
        {/* Description with Expand/Collapse */}
        <div className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-40 mt-4" : "max-h-12 mt-2"
        }`}>
          <p className="text-gray-600 text-sm">{data.description}</p>
        </div>
        
        {/* Highest Bid Display */}
        {data.currentHighestBid && (
          <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 border-l-4 border-amber-500">
            <div className="flex justify-between items-center">
              <span className="text-amber-800 font-medium">Current Highest Bid</span>
              <span className="text-amber-800 font-bold text-lg">
                ${data.currentHighestBid}
              </span>
            </div>
          </div>
        )}

        {/* Bidding Interface */}
        <div className="mt-4">
          <div className="relative group">
            <input
              type="number"
              placeholder="Enter your bid amount..."
              value={bidAmount}
              onChange={handleBidAmountChange}
              className="w-full bg-gray-50 border-0 rounded-xl p-4 pr-24 focus:ring-2 focus:ring-red-400 
              focus:bg-white shadow-inner transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
              <button
                onClick={placeBidHandler}
                className="h-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 
                rounded-lg font-medium transform transition-all duration-300 
                group-hover:scale-105 hover:shadow-md"
              >
                Bid Now
              </button>
            </div>
          </div>

          {/* Action Buttons with Creative Styling */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link to={`/product/${data._id}?isEvent=true`} className="group">
              <button className="w-full bg-gray-800 text-gray-200 px-4 py-3 rounded-xl font-medium
                overflow-hidden relative transition-all duration-300 group-hover:shadow-lg">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-600 to-gray-500 
                  transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative z-10">See Details</span>
              </button>
            </Link>
            <button
              onClick={addToCartHandler}
              className="w-full bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-3 
              rounded-xl font-medium relative overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 
              origin-left transition-transform duration-300 mix-blend-soft-light"></span>
              <span className="relative flex items-center justify-center gap-2">
                <span>Add to Cart</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;