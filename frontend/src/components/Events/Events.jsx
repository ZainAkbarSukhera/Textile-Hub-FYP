import React from "react";
import { useSelector } from "react-redux";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div className="w-full flex flex-col items-center py-12">
      {!isLoading && (
        <div className="max-w-6xl w-full px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Bids</h1>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.length !== 0 ? (
              allEvents.map((event) => <EventCard key={event._id} data={event} />)
            ) : (
              <h4 className="text-lg text-gray-500 col-span-full text-center">
                No Events Available!
              </h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
