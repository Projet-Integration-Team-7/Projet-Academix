"use server";
import { connect } from "http2";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import path from "path";
import { threadId } from "worker_threads";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

export const fetchStatistics = async () => {
  // Logique pour récupérer les statistiques
};

/**
 * Récupère les auteurs les plus actifs
 * @returns Les auteurs les plus actifs
 */
export async function fetchTopAuthors() {
  connectToDB();
  console.log("Connecté à la base de données MongoDB");

  try {
    // Utiliser l'agrégation pour grouper par 'author' et compter les occurrences
    const topAuthors = await Thread.aggregate([
      {
        $group: {
          _id: "$author", // Regrouper par le champ 'author'
          count: { $sum: 1 }, // Compter les occurrences
        },
      },
      {
        $sort: { count: -1 }, // Trier par nombre d'occurrences en ordre décroissant
      },
      {
        $limit: 3, // Limiter aux 3 premiers
      },
      {
        $lookup: {
          // Optionnel: Rechercher les détails de l'auteur dans la collection User
          from: "users", // Supposons que votre collection d'utilisateurs s'appelle 'users'
          localField: "_id",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails", // Aplatir le tableau authorDetails
      },
      {
        $project: {
          // Sélectionner uniquement les champs que vous souhaitez afficher
          authorId: "$_id",
          name: "$authorDetails.name",
          count: 1,
        },
      },
    ]);

    return topAuthors;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des auteurs les plus actifs :",
      error
    );
    throw new Error(
      `Échec de la récupération des auteurs les plus actifs : ${error.message}`
    );
  }
}

/**
 * Récupère le nombre d'utilisateurs
 * @returns Le nombre d'utilisateurs
 */
export async function fetchNumberOfUsers() {
  connectToDB();

  try {
    const numberOfUsers = await User.countDocuments();
    return numberOfUsers;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la récupération du nombre d'utilisateurs : ${error.message}`
    );
  }
}

/**
 * Récupère le nombre de communautés
 * @returns Le nombre de communautés
 */
export async function fetchNumberOfCommunities() {
  connectToDB();

  try {
    const numberOfCommunities = await Community.countDocuments();
    return numberOfCommunities;
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la récupération du nombre de communautés : ${error.message}`
    );
  }
}

/**
 * Récupère les threads les plus aimés
 * @returns Les threads les plus aimés
 */
export async function fetchThreadsLikes() {
  connectToDB();
  console.log("Connecté à la base de données MongoDB");

  try {
    // Utiliser l'agrégation pour grouper par 'author' et compter les occurrences
    const topThreadsLikes = await Thread.aggregate([
      {
        $project: {
          _id: 1,
          author: 1,
          likesCount: { $size: { $objectToArray: "$likes" } },
        },
      },
      {
        $sort: { likesCount: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: "$authorInfo",
      },
      {
        $project: {
          _id: 1,
          "authorInfo.name": 1,
          likesCount: 1,
        },
      },
    ]);

    console.log("Threads les plus aimés :", topThreadsLikes); // Afficher les résultats de l'agrégation

    return topThreadsLikes;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des threads les plus aimés :",
      error
    );
    throw new Error(
      `Échec de la récupération des threads les plus aimés : ${error.message}`
    );
  }
}
