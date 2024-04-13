import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEvent,deleteEvent,fetchEvents,updateEvent } from '@/lib/actions/events.action';
import dynamic from 'next/dynamic';
import { Draggable } from '@fullcalendar/interaction';
// Définition des props du composant

interface CalendarProps {
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void;// Gestion des clics sur les dates
  handleEventClick: (event: any) => void; // Gestion des clics sur les événements
  handleEventDrop: (data: any) => void; // Gestion du déplacement et de la redimension des événements

}

const CalendarComponent: React.FC<CalendarProps> = ({
  handleDateClick,
  handleEventClick,
  handleEventDrop,
  
}) => {
    // Récupération des événements depuis le backend au montage du composant

  const [events, setEvents] = useState<any[]>([]);// État pour stocker les événements
  
  
 
  
  
  useEffect(() => {
    let draggableEl = document.getElementById('draggable-el')
    if (draggableEl) {
      console.log('draggableEl', draggableEl)
      
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title")
          let id = eventEl.getAttribute("data")
          let start = eventEl.getAttribute("start")
          let end = eventEl.getAttribute("end")

          return { title, id, start,end }
        }
      })
    }
  }, [])
  
  useEffect(() => {
    // Récupération des événements depuis le backend au montage du composant
    async function fetchEventsFromBackend() {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    
    
    
    fetchEventsFromBackend();
    
  }, []); // Le tableau de dépendances vide assure que l'effet s'exécute une seule fois au montage

  return (
    <div className="fullcalendar-container">
    <FullCalendar
    
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}// Plugins pour le calendrier
      headerToolbar={{
        left: ' today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek',
      }}
      events={events}// Les événements à afficher
  nowIndicator={true}// Indicateur du temps actuel
  editable={true} // Active la possibilité de déplacer et redimensionner les événements
  droppable={true}// Permet aux événements d'être déplaçables
  selectable={true}// Permet la sélection de plages de dates
  selectMirror={true}// Permet la sélection de plages de dates
  dateClick={handleDateClick}// Permet la sélection de plages de dates
  eventClick={handleEventClick}// Permet la sélection de plages de dates
  eventDrop={(data) => handleEventDrop(data)}// Permet la sélection de plages de dates
  eventResize={(data) => handleEventDrop(data)} // Utilise la même fonction pour le déplacement et la redimension

  /></div>
  );
};

export default CalendarComponent;
