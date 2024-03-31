"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createEvent,deleteEvent,fetchEvents,updateEvent } from '@/lib/actions/events.action';

// Dynamically import the CalendarComponent to ensure it's only rendered on the client-side
const CalendarComponent = dynamic(() => import('@/components/forms/AgendaMenu'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]); // State to manage events
  const [eventName, setEventName] = useState(''); // State to manage event name
  const [eventColor, setEventColor] = useState('#3788d8'); // State to manage event color
  const fetchAllEvents = async () => {
    try {
      const eventsFromServer = await fetchEvents();
      setEvents(eventsFromServer);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  useEffect(() => {
    // Fetch events from the backend when the component mounts
    async function fetchEventsFromBackend() {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Handle error fetching events from the backend
      }
    }
    fetchEventsFromBackend();
  }, []);
  // Event handler for clicking on a date
  const handleDateClick = async (arg: { date: Date; allDay: boolean }): Promise<void> => {
    // Logic to add a new event when a date is clicked
    const newEvent = {
      title: eventName,
      start: arg.date,
      end: arg.date, // Add the end property with the same value as start
      allDay: arg.allDay,
      color: eventColor,
    };
    const response = await createEvent(newEvent);
  
  };

  // Function to add an event
  const addEvent = async (data: any): Promise<void> => {
    try {
      // Send the event data to your backend API
      const eventParams: EventParams = {
        title: 'My Event',
        start: new Date(), // or any start date
        end: new Date(), // or any end date
        allDay: true, // optional, default is false
        color: '#ff0000' // optional, default is '#3788d8'
      };
      const response = await createEvent(eventParams)
  
      setEvents(prevEvents => {
        const updatedEvents = [...prevEvents, response];
        
        //localStorage.setItem('events', JSON.stringify(updatedEvents)); // Store the events in local storage
        return updatedEvents;
      });
  
      setEventName(''); // Clear the event name input after adding the event
      setEventColor('#3788d8'); // Reset the event color input after adding the event
    } catch (error) {
      console.error('Error adding event:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  // Function to handle modal for deleting an event
  const handleDeleteModal = (data: { event: { id: string } }): void => {
    handleDeleteEvent
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