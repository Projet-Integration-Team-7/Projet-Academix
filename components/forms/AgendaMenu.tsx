import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fetchEvents } from '@/lib/actions/events.action';

interface CalendarProps {
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void;
  handleDeleteModal: (data: { event: { id: string } }) => void;
}

const CalendarComponent: React.FC<CalendarProps> = ({
  handleDateClick,
  handleDeleteModal,
}) => {
  const [events, setEvents] = useState<any[]>([]);

  const handleDeleteEvent = async (arg: { event: { id: string } }) => {
    const eventId = arg.event.id;
    try {
      // Call the deleteEvent function to delete the event
      await deleteEvent(eventId);
      // Update the UI by removing the deleted event
      // You need to implement this part based on your UI logic
    } catch (error) {
      console.error('Error deleting event:', error);
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
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <FullCalendar
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
      eventClick={handleDeleteEvent}
    />
  );
};

export default CalendarComponent;
