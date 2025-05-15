import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    await axios
    .put(
      `${server}/order/order-refund-success/${id}`,
      {
        status,
      },
      { withCredentials: true }
    )
    .then((res) => {
      toast.success("Order updated!");
      dispatch(getAllOrdersOfShop(seller._id));
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
  }

  console.log(data?.status);


 return (
  <div className={`py-6 min-h-screen ${styles.section}`}>
    {/* Header */}
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-[#004E5d]">Order Details</h1>
      </div>
      <Link to="/dashboard-orders">
        <button className="bg-[#004E5d] text-white px-5 py-2 rounded-md font-semibold text-sm hover:opacity-90 transition">
          Back to Orders
        </button>
      </Link>
    </div>

    {/* Meta Info */}
    <div className="flex flex-col md:flex-row justify-between text-gray-600 text-sm border-b pb-4">
      <h5>Order ID: <span className="font-medium">#{data?._id?.slice(0, 8)}</span></h5>
      <h5>Placed on: <span className="font-medium">{data?.createdAt?.slice(0, 10)}</span></h5>
    </div>

    {/* Items */}
    <div className="mt-6 space-y-6">
      {data?.cart.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <img
            src={item.images[0]?.url}
            alt={item.name}
            className="w-20 h-20 rounded-md object-cover border"
          />
          <div>
            <h5 className="text-lg font-medium text-gray-800">{item.name}</h5>
            <p className="text-sm text-gray-600">Rs {item.discountPrice} x {item.qty}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Total */}
    <div className="text-right border-t pt-4 mt-6">
      <h5 className="text-lg font-semibold text-gray-800">
        Total Price: Rs {data?.totalPrice}
      </h5>
    </div>

    {/* Shipping & Payment Info */}
    <div className="flex flex-col md:flex-row gap-8 mt-10">
      <div className="w-full md:w-2/3 space-y-1">
        <h4 className="text-lg font-semibold text-gray-800">Shipping Address</h4>
        <p>{data?.shippingAddress.address1} {data?.shippingAddress.address2}</p>
        <p>{data?.shippingAddress.city}, {data?.shippingAddress.country}</p>
        <p>{data?.user?.phoneNumber}</p>
      </div>
      <div className="w-full md:w-1/3 space-y-2">
        <h4 className="text-lg font-semibold text-gray-800">Payment Info</h4>
        <p>Status: {data?.paymentInfo?.status || "Not Paid"}</p>
      </div>
    </div>

    {/* Status Dropdown */}
    <div className="mt-10">
      <h4 className="text-lg font-semibold mb-2 text-gray-800">Order Status</h4>
      {data?.status === "Processing refund" || data?.status === "Refund Success" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-md w-52"
        >
          {["Processing refund", "Refund Success"]
            .slice(["Processing refund", "Refund Success"].indexOf(data?.status))
            .map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
        </select>
      ) : (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-md w-52"
        >
          {["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"]
            .slice(
              ["Processing", "Transferred to delivery partner", "Shipping", "Received", "On the way", "Delivered"]
                .indexOf(data?.status)
            )
            .map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
        </select>
      )}

      {/* Update Button */}
      <button
        className="mt-4 bg-[#004E5d] text-white font-semibold text-sm px-5 py-2 ml-8 rounded-md hover:opacity-90 transition"
        onClick={data?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler}
      >
        Update Status
      </button>
    </div>
  </div>
);

};

export default OrderDetails;
