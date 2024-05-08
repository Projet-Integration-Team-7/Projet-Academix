"use server";

import { connect } from "http2";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import { clerkClient } from "@clerk/nextjs";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
/**
 * Met à jour un utilisateur dans la base de données.
 * @param userId - L'identifiant de l'utilisateur.
 * @param bio - La biographie de l'utilisateur.
 * @param name - Le nom de l'utilisateur.
 * @param path - Le chemin de l'utilisateur.
 * @param username - Le nom d'utilisateur de l'utilisateur.
 * @param image - L'image de l'utilisateur.
 */
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  // Se connecte à la base de données
  connectToDB();

  try {
    // Met à jour l'utilisateur dans la base de données
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    // Vérifie si le chemin est '/profile/edit' et le réinitialise
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(
      `Impossible de mettre à jour l'utilisateur : ${error.message}`
    );
  }
}

/**
 * Récupère un utilisateur à partir de son identifiant.
 * @param userId - L'identifiant de l'utilisateur.
 * @returns L'utilisateur correspondant à l'identifiant.
 */
export async function fetchUser(userId: string) {
  try {
    // Se connecte à la base de données
    connectToDB();

    // Récupère l'utilisateur à partir de son identifiant
    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(
      `Échec de la récupération de l'utilisateur : ${error.message}`
    );
  }
}

/**
 * Récupère les publications d'un utilisateur à partir de son identifiant.
 * @param userId - L'identifiant de l'utilisateur.
 * @returns Les publications de l'utilisateur.
 */
export async function fetchUserPosts(userId: string) {
  try {
    // Se connecte à la base de données
    connectToDB();

    // Récupère les publications de l'utilisateur
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(
      `Échec de la récupération des publications de l'utilisateur : ${error.message}`
    );
  }
}

/**
 * Récupère les utilisateurs en fonction des critères de recherche.
 * @param userId - L'identifiant de l'utilisateur.
 * @param searchString - La chaîne de recherche.
 * @param pageNumber - Le numéro de la page.
 * @param pageSize - La taille de la page.
 * @param sortBy - Le critère de tri.
 * @returns Les utilisateurs correspondant aux critères de recherche.
 */
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    // Se connecte à la base de données
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(
      `Échec de la récupération des utilisateurs : ${error.message}`
    );
  }
}

/**
 * Récupère l'activité d'un utilisateur à partir de son identifiant.
 * @param userId - L'identifiant de l'utilisateur.
 * @returns L'activité de l'utilisateur.
 */
export async function getActivity(userId: string) {
  try {
    // Se connecte à la base de données
    connectToDB();

    // Récupère tous les messages envoyés par l'utilisateur
    const userThreads = await Thread.find({ author: userId });

    // Récupère les réponses aux messages de l'utilisateur
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(
      `Échec de la récupération de l'activité de l'utilisateur : ${error.message}`
    );
  }
}

/**
 * Met à jour les likes d'une publication pour un utilisateur donné.
 * @param threadId - L'identifiant de la publication.
 * @param userId - L'identifiant de l'utilisateur.
 * @param isLiked - Indique si la publication est aimée ou non.
 */
export async function updatePostToLikes(
  threadId: string,
  userId: string,
  isLiked: boolean
) {
  try {
    // Trouve l'utilisateur par son identifiant
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Met à jour les likes de l'utilisateur
    if (isLiked) {
      user.likes.set(threadId, new Date());
    } else {
      user.likes.delete(threadId);
    }

    // Enregistre l'utilisateur mis à jour
    await user.save();
  } catch (error: any) {
    throw new Error(
      `Échec de la mise à jour des likes de l'utilisateur : ${error.message}`
    );
  }
}

/**
 * Supprime une publication d'un utilisateur.
 * @param userId - L'identifiant de l'utilisateur.
 * @param threadId - L'identifiant de la publication.
 */
export async function removeThreadFromUser(
  userId: string,
  threadId: string
): Promise<void> {
  try {
    // Se connecte à la base de données
    connectToDB();

    // Supprime la publication de l'utilisateur
    await User.updateOne({ id: userId }, { $pull: { threads: threadId } });
  } catch (error: any) {
    throw new Error(
      `Échec de la suppression de la publication de l'utilisateur : ${error.message}`
    );
  }
}

/**
 * Met à jour la biographie d'un utilisateur.
 * @param userId - L'identifiant de l'utilisateur.
 * @param newBio - La nouvelle biographie de l'utilisateur.
 */
export const updateBio = async (
  userId: string,
  newBio: string
): Promise<void> => {
  // Se connecte à la base de données
  connectToDB();

  try {
    // Met à jour la biographie de l'utilisateur dans la base de données MongoDB
    await User.findOneAndUpdate(
      { id: userId },
      { bio: newBio },
      { upsert: true }
    );

    console.log("La biographie a été mise à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la biographie :", error);
  }
};

/**
 * Met à jour le nom d'un utilisateur.
 * @param userId - L'identifiant de l'utilisateur.
 * @param newName - Le nouveau nom de l'utilisateur.
 */
export const updateName = async (
  userId: string,
  newName: string
): Promise<void> => {
  // Se connecte à la base de données
  connectToDB();

  try {
    // Met à jour le nom de l'utilisateur dans la base de données MongoDB
    await User.findOneAndUpdate(
      { id: userId },
      { name: newName },
      { upsert: true }
    );

    console.log("Le nom a été mis à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom :", error);
  }
};

/**
 * Met à jour l'image d'un utilisateur.
 * @param userId - L'identifiant de l'utilisateur.
 * @param newImage - La nouvelle image de l'utilisateur.
 */
export const updateImage = async (
  userId: string,
  newImage: string
): Promise<void> => {
  // Se connecte à la base de données
  connectToDB();

  try {
    // Met à jour l'image de l'utilisateur dans la base de données MongoDB
    await User.findOneAndUpdate(
      { id: userId },
      { image: newImage },
      { upsert: true }
    );

    console.log("L'image a été mise à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image :", error);
  }
};

/**
 * Ajoute un ami à un utilisateur.
 * @param userId - L'identifiant de l'utilisateur.
 * @param friendId - L'identifiant de l'ami.
 */
export async function addFriend(userId: string, friendId: string) {
  try {
    // Se connecte à la base de données
    connectToDB();

    // Récupère l'utilisateur et l'ami
    const user = await fetchUser(userId);
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const friend = await fetchUser(friendId);
    if (!friend) {
      throw new Error(`Ami ${friendId} introuvable`);
    }

    // Ajoute l'ami à la liste d'amis de l'utilisateur
    user.friends.push(friend);

    // Ajoute l'utilisateur à la liste d'amis de l'ami
    friend.friends.push(user);

    // Enregistre les modifications
    user.save();
    friend.save();
  } catch (error: any) {
    throw new Error(`Échec de l'ajout de l'ami : ${error.message}`);
  }
}

/**
 * Supprime un ami d'un utilisateur.
 * @param currentUserId - L'identifiant de l'utilisateur actuel.
 * @param friendId - L'identifiant de l'ami à supprimer.
 */
export async function removeFriend(currentUserId: string, friendId: string) {
  try {
    // Récupère l'utilisateur actuel
    const currentUser = await User.findOne({ id: currentUserId });
    if (!currentUser) {
      throw new Error("Utilisateur actuel introuvable");
    }

    // Récupère l'ami à supprimer
    const friend = await User.findOne({ id: friendId });
    if (!friend) {
      throw new Error(`Ami ${friendId} introuvable`);
    }

    // Supprime l'ami de la liste d'amis de l'utilisateur actuel
    const friendIndex = currentUser.friends.indexOf(friend._id);
    if (friendIndex !== -1) {
      currentUser.friends.splice(friendIndex, 1);
    }

    // Supprime l'utilisateur actuel de la liste d'amis de l'ami
    const currentUserIndex = friend.friends.indexOf(currentUser._id);
    if (currentUserIndex !== -1) {
      friend.friends.splice(currentUserIndex, 1);
    }

    // Enregistre les modifications
    await currentUser.save();
    await friend.save();
  } catch (error: any) {
    throw new Error(`Échec de la suppression de l'ami : ${error.message}`);
  }
}

/**
 * Vérifie si deux utilisateurs sont amis.
 * @param currentUserId - L'identifiant de l'utilisateur actuel.
 * @param userId - L'identifiant de l'utilisateur à vérifier.
 * @returns Vrai si les utilisateurs sont amis, sinon faux.
 */
export async function verifyFriendship(
  currentUserId: string,
  userId: string
): Promise<boolean> {
  try {
    // Se connecte à la base de données
    connectToDB();

    // Récupère l'utilisateur actuel
    const currentUser = await User.findOne({ id: currentUserId }).exec();
    if (!currentUser) {
      throw new Error("Utilisateur actuel introuvable");
    }

    // Récupère l'utilisateur à vérifier
    const user = await User.findOne({ id: userId }).exec();
    if (!user) {
      throw new Error("Utilisateur profilé introuvable");
    }

    // Vérifie si l'utilisateur actuel est ami avec l'utilisateur à vérifier
    return currentUser.friends.includes(user._id);
  } catch (error: any) {
    throw new Error(`Échec de la vérification de l'amitié : ${error.message}`);
  }
}

/**
 * Supprime les utilisateurs supprimés de la base de données.
 */
export async function removeDeletedUsers() {
  try {
    // Récupère tous les utilisateurs
    const usersClerk = await clerkClient.users.getUserList();
    const usersMap = usersClerk.map((user) => user.id.toString());

    // Récupère tous les utilisateurs de la base de données MongoDB
    const usersMongo = await User.find();
    const usersMongoMap = usersMongo.map((user) => user.id.toString());

    // Supprime les utilisateurs qui ne sont plus présents dans l'API externe
    for (let user of usersMongoMap) {
      if (!usersMap.includes(user)) {
        await User.deleteOne({ _id: user });
      }
    }
  } catch (error: any) {
    throw new Error(
      `Échec de la suppression des utilisateurs supprimés de la base de données MongoDB : ${error.message}`
    );
  }
}
