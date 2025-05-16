import React from "react";
import { useSelector } from "react-redux";
import EventCard from "./EventCard";
import styles from "../../styles/styles";


const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  
  return (
    <div className={`${styles.section} py-12`}>
      {!isLoading && (
        <>
          {/* Heading */}
          <div className={`${styles.heading}`}>
            <h1>Bids</h1>
          </div>
  
          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
            {allEvents.length !== 0 ? (
              allEvents.map((event) => <EventCard key={event._id} data={event} />)
            ) : (
              <h4 className="text-lg text-gray-500 col-span-full text-center">
                No Events Available!
              </h4>
            )}
          </div>
        </>
      )}
    </div>
  );
  
};

export default Events;
