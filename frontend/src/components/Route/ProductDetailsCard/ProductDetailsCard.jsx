import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  //   const [select, setSelect] = useState(false);

  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
  <div className="bg-white">
    {data && (
      <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
        <div className="w-[95%] sm:w-[90%] lg:w-[70%] xl:w-[60%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg p-6 relative">
          {/* Close Button */}
          <RxCross1
            size={24}
            className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-black transition"
            onClick={() => setOpen(false)}
          />

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Product Images and Seller */}
            <div className="w-full md:w-1/2">
              <img
                src={data.images[0]?.url}
                alt={data.name}
                className="w-full h-auto rounded-md object-contain"
              />

              {/* Seller Info */}
              <div className="flex items-center gap-4 mt-4">
                <Link to={`/shop/preview/${data.shop._id}`} className="flex items-center gap-3">
                  <img
                    src={data.shop?.avatar?.url}
                    alt="Shop"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{data.shop.name}</h3>
                    <p className="text-xs text-gray-600">{data?.ratings || 0.0/5} Ratings</p>
                  </div>
                </Link>
              </div>

              {/* Message Seller */}
              <button
                className="mt-4 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition"
                onClick={handleMessageSubmit}
              >
                Send Message <AiOutlineMessage className="inline ml-1" />
              </button>

              <p className="text-sm text-gray-600 mt-3 font-medium">({data?.sold_out || 0}) Sold</p>
            </div>

            {/* Right: Product Info */}
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
              <p className="text-gray-600 text-sm mt-2">{data.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-xl font-semibold text-gray-800">Rs {data.discountPrice}</span>
                {data.originalPrice && (
                  <span className="line-through text-sm text-red-700">
                    Rs {data.originalPrice}
                  </span>
                )}
              </div>

              {/* Quantity and Wishlist */}
              <div className="flex justify-between items-center mt-8">
                <div className="flex items-center">
                  <button
                    className="bg-[#004E5d] text-white px-3 py-1 rounded-l hover:opacity-80 transition"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 text-gray-800 font-medium">
                    {count}
                  </span>
                  <button
                    className="bg-[#004E5d] text-white px-3 py-1 rounded-r hover:opacity-80 transition"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>

                <div>
                  {click ? (
                    <AiFillHeart
                      size={28}
                      className="text-red-500 cursor-pointer"
                      onClick={() => removeFromWishlistHandler(data)}
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={28}
                      className="text-gray-600 cursor-pointer hover:text-black"
                      onClick={() => addToWishlistHandler(data)}
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                className="mt-6 w-full bg-[#004E5d] text-white py-2 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-[#003845] transition"
                onClick={() => addToCartHandler(data._id)}
              >
                Add to cart <AiOutlineShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default ProductDetailsCard;
