import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

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
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg =  totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);


  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

 return (
  <div className="bg-white py-6">
    {data ? (
      <div className={`${styles.section} w-[90%] md:w-[80%] mx-auto`}>
        <div className="flex flex-col lg:flex-row gap-8">
  {/* Left: Images */}
  <div className="w-full lg:w-1/2">
    {/* Main Image */}
    <img
      src={data.images[select]?.url}
      alt={data.name}
      className="w-full max-h-[400px] object-contain rounded-lg"
    />

    {/* Thumbnail Images */}
    <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-full overflow-x-auto">
      {data.images.map((img, index) => (
        <img
          key={index}
          src={img?.url}
          alt=""
          onClick={() => setSelect(index)}
          className={`h-20 w-20 object-cover rounded border-2 cursor-pointer transition ${
            select === index ? "border-blue-500" : "border-transparent"
          }`}
        />
      ))}
    </div>
  </div>


          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h1 className={`${styles.productTitle} text-xl md:text-2xl`}>{data.name}</h1>
            <p className="text-gray-700">{data.description}</p>

            <div className="flex items-center gap-4 text-xl font-semibold pt-2">
              <h4 className="text-gray-800">Rs {data.discountPrice}</h4>
              {data.originalPrice && (
                <h3 className="line-through text-red-700">Rs {data.originalPrice}</h3>
              )}
            </div>

            {/* Quantity & Wishlist */}
            <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
              <div className="flex items-center">
                <button
                  className="bg-[#004E5d] text-white px-3 py-2 rounded-l hover:opacity-80"
                  onClick={decrementCount}
                >
                  -
                </button>
                <span className="bg-gray-100 text-gray-900 px-4 py-2 font-semibold">
                  {count}
                </span>
                <button
                  className="bg-[#004E5d] text-white px-3 py-2 rounded-r hover:opacity-80"
                  onClick={incrementCount}
                >
                  +
                </button>
              </div>

              <div>
                {click ? (
                  <AiFillHeart
                    size={28}
                    onClick={() => removeFromWishlistHandler(data)}
                    className="cursor-pointer text-red-500"
                    title="Remove from wishlist"
                  />
                ) : (
                  <AiOutlineHeart
                    size={28}
                    onClick={() => addToWishlistHandler(data)}
                    className="cursor-pointer text-gray-700"
                    title="Add to wishlist"
                  />
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              className="mt-6 w-full bg-[#004E5d] text-white h-11 rounded-md flex justify-center items-center gap-2 hover:opacity-90"
              onClick={() => addToCartHandler(data._id)}
            >
              Add to cart <AiOutlineShoppingCart />
            </button>

            {/* Shop Info */}
            <div className="flex items-center gap-4 pt-8 flex-wrap">
              <Link to={`/shop/preview/${data.shop._id}`}>
                <img
                  src={data.shop.avatar?.url}
                  alt="Shop"
                  className="w-12 h-12 rounded-full border"
                />
              </Link>
              <div>
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                </Link>
                <p className="text-sm text-gray-500">({averageRating}/5) Ratings</p>
              </div>

              <button
                onClick={handleMessageSubmit}
                className="ml-auto bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#222026] transition"
              >
                Send Message <AiOutlineMessage />
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductDetailsInfo
          data={data}
          products={products}
          totalReviewsLength={totalReviewsLength}
          averageRating={averageRating}
        />
      </div>
    ) : null}
  </div>
);

};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded mt-6">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${item.user.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
