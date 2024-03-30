import { Event } from "../models/event.model"; // Import your Event model

// Action types
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';

// Action creators
export function createEvent(event: Event) {
  return {
    type: CREATE_EVENT,
    payload: event,
  };
}

export function updateEvent(event: Event) {
  return {
    type: UPDATE_EVENT,
    payload: event,
  };
}

export function deleteEvent(eventId: string) {
  return {
    type: DELETE_EVENT,
    payload: eventId,
  };
}