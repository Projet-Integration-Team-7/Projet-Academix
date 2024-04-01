import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEvent,deleteEvent,fetchEvents,updateEvent } from '@/lib/actions/events.action';
import dynamic from 'next/dynamic';
interface CalendarProps {
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void;
  handleDeleteModal: (data: { event: { _id: String } }) => void; // Function to handle delete modal
}

const CalendarComponent: React.FC<CalendarProps> = ({
  handleDateClick,
  handleDeleteModal,
}) => {
  const [events, setEvents] = useState<any[]>([]);

  const handleEventClick = (clickInfo) => {
    let id = clickInfo.event.id;
    console.log(id);
  }
 


  
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
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <FullCalendar
  eventClick={handleEventClick}
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineWook, dayGridMonth,timeGridWeek',
      }}
      events={events} // Pass the fetched events array to the FullCalendar component
      nowIndicator={true}
      editable={true}
      droppable={true}
      selectable={true}
      selectMirror={true}
      dateClick={handleDateClick}
      eventClick={handleEventClick}
 
    />
  );
};

export default CalendarComponent;
