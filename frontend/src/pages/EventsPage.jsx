import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <div className="bg-white min-h-screen">
        <Header activeHeading={4} />

        {/* Page Wrapper */}
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
          <div className="w-full max-w-6xl">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              All Running Events
            </h2>

            {/* Events Grid */}
            {allEvents && allEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {allEvents.map((event, index) => (
                  <EventCard key={index} data={event} small={true} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No running events available.</p>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);


};

export default EventsPage;
