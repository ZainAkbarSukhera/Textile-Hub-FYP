import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import Loader from "../Layout/Loader";
import axios from "axios";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEvent(id));
      dispatch(getAllEventsShop(seller._id));
    } catch (error) {
      console.error("Failed to delete the event:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1.5 },
    { field: "price", headerName: "Price", minWidth: 120, flex: 0.7 },
    { field: "Stock", headerName: "Stock", type: "number", minWidth: 100, flex: 0.6 },
    { field: "sold", headerName: "Sold Out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "currentHighestBid",
      headerName: "Highest Bid",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => (
        <span className="text-green-600 font-semibold">${params.value || 0}</span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 180,
      flex: 1.2,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "bidders",
      headerName: "Bidders",
      minWidth: 800, // Increased width for better UI
      flex: 2.5,
      renderCell: (params) => (
        <div className="overflow-auto max-h-72 p-5 border border-gray-300 rounded bg-gray-100 w-full">
          {params.value.length > 0 ? (
            params.value.map((bid, index) => (
              <div key={index} className="text-sm text-gray-700 border-b pb-3 mb-3">
                <strong>User ID:</strong> {bid.userId} <br />
                <strong>Bid:</strong> ${bid.bidAmount} <br />
                <strong>Time:</strong> {new Date(bid.bidTime).toLocaleString()}
              </div>
            ))
          ) : (
            <span className="text-gray-500">No Bidders</span>
          )}
        </div>
      ),
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${encodeURIComponent(params.row.name)}`}>
          <Button><AiOutlineEye size={20} /></Button>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = events?.map((item) => ({
    id: item._id,
    name: item.name,
    price: `US$ ${item.discountPrice}`,
    Stock: item.stock,
    sold: item.sold_out,
    currentHighestBid: item.currentHighestBid || "No Bids",
    createdAt: item.createdAt,
    bidders: item.bids || [],
  })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div style={{ overflowX: "auto" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              getRowHeight={() => 140} // Increased row height
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AllEvents;
