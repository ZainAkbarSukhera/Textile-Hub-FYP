import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useEffect } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymnentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
    .post(`${server}/order/create-order`, order, config)
    .then((res) => {
      setOpen(false);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    });
  };

  return (
   <div className="w-full flex flex-col items-center py-8">
  <div className="w-[90%] 1000px:w-[70%] flex flex-col 800px:flex-row gap-6">
    
    {/* Left: Payment Info */}
    <div className="w-full 800px:w-[65%]  rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <PaymentInfo
        user={user}
        open={open}
        setOpen={setOpen}
        onApprove={onApprove}
        createOrder={createOrder}
        paymentHandler={paymentHandler}
        cashOnDeliveryHandler={cashOnDeliveryHandler}
      />
    </div>

    {/* Right: Cart Data */}
    <div className="w-full 800px:w-[35%]  rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <CartData orderData={orderData} />
    </div>

  </div>
</div>

  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

 return (
  <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-8">
    {/* CARD PAYMENT OPTION */}
    <div>
      <div className="flex items-center gap-3 border-b pb-4 cursor-pointer" onClick={() => setSelect(1)}>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${select === 1 ? 'border-[#004E5d]' : 'border-gray-400'}`}>
          {select === 1 && <div className="w-3 h-3 bg-[#004E5d] rounded-full" />}
        </div>
        <h4 className="text-base font-semibold text-gray-800">Pay with Debit/Credit Card</h4>
      </div>

      {select === 1 && (
        <form className="mt-4 space-y-4" onSubmit={paymentHandler}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Name on Card</label>
              <input
                required
                placeholder={user?.name}
                value={user?.name}
                className={`${styles.input} w-full text-[#444]`}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Exp Date</label>
              <CardExpiryElement className={`${styles.input}`} options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#444"
                  },
                },
              }} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <CardNumberElement className={`${styles.input} h-[38px]`} options={{
                style: { base: { fontSize: "16px", color: "#444" } }
              }} />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">CVV</label>
              <CardCvcElement className={`${styles.input} h-[38px]`} options={{
                style: { base: { fontSize: "16px", color: "#444" } }
              }} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#004E5d] hover:bg-[#00313a] text-white py-2 rounded-md text-sm font-semibold transition"
          >
            Pay Now
          </button>
        </form>
      )}
    </div>

    {/* PAYPAL PAYMENT OPTION */}
    <div>
      <div className="flex items-center gap-3 border-b pb-4 cursor-pointer" onClick={() => setSelect(2)}>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${select === 2 ? 'border-[#004E5d]' : 'border-gray-400'}`}>
          {select === 2 && <div className="w-3 h-3 bg-[#004E5d] rounded-full" />}
        </div>
        <h4 className="text-base font-semibold text-gray-800">Pay with PayPal</h4>
      </div>

      {select === 2 && (
        <div className="mt-4">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-[#004E5d] hover:bg-[#00313a] text-white py-2 rounded-md text-sm font-semibold transition"
          >
            Pay Now
          </button>

          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-lg p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
                <RxCross1
                  size={24}
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
                <PayPalScriptProvider options={{ "client-id": "YOUR_CLIENT_ID" }}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    onApprove={onApprove}
                    createOrder={createOrder}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* CASH ON DELIVERY OPTION */}
    <div>
      <div className="flex items-center gap-3 border-b pb-4 cursor-pointer" onClick={() => setSelect(3)}>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${select === 3 ? 'border-[#004E5d]' : 'border-gray-400'}`}>
          {select === 3 && <div className="w-3 h-3 bg-[#004E5d] rounded-full" />}
        </div>
        <h4 className="text-base font-semibold text-gray-800">Cash on Delivery</h4>
      </div>

      {select === 3 && (
        <form onSubmit={cashOnDeliveryHandler} className="mt-4">
          <button
            type="submit"
            className="w-full bg-[#004E5d] hover:bg-[#00313a] text-white py-2 rounded-md text-sm font-semibold transition"
          >
            Confirm
          </button>
        </form>
      )}
    </div>
  </div>
);

};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
return (
  <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4 text-sm sm:text-base">
    {/* Subtotal */}
    <div className="flex justify-between items-center">
      <h3 className="text-gray-600 font-medium">Subtotal:</h3>
      <h5 className="text-gray-900 font-semibold">Rs {orderData?.subTotalPrice}</h5>
    </div>

    {/* Shipping */}
    <div className="flex justify-between items-center">
      <h3 className="text-gray-600 font-medium">Shipping:</h3>
      <h5 className="text-gray-900 font-semibold">Rs {shipping}</h5>
    </div>

    {/* Discount */}
    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
      <h3 className="text-gray-600 font-medium">Discount:</h3>
      <h5 className="text-red-700 font-semibold">
        {orderData?.discountPrice ? `- Rs ${orderData.discountPrice}` : "-"}
      </h5>
    </div>

    {/* Total */}
    <div className="flex justify-between items-center pt-2">
      <h3 className="text-gray-800 font-bold text-lg">Total:</h3>
      <h5 className="text-gray-800 font-bold text-lg">Rs {orderData?.totalPrice}</h5>
    </div>
  </div>
);

};

export default Payment;
