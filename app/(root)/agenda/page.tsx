"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createEvent,deleteEvent,fetchEvents,findEvent,updateEvent } from '@/lib/actions/events.action';
import { ObjectId } from 'mongoose';
import { Draggable } from '@fullcalendar/interaction/index.js';
import { start } from 'repl';

// Dynamically import the CalendarComponent to ensure it's only rendered on the client-side
const CalendarComponent = dynamic(() => import('@/components/forms/AgendaMenu'), { ssr: false });
interface CalendarProps {
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void;
  handleEventClick: (data: any) => void; // Function to handle event click
}
// Define the Home component
const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]); // State to manage events
  const [eventName, setEventName] = useState(''); // State to manage event name
  const [eventColor, setEventColor] = useState('#3788d8'); // State to manage event color
  
  
  useEffect(() => {
    let draggableEl = document.getElementById('draggable-el');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl: { getAttribute: (arg0: string) => any; }) {
          let title = eventEl.getAttribute('title');
          let id = eventEl.getAttribute('data');
          let start = eventEl.getAttribute('start');
          let end = eventEl.getAttribute('end');
          return { title, id, start,end };
        },
      });
    }
  }, []);
  // Event handler for clicking on a date
  const handleDateClick = async (arg: { date: Date; allDay: boolean }): Promise<void> => {
    console.log('Clicked event:', event);

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
  
  const handleEventClick = async (clickInfo) => {
    console.log('Clicked event:', clickInfo.event);
    try {
      // Call the deleteEvent function with the event's ID
      await deleteEvent(clickInfo.event._id);
      // Update the UI by removing the event from the list of events
      setEvents(prevEvents => prevEvents.filter(e => e._id!== clickInfo.event._id));
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };
  
  
  const handleEventDrop = async (info) => {
    const updatedEventData = {
        title: info.event.title,
        start: info.event.start,
        end: info.event.start,
        allDay: info.event.allDay,
        color: info.event.color,
    };
    const answer=findEvent(info.event.id);
    setEvents(prevEvents => prevEvents.map(e => e._id === info.event._id? updatedEventData : e));

    // Appelez la fonction updateEvent avec l'ID de l'événement à mettre à jour et les données mises à jour
   // const eventIdToUpdate = 'ID_de_votre_evenement';
    try {
      //await updateEvent(info.event._id, updatedEventData);
      await createEvent(updatedEventData);
      await deleteEvent(answer._id);
      
      console.log('L\'événement a été mis à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement :', error.message);
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
              handleEventClick={handleEventClick}
              handleEventDrop={handleEventDrop}	
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