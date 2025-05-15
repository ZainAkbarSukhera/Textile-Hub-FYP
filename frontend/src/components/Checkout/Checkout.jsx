import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
   if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
      toast.error("Please choose your delivery address!")
   } else{
    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    }

    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
   }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentenge);

return (
  <div className="w-full flex flex-col items-center py-10 bg-[#f9f9f9]">
    <div className="w-[95%] md:w-[90%] lg:w-[80%] flex flex-col lg:flex-row gap-8">
      
      {/* Shipping Form */}
      <div className="w-full lg:w-2/3">
        <ShippingInfo
          user={user}
          country={country}
          setCountry={setCountry}
          city={city}
          setCity={setCity}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          address1={address1}
          setAddress1={setAddress1}
          address2={address2}
          setAddress2={setAddress2}
          zipCode={zipCode}
          setZipCode={setZipCode}
        />
      </div>

      {/* Cart Summary */}
      <div className="w-full lg:w-1/3">
        <CartData
          handleSubmit={handleSubmit}
          totalPrice={totalPrice}
          shipping={shipping}
          subTotalPrice={subTotalPrice}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discountPercentenge={discountPercentenge}
        />
      </div>
    </div>

    {/* Submit Button */}
    <div
      className={`bg-[#004E5d] px-2 py-2 rounded-md w-full sm:w-60 mt-10`}
      onClick={paymentSubmit}
    >
      <h5 className="text-white  text-center">Go to Payment</h5>
    </div>
  </div>
);

};

const ShippingInfo = ({
  user, country, setCountry, city, setCity,
  userInfo, setUserInfo, address1, setAddress1,
  address2, setAddress2, zipCode, setZipCode
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>

      <form>
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={user?.name}
              required
              className={`${styles.input}`}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={user?.email}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Phone Number</label>
            <input
              type="number"
              required
              value={user?.phoneNumber}
              className={`${styles.input}`}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Country</label>
            <select
              className="w-full border h-[40px] rounded-md px-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Province</label>
            <select
              className="w-full border h-[40px] rounded-md px-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your Province</option>
              {State.getStatesOfCountry(country).map((item) => (
                <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Address 1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Address 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
        </div>
      </form>

      {/* Saved Addresses */}
      <h5
        className="text-[#004E5d] cursor-pointer font-medium text-sm"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose from saved addresses
      </h5>
      {userInfo && (
        <div className="mt-2">
          {user?.addresses.map((item, index) => (
            <div className="flex items-center gap-3 mb-1" key={index}>
              <input
                type="checkbox"
                value={item.addressType}
                onClick={() => {
                  setAddress1(item.address1);
                  setAddress2(item.address2);
                  setZipCode(item.zipCode);
                  setCountry(item.country);
                  setCity(item.city);
                }}
              />
              <span className="text-sm text-gray-700">{item.addressType}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
  <div className="w-full h-full bg-white rounded-lg shadow-md p-6 gap-y-4 text-gray-800">
    {/* Subtotal */}
    <div className="flex justify-between text-sm md:text-base mt-2">
      <span className="text-gray-600">Subtotal:</span>
      <span className="font-semibold">Rs {subTotalPrice}</span>
    </div>

    <div className="flex justify-between text-sm md:text-base mt-4">
      <span className="text-gray-600">Shipping:</span>
      <span className="font-semibold">Rs {shipping.toFixed(2)}</span>
    </div>

    <div className="flex justify-between border-b border-gray-200 text-sm md:text-base mt-4 pb-3">
      <span className="text-gray-600">Discount:</span>
      <span className="font-semibold">
        {discountPercentenge ? `- Rs ${discountPercentenge}` : "Rs 0"}
      </span>
    </div>

    {/* Total */}
    <div className="flex justify-end text-lg font-bold text-gray-800 mt-8">
      Rs {totalPrice}
    </div>

    {/* Coupon Input */}
    <form onSubmit={handleSubmit} className="mt-12 space-y-4">
      <input
        type="text"
        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004E5d]"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        required
      />
      <input
        type="submit"
        value="Apply Code"
        className="w-full h-10 bg-[#004E5d] text-white text-sm font-medium rounded-md cursor-pointer hover:bg-[#00343d] transition"
      />
    </form>
  </div>
);

};

export default Checkout;
