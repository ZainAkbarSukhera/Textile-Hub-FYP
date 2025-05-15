import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductSearchCard from "../components/Route/ProductCard/ProductSearchCard";

const SearchPage = () => {
  const location = useLocation();
  const searchData = location.state?.results || [];

  console.log("Search data: ", searchData); // For debugging

  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      <Header />

      <div className="w-full py-10 px-4 md:px-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
          Search Results
        </h2>

        {searchData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchData.map((item) => (
              <ProductSearchCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No products found.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
