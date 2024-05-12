"use client"; // Indique que ce composant est destiné au côté client

// Importation des bibliothèques et composants nécessaires

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createEvent,deleteEvent,fetchEvents,findEvent,updateEvent } from '@/lib/actions/events.action';
import { ObjectId } from 'mongoose';
import { Draggable } from "@fullcalendar/interaction/index.js";
import { start } from 'repl';

// Importation dynamique du CalendarComponent pour s'assurer qu'il est rendu uniquement côté client
const CalendarComponent = dynamic(() => import('@/components/forms/AgendaMenu'), { ssr: false });
// Définition de l'interface pour les props du calendrier

interface CalendarProps {
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void;
  handleEventClick: (data: any) => void; // Function to handle event click
}
// Définition du composant Home comme un composant fonctionnel
const Home: React.FC = () => {
    // Variables d'état pour gérer les événements et les détails des événements

  const [events, setEvents] = useState<any[]>([]); // State to manage events
  const [eventName, setEventName] = useState(''); // State to manage event name
  const [eventColor, setEventColor] = useState('#3788d8'); // State to manage event color
  
    // Hook d'effet pour rendre les éléments déplaçables

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
  // Fonction pour gérer les clics sur les dates dans le calendrier
  const handleDateClick = async (arg: { date: Date; allDay: boolean }): Promise<void> => {
    console.log('Clicked event:', event);

    const newEvent = {
      title: eventName,
      start: arg.date,
      end: arg.date, // Mettre la date de fin identique à la date de début
      allDay: arg.allDay,
      color: eventColor,
    };
    const response = await createEvent(newEvent);
    setEvents(prevEvents => [...prevEvents, response]);
    window.location.reload();
    
  };
  

  // Fonction pour gérer les clics sur les événements pour les supprimer
  
  const handleEventClick = async (clickInfo) => {
    console.log('Clicked event:', clickInfo.event);
    try {
      // Call the deleteEvent function with the event's ID
      await deleteEvent(clickInfo.event.title);
      window.location.reload();
      // Update the UI by removing the event from the list of events
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle errors, such as displaying an error message to the user
    }
  };
  
    // Fonction pour gérer le déplacement des événements

  const handleEventDrop = async (info) => {
    const { event } = info;
  
    // Preparing the updated event data
    const updatedEventData = {
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      color: event.backgroundColor,
    };
    await updateEvent(info.event.title, updatedEventData);
    window.location.reload();
    try {
      console.log('L\'événement a été mis à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement :', error.message);
    }
  };




  return (
    <>
        <div className="fullcalendar-container">

      {/* Navigation */}
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-200">Calendrier</h1>
      </nav>
      
      {/* Main contenu */}
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10 font-bold text-2xl text-gray-200">
          <div className="col-span-8">
            {/* Input pour nom des events */}
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Entrer votre événement  "
            />

            {/* Input pour nom des couleur */}
            <input
              type="color"
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
            />

            {/* Affiche Agenda */}
            <CalendarComponent
              handleDateClick={handleDateClick}
              handleEventClick={handleEventClick}
              handleEventDrop={handleEventDrop}	
              // Inside CalendarComponent
              
          
            />
          </div>
          {/* autre components */}
        </div>
      </main>
      </div>
    </>
  );    

};

export default Home;