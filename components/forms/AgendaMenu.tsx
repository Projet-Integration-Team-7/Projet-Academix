// This component renders the FullCalendar
import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

// Define props interface for CalendarComponent
interface CalendarProps {
  events: any[]; // Array of events
  handleDateClick: (arg: { date: Date; allDay: boolean }) => void; // Function to handle date clicks
  addEvent: (data: any) => void; // Function to add an event
  handleDeleteModal: (data: { event: { id: string } }) => void; // Function to handle delete modal
}

// Define the CalendarComponent
const CalendarComponent: React.FC<CalendarProps> = ({
  events,
  handleDateClick,
  addEvent,
  handleDeleteModal,
}) => {
  // Run useEffect to set up FullCalendar logic
  useEffect(() => {
    let draggableEl = document.getElementById('draggable-el')
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title")
          let id = eventEl.getAttribute("data")
          let start = eventEl.getAttribute("start")
          return { title, id, start }
        }
      })
    }
  }, [])


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
      editable={true}
      droppable={true}
      selectable={true}
      selectMirror={true}
      dateClick={handleDateClick}
      drop={(data) => addEvent(data)}
      eventClick={(data) => handleDeleteModal(data)}
    />
  );
};

export default CalendarComponent;
