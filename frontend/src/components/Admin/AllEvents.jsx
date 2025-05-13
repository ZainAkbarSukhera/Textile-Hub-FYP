import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";

const AllEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${server}/event/admin-all-events`, { withCredentials: true }).then((res) => {
      setEvents(res.data.events);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "currentHighestBid",
      headerName: "Highest Bid",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className="text-green-600 font-semibold">
          ${params.value || 0}
        </span>
      ),
    },
    {
      field: "bidders",
      headerName: "Bidders",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="overflow-auto max-h-20">
          {params.value.length > 0 ? (
            params.value.map((bid, index) => (
              <div key={index} className="text-sm text-gray-700">
                <strong>User:</strong> {bid.userId.substring(0, 6)}...
                <br />
                <strong>Bid:</strong> ${bid.bidAmount}
              </div>
            ))
          ) : (
            <span className="text-gray-500">No bids</span>
          )}
        </div>
      ),
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}?isEvent=true`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
        currentHighestBid: item.currentHighestBid,
        bidders: item.bids || [],
      });
    });

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllEvents;
