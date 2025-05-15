import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
     dispatch(getAllOrdersOfShop(seller._id));
     dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders && orders.forEach((item) => {
    row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "Rs " + item.totalPrice,
        status: item.status,
      });
  });
  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full flex flex-col gap-6 md:flex-row md:justify-between">
  {/* Balance Card */}
  <div className="w-full md:w-[30%] bg-white shadow-md rounded-lg p-5 flex flex-col justify-between">
    <div>
      <h3 className="text-gray-700 text-lg font-semibold mb-1">
        Account Balance
      </h3>
      <p className="text-sm text-gray-500">(with 10% service charge)</p>
    </div>
    <h5 className="text-2xl font-bold text-gray-800 mt-4">Rs {availableBalance}</h5>
    <Link to="/dashboard-withdraw-money" className="mt-4">
      <button className="w-full py-2 bg-[#004E5d] text-white rounded hover:bg-[#053a41] transition">
        Withdraw Money
      </button>
    </Link>
  </div>

  {/* Orders Card */}
  <div className="w-full md:w-[30%] bg-white shadow-md rounded-lg p-5 flex flex-col justify-between">
    <div>
      <h3 className="text-gray-700 text-lg font-semibold mb-1">All Orders</h3>
    </div>
    <h5 className="text-2xl font-bold text-gray-800 mt-4">{orders && orders.length}</h5>
    <Link to="/dashboard-orders" className="mt-4">
      <button className="w-full py-2 bg-[#004E5d] text-white rounded hover:bg-[#053a41] transition">
        View Orders
      </button>
    </Link>
  </div>

  {/* Products Card */}
  <div className="w-full md:w-[30%] bg-white shadow-md rounded-lg p-5 flex flex-col justify-between">
    <div>
      <h3 className="text-gray-700 text-lg font-semibold mb-1">All Products</h3>
    </div>
    <h5 className="text-2xl font-bold text-gray-800 mt-4">{products && products.length}</h5>
    <Link to="/dashboard-products" className="mt-4">
      <button className="w-full py-2 bg-[#004E5d] text-white rounded hover:bg-[#053a41] transition">
        View Products
      </button>
    </Link>
  </div>
</div>

      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
      </div>
    </div>
  );
};

export default DashboardHero;
