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
  handleEventDrop: (data: any) => void; // Function to add an event

}

const CalendarComponent: React.FC<CalendarProps> = ({
  handleDateClick,
  handleEventClick,
  handleEventDrop,
  
}) => {
  const [events, setEvents] = useState<any[]>([]);
  
  
 
  
  
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
      events={events}
  nowIndicator={true}
  editable={true} // Enable dragging and resizing
  droppable={true}
  selectable={true}
  selectMirror={true}
  dateClick={handleDateClick}
  eventClick={handleEventClick}
  eventDrop={(data) => handleEventDrop(data)}
  />
  );
};

export default CalendarComponent;
