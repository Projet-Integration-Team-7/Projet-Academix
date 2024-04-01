"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createEvent,deleteEvent,fetchEvents,updateEvent } from '@/lib/actions/events.action';
import { ObjectId } from 'mongoose';

// Dynamically import the CalendarComponent to ensure it's only rendered on the client-side
const CalendarComponent = dynamic(() => import('@/components/forms/AgendaMenu'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]); // State to manage events
  const [eventName, setEventName] = useState(''); // State to manage event name
  const [eventColor, setEventColor] = useState('#3788d8'); // State to manage event color
  
  
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
    setEvents(prevEvents => [...prevEvents, response]);
    
    
  };

  // Function to add an event
  

  // Function to handle modal for deleting an event
  const handleDeleteModal = (event: any): void => {
    events.map(event => (
    <div onClick={() => handleEventClick(event)}>
      {event.title}
    </div>
  ))};
const handleEventClick = async ( data: any ) => {
  try {
    // Appel de la fonction deleteEvent avec l'ID de l'événement
    await deleteEvent(data.event._id);
    // Mise à jour de l'UI en supprimant l'événement de la liste des événements
    setEvents(prevEvents => prevEvents.filter(e => e._id !== event._id));
  } catch (error) {
    console.error('Error deleting event:', error);
    // Gérer les erreurs, telles que l'affichage d'un message d'erreur à l'utilisateur
  }
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
              handleDateClick={handleDateClick}
              handleDeleteModal={handleDeleteModal}
              // Inside CalendarComponent
            />
          </div>
          {/* Other components or content */}
        </div>
      </main>
    </>
  );
};

export default Home;