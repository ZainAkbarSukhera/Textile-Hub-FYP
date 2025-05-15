import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {
  const [data,setData] = useState({});
  const {products} = useSelector((state) => state.products);
  const [isLoading,setIsLoading] = useState(false);
  const {id} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
     setData(res.data.shop);
     setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  }, [])
  

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`,{
      withCredentials: true,
    });
    window.location.reload();
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings = products && products.reduce((acc,product) => acc + product.reviews.reduce((sum,review) => sum + review.rating, 0),0);

  const averageRating = totalRatings / totalReviewsLength || 0;

 return (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <div className="w-full max-w-3xl mx-auto  p-6 mt-6">
        {/* Avatar + Shop Name */}
        <div className="flex flex-col items-center">
          <img
            src={data.avatar?.url}
            alt="Shop Avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-[#004E5d]"
          />
          <h3 className="text-xl font-semibold mt-4 text-gray-800">{data.name}</h3>
          <p className="text-sm text-gray-600 mt-2 text-center px-4">{data.description}</p>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <h5 className="text-sm font-medium text-gray-600">Address</h5>
            <p className="text-base text-gray-800">{data.address}</p>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-600">Phone Number</h5>
            <p className="text-base text-gray-800">{data.phoneNumber}</p>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-600">Total Products</h5>
            <p className="text-base text-gray-800">{products?.length}</p>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-600">Shop Rating</h5>
            <p className="text-base text-gray-800">{averageRating}/5</p>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-600">Joined On</h5>
            <p className="text-base text-gray-800">{data?.createdAt?.slice(0, 10)}</p>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link to="/settings" className="w-full sm:w-[48%]">
              <button className="w-full bg-[#004E5d] text-white py-2 rounded-md hover:bg-[#033f4f] transition font-medium">
                Edit Shop
              </button>
            </Link>
            <button
              className="w-full sm:w-[48%] bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-medium"
              onClick={logoutHandler}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    )}
  </>
);

};

export default ShopInfo;
