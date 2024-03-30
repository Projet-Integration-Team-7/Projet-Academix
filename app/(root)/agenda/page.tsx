"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CalendarComponent to ensure it's only rendered on the client-side
const CalendarComponent = dynamic(() => import('@/components/forms/AgendaMenu'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]); // State to manage events
  const [eventName, setEventName] = useState(''); // State to manage event name
  const [eventColor, setEventColor] = useState('#3788d8'); // State to manage event color
  const storedEvents = localStorage.getItem('events');
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);
  // Event handler for clicking on a date
  const handleDateClick = (arg: { date: Date; allDay: boolean }): void => {
    // Logic to add a new event when a date is clicked
    const newEvent = {
      id: Math.random().toString(), // Generate a random id for the new event
      title: eventName, // Use the event name from state
      start: arg.date,
      allDay: arg.allDay,
      color: eventColor, // Use the event color from state
    };
    addEvent(newEvent);
  };

  // Function to add an event
  const addEvent = (data: any): void => {
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, data];
      localStorage.setItem('events', JSON.stringify(updatedEvents)); // Store the events in local storage
      return updatedEvents;
    });
    setEventName(''); // Clear the event name input after adding the event
    setEventColor('#3788d8'); // Reset the event color input after adding the event
  };

  // Function to handle modal for deleting an event
  const handleDeleteModal = (data: { event: { id: string } }): void => {
    const eventId = data.event.id;
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(event => event.id !== eventId);
      localStorage.setItem('events', JSON.stringify(updatedEvents)); // Update the events in local storage
      return updatedEvents;
    });
  };

  return (
    <>
      {/* Navigation */}
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-200">Calendar</h1>
      </nav>
      
      {/* Main content */}
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10 font-bold text-2xl text-gray-200">
          <div className="col-span-8">
            {/* Input for event name */}
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
            />

            {/* Input for event color */}
            <input
              type="color"
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
            />

            {/* Render the CalendarComponent */}
            <CalendarComponent
              events={events}
              handleDateClick={handleDateClick}
              addEvent={addEvent}
              handleDeleteModal={handleDeleteModal}
            />
          </div>
          {/* Other components or content */}
        </div>
      </main>
    </>
  );
};

export default Home;