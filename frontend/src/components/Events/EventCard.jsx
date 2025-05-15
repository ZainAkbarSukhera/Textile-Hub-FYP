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