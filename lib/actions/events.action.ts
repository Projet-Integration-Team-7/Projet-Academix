import { connectToDB } from "../mongoose";
import Event from "../models/event.model";

// Importation des modules et des modèles nécessaires
"use server"


// Types d'action
interface EventParams {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
}

// Crée un nouvel événement dans la base de données
export async function createEvent({title,start,end,allDay,color}:EventParams) {
  try {
    connectToDB(); // Connexion à la base de données
    const existingEvent = await Event.findOne({ title: title });

    if (!existingEvent) {
      // Crée un événement dans la base de données en utilisant le modèle Event
      const newEvent = await Event.create({
        title,
        start,
        end,
        allDay,
        color,
      });
      const createdEvent = await newEvent.save();
      
      return createdEvent;
      throw new Error('Un événement avec ce nom existe déjà.');
    }
  } catch (error: any) {
    throw new Error(`Erreur lors de la création de l'événement : ${error.message}`);
  }
}

// Récupère tous les événements de la base de données
export async function fetchEvents() {
  try {
    connectToDB(); // Connexion à la base de données
    
    // Récupère tous les événements de la base de données en utilisant le modèle Event
    const events = await Event.find({});

    return events;
  } catch (error: any) {
    throw new Error(`Erreur lors de la récupération des événements : ${error.message}`);
  }
}

// Met à jour un événement dans la base de données
export async function updateEvent(title: string, eventData: any) {
  try {
    // Valide les paramètres d'entrée
    if (!title || !eventData || (eventData.constructor === Object && Object.keys(eventData).length === 0)) {
      throw new Error('Entrée invalide : le titre et les données de l\'événement sont requis.');
    }
    console.error(`Mise à jour de l'événement par titre : ${title}`);

    // Trouve et met à jour l'événement dans la base de données en utilisant le modèle Event
    const updatedEvent = await Event.findOneAndUpdate({ title: title }, eventData, { new: true });

    if (!updatedEvent) {
      throw new Error('Événement non trouvé avec le titre fourni');
    }
    
    return updatedEvent;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'événement par titre : ${error.message}`);
    throw new Error(`Erreur lors de la mise à jour de l'événement par titre : ${error.message}`);
  }
}

// Supprime un événement de la base de données
export async function deleteEvent(title: string) {
  try {
    connectToDB(); // Connexion à la base de données

    // Trouve et supprime l'événement dans la base de données en utilisant le modèle Event
    const deletedEvent = await Event.findOneAndDelete({ title: title });

    if (!deletedEvent) {
      console.error('Événement non trouvé avec le titre :', title);
      return false; // Événement non trouvé
    }
    return deletedEvent;
    console.error('Erreur lors de la suppression de l\'événement avec le titre :', title);

    return true;
  } catch (error: any) {
    throw new Error(`Erreur lors de la suppression de l'événement : ${title}. Erreur : ${error.message}`);
  }
}

// Trouve un événement dans la base de données
export async function findEvent(eventId:string) {
  try {
    connectToDB(); // Connexion à la base de données

    // Trouve l'événement dans la base de données en utilisant le modèle Event
    const event = await Event.findOne({eventId});

    if (!event) {
      throw new Error('Événement non trouvé');
    }

    return event;
  } catch (error: any) {
    throw new Error(`Erreur lors de la recherche de l'événement : ${error.message}`);
  }
}
