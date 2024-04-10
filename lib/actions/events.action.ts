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
    const existingEvent = await Event.findOne({ title: title });

    if (!existingEvent) {
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
      throw new Error('An event with this name already exists.');
    }
   
   
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


export async function updateEvent(title: string, eventData: any) {
  try {
    // Validate input parameters
    if (!title || !eventData || (eventData.constructor === Object && Object.keys(eventData).length === 0)) {
      throw new Error('Inv2222alid input: title and eventData are required.');
    }
    console.error(`Hihi updating event by title: ${title}`);

    // Find and update the event in the# database using the Event model
    const updatedEvent = await Event.findOneAndUpdate({ title: title }, eventData, { new: true });

    if (!updatedEvent) {
      throw new Error('Event not found with the provided title');
    }
    
    return updatedEvent;
  } catch (error) {
    console.error(`Error updating event by title: ${error.message}`);
    throw new Error(`Error updating event by title: ${error.message}`);
  }
}

export async function deleteEvent(title: string) {

      try {
        connectToDB(); // Connect to the database

        // Find and delete the event in the database using the Event model
        const deletedEvent = await Event.findOneAndDelete({ title: title });
        

        if (!deletedEvent) {
          console.error('Event not found with ID:', title);
          return false; // Event not found
        }
        return deletedEvent;
        console.error('Error deleting event with ID:', title);

        return true;
      } catch (error: any) {
        throw new Error(`Error deleting event: ${title}. Error: ${error.message}`);
      }
}

export async function findEvent(eventId:string) {
  try {
    connectToDB(); // Connect to the database

    // Find the event in the database using the Event model
    const event = await Event.findOne({eventId});

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  } catch (error: any) {
    throw new Error(`Error finding event: ${error.message}`);
  }
}

