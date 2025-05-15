import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch]);

  const [active, setActive] = useState(1);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

return(
  <div className="w-full px-4 sm:px-6 lg:px-8">
    {/* Tab Buttons */}
    <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-4">
      <div className="flex gap-3">
        {[
          { id: 1, label: "Shop Products" },
          { id: 2, label: "Running Events" },
          { id: 3, label: "Shop Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              active === tab.id
                ? "bg-[#004E5d] text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Link (Right-aligned) */}
      {isOwner && (
        <Link to="/dashboard" className="mt-4 md:mt-0">
          <div className="bg-[#004E5d] text-white px-4 py-2 rounded-md font-medium hover:bg-[#033f4f] transition">
            Go to Dashboard
          </div>
        </Link>
      )}
    </div>

    {/* Tab Content Below */}
    <div className="mt-6">
      {active === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard data={product} key={idx} isShop={true} />
          ))}
        </div>
      )}

      {active === 2 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, idx) => (
              <ProductCard data={event} key={idx} isShop={true} isEvent={true} />
            ))}
          </div>
          {events.length === 0 && (
            <p className="text-center text-gray-600 mt-6">No Events for this shop!</p>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="space-y-6">
          {allReviews.map((review, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <img
                src={review.user.avatar?.url}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
                  <Ratings rating={review.rating} />
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          ))}
          {allReviews.length === 0 && (
            <p className="text-center text-gray-600">No Reviews for this shop!</p>
          )}
        </div>
      )}
    </div>
  </div>
);

};

export default ShopProfileData;
