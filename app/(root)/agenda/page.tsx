"use client"; // Indique que ce composant est destiné au côté client

// Importation des bibliothèques et composants nécessaires

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createEvent,deleteEvent,updateEvent } from '@/lib/actions/events.action';
import { ObjectId } from 'mongoose';
import { Draggable } from '@fullcalendar/interaction/index.js';
import { start } from 'repl';

// Importation dynamique du CalendarComponent pour s'assurer qu'il est rendu uniquement côté client
const CalendarComponent = dynamic(() => import('@/components/forms/AgendaMenu'), { ssr: false });
// Définition du composant Home comme un composant fonctionnel
/**
 * Composant principal de la page d'agenda.
 */
const Home: React.FC = () => {
  // Variables d'état pour gérer les événements et les détails des événements

  const [events, setEvents] = useState<any[]>([]); // État pour gérer les événements
  const [eventName, setEventName] = useState(''); // État pour gérer le nom de l'événement
  const [eventColor, setEventColor] = useState('#3788d8'); // État pour gérer la couleur de l'événement

  // Hook d'effet pour rendre les éléments déplaçables
  useEffect(() => {
    let draggableEl = document.getElementById('draggable-el');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl: { getAttribute: (arg0: string) => any }) {
          let title = eventEl.getAttribute('title');
          let id = eventEl.getAttribute('data');
          let start = eventEl.getAttribute('start');
          let end = eventEl.getAttribute('end');
          return { title, id, start, end };
        },
      });
    }
  }, []);

  /**
   * Fonction pour gérer les clics sur les dates dans le calendrier.
   * @param arg - La date et les propriétés allDay.
   */
  const handleDateClick = async (arg: { date: Date; allDay: boolean }): Promise<void> => {
    console.log('Événement cliqué :', event);

    const newEvent = {
      title: eventName,
      start: arg.date,
      end: arg.date, // Mettre la date de fin identique à la date de début
      allDay: arg.allDay,
      color: eventColor,
    };
    const response = await createEvent(newEvent);
    setEvents((prevEvents) => [...prevEvents, response]);
  };

  /**
   * Fonction pour gérer les clics sur les événements pour les supprimer.
   * @param clickInfo - Les informations sur l'événement cliqué.
   */
  const handleEventClick = async (clickInfo: any) => {
    console.log('Événement cliqué :', clickInfo.event);
    try {
      // Appeler la fonction deleteEvent avec l'ID de l'événement
      await deleteEvent(clickInfo.event.title);
      // Mettre à jour l'interface utilisateur en supprimant l'événement de la liste des événements
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement :', error);
      // Gérer les erreurs, comme afficher un message d'erreur à l'utilisateur
    }
  };

  /**
   * Fonction pour gérer les déplacements d'événements.
   * @param info - Les informations sur le déplacement de l'événement.
   */
  const handleEventDrop = async (info: any) => {
    const { event } = info;

    // Préparation des données de l'événement mis à jour
    const updatedEventData = {
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      color: event.backgroundColor,
    };
    await updateEvent(info.event.title, updatedEventData);
    try {
      console.log("L'événement a été mis à jour avec succès.");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'événement :", error.message);
    }
  };

  return (
    <>
      <div className="fullcalendar-container">
        {/* Navigation */}
        <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
          <h1 className="font-bold text-2xl text-gray-200">Calendrier</h1>
        </nav>

        {/* Contenu principal */}
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="grid grid-cols-10 font-bold text-2xl text-gray-200">
            <div className="col-span-8">
              {/* Input pour le nom des événements */}
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Entrer le nom de l'événement"
              />

              {/* Input pour la couleur des événements */}
              <input
                type="color"
                value={eventColor}
                onChange={(e) => setEventColor(e.target.value)}
              />

              {/* Affichage du calendrier */}
              <CalendarComponent
                handleDateClick={handleDateClick}
                handleEventClick={handleEventClick}
                handleEventDrop={handleEventDrop}
                // À l'intérieur de CalendarComponent
              />
            </div>
            {/* Autres composants */}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;