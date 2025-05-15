import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import styles from "../../../styles/styles"; 

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const handleWishlistToggle = () => {
    setClick(!click);
    if (click) {
      dispatch(removeFromWishlist(data));
    } else {
      dispatch(addToWishlist(data));
    }
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-64 max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Product Image */}
      <Link
        to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}
        className="relative"
      >
        <img
          src={data.images?.[0]?.url}
          alt={data.name}
          className="w-full h-60 object-fill rounded-t-lg p-4"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        {/* Top Section: Ratings and Icons */}
        <div className="flex justify-between items-center mb-2">
          <Ratings rating={data?.ratings} />
          <div className="flex gap-2">
            <button onClick={handleWishlistToggle} className="outline-none focus:outline-none">
              {click ? (
                <AiFillHeart size={20} className="text-red-500" title="Remove from wishlist" />
              ) : (
                <AiOutlineHeart size={20} className="text-gray-600 hover:text-red-500 transition-colors" title="Add to wishlist" />
              )}
            </button>
            <button onClick={() => addToCartHandler(data._id)} className="outline-none focus:outline-none">
              <AiOutlineShoppingCart size={22} className="text-gray-800 hover:text-[#004E5d] transition-colors" title="Add to cart" />
            </button>
          </div>
        </div>

        {/* Product Name */}
        <Link
          to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}
          className="mb-1"
        >
          <h4 className={`text-base font-semibold  text-gray-800 line-clamp-2 hover:${styles.main_color} transition-colors`}>
            {data.name?.length > 50 ? `${data.name.slice(0, 50)}...` : data.name}
          </h4>

        </Link>

       
      </div>
    </div>
  );
};

export default ProductCard;