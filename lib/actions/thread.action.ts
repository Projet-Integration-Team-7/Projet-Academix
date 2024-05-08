"use server";
import { connect } from "http2";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import path from "path";
import { threadId } from "worker_threads";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  image: string | null;
  path: string;
  threadType: string;
}
/**
 * Crée un nouveau fil de discussion.
 * @param text - Le texte du fil de discussion.
 * @param author - L'auteur du fil de discussion.
 * @param communityId - L'ID de la communauté à laquelle le fil de discussion appartient.
 * @param path - Le chemin du fil de discussion.
 * @param image - L'image du fil de discussion.
 * @param threadType - Le type de fil de discussion.
 */
export async function createThread({
  text,
  author,
  communityId,
  path,
  image,
  threadType,
}: Params) {
  try {
    connectToDB();
    console.log("id", communityId);

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );
    console.log("marche", 1);

    const createdThread = await Thread.create({
      text,
      author,
      image,
      community: communityIdObject,
      threadType,
    });

    // Mettre à jour le modèle utilisateur
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Mettre à jour le modèle de la communauté
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    // S'assurer que le chemin est mis à jour
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la création du fil de discussion : ${error.message}`
    );
  }
}

/**
 * Récupère les publications paginées.
 * @param pageNumber - Le numéro de la page.
 * @param pageSize - La taille de la page.
 * @returns Les publications et un indicateur indiquant s'il y a une page suivante.
 */
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculer le nombre de publications à sauter
  const skipAmount = (pageNumber - 1) * pageSize;

  // Rechercher les publications qui n'ont pas de parent (= qui ne sont pas des commentaires)
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Peupler le champ children
      populate: {
        path: "author", // Peupler le champ author dans children
        model: User,
        select: "_id name parentId image", // Sélectionner uniquement les champs _id et username de l'auteur
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

/**
 * Récupère un fil de discussion par son ID.
 * @param threadId - L'ID du fil de discussion.
 * @returns Le fil de discussion.
 */
export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Peupler le champ author avec _id et username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Peupler le champ community avec _id et name
      .populate({
        path: "children", // Peupler le champ children
        populate: [
          {
            path: "author", // Peupler le champ author dans children
            model: User,
            select: "_id id name parentId image", // Sélectionner uniquement les champs _id et username de l'auteur
          },
          {
            path: "children", // Peupler le champ children dans children
            model: Thread, // Le modèle des enfants imbriqués (supposant que c'est le même modèle "Thread")
            populate: {
              path: "author", // Peupler le champ author dans les enfants imbriqués
              model: User,
              select: "_id id name parentId image", // Sélectionner uniquement les champs _id et username de l'auteur
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Erreur lors de la récupération du fil de discussion :", err);
    throw new Error("Impossible de récupérer le fil de discussion");
  }
}

/**
 * Récupère tous les fils de discussion enfants d'un fil de discussion.
 * @param threadId - L'ID du fil de discussion.
 * @returns Une liste de tous les fils de discussion enfants.
 */
async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

/**
 * Ajoute un commentaire à un fil de discussion.
 * @param threadId - L'ID du fil de discussion.
 * @param commentText - Le texte du commentaire.
 * @param userId - L'ID de l'utilisateur.
 * @param path - Le chemin du fil de discussion.
 * @param text - Le texte du fil de discussion.
 */
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string,
  text: string
) {
  connectToDB();

  try {
    // Trouver le fil de discussion d'origine par son ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Fil de discussion introuvable");
    }

    // Créer le nouveau fil de discussion de commentaire
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Définir le parentId sur l'ID du fil de discussion d'origine
      threadType: "someValue", // Fournir une valeur valide pour la propriété threadType
    });

    // Enregistrer le fil de discussion de commentaire dans la base de données
    const savedCommentThread = await commentThread.save();

    // Ajouter l'ID du fil de discussion de commentaire au tableau children du fil de discussion d'origine
    originalThread.children.push(savedCommentThread._id);

    // Enregistrer le fil de discussion d'origine mis à jour dans la base de données
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Erreur lors de l'ajout du commentaire :", err);
    throw new Error("Impossible d'ajouter le commentaire");
  }
}

/**
 * Met à jour le statut "J'aime" d'un fil de discussion.
 * @param threadId - L'ID du fil de discussion.
 * @param userId - L'ID de l'utilisateur.
 * @param isLiked - Indique si le fil de discussion est aimé ou non.
 */
export async function updateLikeToThread(
  threadId: string,
  userId: string,
  isLiked: boolean
) {
  connectToDB();

  try {
    // Trouver le fil de discussion d'origine par son ID
    const currentThread = await Thread.findById(threadId);

    if (!currentThread) {
      throw new Error("Fil de discussion introuvable");
    }

    if (isLiked) {
      currentThread.likes.set(userId, new Date());
    } else {
      currentThread.likes.delete(userId);
    }

    console.log(currentThread);

    await currentThread.save();
  } catch (error: any) {
    throw new Error(
      `Erreur lors de la mise à jour du "J'aime" sur le fil de discussion : ${error.message}`
    );
  }
}

/**
 * Récupère le nombre de "J'aime" d'un fil de discussion.
 * @param threadId - L'ID du fil de discussion.
 * @returns Le nombre de "J'aime".
 */
export async function getThreadLikesCount(threadId: string): Promise<number> {
  try {
    // Trouver le fil de discussion par son ID
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error("Fil de discussion introuvable");
    }

    // Obtenir le nombre de clés dans la Map des "J'aime"
    const likesCount = thread.likes.size;

    return likesCount;
  } catch (error: any) {
    throw new Error(
      `Échec de la récupération du nombre de "J'aime" du fil de discussion : ${error.message}`
    );
  }
}

/**
 * Supprime un fil de discussion.
 * @param id - L'ID du fil de discussion.
 * @param path - Le chemin du fil de discussion.
 */
export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Trouver le fil de discussion à supprimer (le fil de discussion principal)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Fil de discussion introuvable");
    }

    // Récupérer tous les fils de discussion enfants et leurs descendants de manière récursive
    const descendantThreads = await fetchAllChildThreads(id);

    // Obtenir tous les IDs des fils de discussion descendants, y compris l'ID du fil de discussion principal et les IDs des fils de discussion enfants
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extraire les IDs des auteurs et des communautés pour mettre à jour les modèles User et Community respectivement
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Utiliser le chaînage optionnel pour gérer les valeurs éventuellement indéfinies
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Utiliser le chaînage optionnel pour gérer les valeurs éventuellement indéfinies
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Supprimer de manière récursive les fils de discussion enfants et leurs descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Mettre à jour le modèle User
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Mettre à jour le modèle Community
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(
      `Échec de la suppression du fil de discussion : ${error.message}`
    );
  }
}

/**
 * Supprime tous les fils de discussion supprimés des utilisateurs.
 */
export async function removeAllDeletedThreadsFromUsers() {
  try {
    // Récupérer tous les IDs de fils de discussion depuis la collection Thread
    const allThreads = await Thread.find({});
    const allThreadIds = allThreads.map((thread) => thread._id.toString());

    // Récupérer tous les utilisateurs
    const users = await User.find({});

    // Pour chaque utilisateur
    for (let user of users) {
      // Filtrer le tableau des fils de discussion de l'utilisateur pour inclure uniquement les IDs présents dans allThreadIds
      const validThreads = user.threads.filter((threadId: string) =>
        allThreadIds.includes(threadId.toString())
      );

      // S'il y a des fils de discussion invalides, mettre à jour le tableau des fils de discussion de l'utilisateur
      if (validThreads.length !== user.threads.length) {
        user.threads = validThreads;
        user.save();
      }
    }
  } catch (error: any) {
    throw new Error(
      `Échec de la suppression des fils de discussion des utilisateurs supprimés : ${error.message}`
    );
  }
}
