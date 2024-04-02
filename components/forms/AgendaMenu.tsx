import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEvent,deleteEvent,fetchEvents,updateEvent } from '@/lib/actions/events.action';
import dynamic from 'next/dynamic';
    import { Draggable } from '@fullcalendar/interaction';

interface CalendarProps {
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void;
  handleEventClick: (event: any) => void; // Function to handle event click
}

const CalendarComponent: React.FC<CalendarProps> = ({
  handleDateClick,
  handleEventClick,
}) => {
  const [events, setEvents] = useState<any[]>([]);

  
 
  
  const handleEventDrop = async (dropInfo) => {
    try {
      const eventId = dropInfo.event.id; // Assuming the event ID is stored in the 'id' property
      if (!eventId) {
        throw new Error('Event ID is missing or invalid');
      }
      const newStart = dropInfo.event.start;
  
      await updateEvent(eventId, { start: newStart.toISOString() });
  
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === eventId ? { ...e, start: newStart } : e
        )
      );
    } catch (error) {
      console.error('Error updating event after drop:', error);
      dropInfo.revert();
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
    let draggableEl = document.getElementById('draggable-el');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl: { getAttribute: (arg0: string) => any; }) {
          let title = eventEl.getAttribute('title');
          let id = eventEl.getAttribute('data');
          let start = eventEl.getAttribute('start');
          return { title, id, start };
        },
      });
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <FullCalendar
    
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineWook, dayGridMonth,timeGridWeek',
      }}
      events={events}
  nowIndicator={true}
  editable={true} // Enable dragging and resizing
  droppable={true}
  eventDrop={handleEventDrop}
  selectable={true}
  selectMirror={true}
  dateClick={handleDateClick}
  eventClick={handleEventClick}
  eventDrop={handleEventDrop} // Replace the handleDeleteModal function with the handleEventClick function
      />
  );
};

export default CalendarComponent;
