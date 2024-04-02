// Import necessary modules and models
"use server"


import { connectToDB } from "../mongoose";
import Event from "../models/event.model";

// Action types
interface EventParams {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
}

// Action creators
export async function createEvent({title,start,end,allDay,color}:EventParams) {
  try {
    connectToDB(); // Connect to the database
    
    
    // Create an event in the database using the Event model
    const newEvent = await Event.create({
      title,
      start,
      end,
      allDay,
      color,
    });
    const createdEvent = await newEvent.save();

   
    return createdEvent;
  } catch (error: any) {
    throw new Error(`Error creating event: ${error.message}`);
  }
}

export async function fetchEvents() {
  try {
    connectToDB(); // Connect to the database
    
    // Fetch all events from the database using the Event model
    const events = await Event.find({});

    return events;
  } catch (error: any) {
    throw new Error(`Error fetching events: ${error.message}`);
  }
}

export async function updateEvent(eventId: string, eventData: any) {
  try {
    connectToDB(); // Connect to the database

    // Find and update the event in the database using the Event model
    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

    if (!updatedEvent) {
      throw new Error('Event not found');
    }

    return updatedEvent;
  } catch (error: any) {
    throw new Error(`Error updating event: ${error.message}`);
  }
}

export async function deleteEvent(eventId: string) {
      console.error('Error deleting event with ID:', eventId);

      try {
        connectToDB(); // Connect to the database

        // Find and delete the event in the database using the Event model
        await Event.deleteOne({ _id: eventId });

        console.error('Error deleting event with ID:', eventId);

        return true;
      } catch (error: any) {
        throw new Error(`Error deleting event: ${eventId}. Error: ${error.message}`);
      }
}

export async function findEvent(eventData: { title: string, start: Date, end: Date, allDay: boolean, color: string }) {
  try {
    connectToDB(); // Connect to the database

    // Find the event in the database using the Event model
    const event = await Event.findOne(eventData);

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  } catch (error: any) {
    throw new Error(`Error finding event: ${error.message}`);
  }
}
