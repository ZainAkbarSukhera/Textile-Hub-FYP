import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data,isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

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
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition duration-300">
      {/* Image */}
      <Link to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}>
        <img
          src={data.images?.[0]?.url}
          alt={data.name}
          className="w-full h-52 object-fill mb-3 rounded-md"
        />
      </Link>
  
      {/* Shop Name & Icons Row */}
      <div className="flex items-center justify-between mb-3">
        

        <div className="mb-2 mt-2">
          <Ratings rating={data?.ratings} />
        </div>
  
        <div className="flex items-center gap-3">
          {click ? (
            <AiFillHeart
              size={20}
              onClick={() => removeFromWishlistHandler(data)}
              className="text-red-500 hover:scale-110 transition cursor-pointer"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={20}
              onClick={() => addToWishlistHandler(data)}
              className="text-gray-700 hover:scale-110 transition cursor-pointer"
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={20}
            onClick={() => setOpen(!open)}
            className="text-gray-700 hover:scale-110 transition cursor-pointer"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={22}
            onClick={() => addToCartHandler(data._id)}
            className="text-gray-800 hover:scale-110 transition cursor-pointer"
            title="Add to cart"
          />
        </div>
      </div>
  
      {/* Product Info */}
      <Link to={isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}>
      <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className="text-sm font-medium text-[#004E5d] hover:underline">
            {data.shop.name}
          </h5>
        </Link>

        <h4 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
          {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
        </h4>
  
       
  
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <h5 className="text-gray-800 font-bold">
              Rs {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}
            </h5>
            {data.originalPrice && (
              <h4 className="line-through text-red-700">
                Rs {data.originalPrice}
              </h4>
            )}
          </div>
          <span className="text-gray-500">{data?.sold_out} sold</span>
        </div>
      </Link>
  
      {/* Product Details Modal */}
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
  
  

};

export default ProductCard;
