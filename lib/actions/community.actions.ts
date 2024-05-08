"use server";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

/**
 * Crée une nouvelle communauté.
 * @param id - L'identifiant de la communauté.
 * @param name - Le nom de la communauté.
 * @param username - Le nom d'utilisateur de la communauté.
 * @param image - L'image de la communauté.
 * @param bio - La description de la communauté.
 * @param createdById - L'identifiant de l'utilisateur qui a créé la communauté.
 * @returns La communauté créée.
 */
export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string
) {
  try {
    connectToDB();

    // Trouve l'utilisateur avec l'identifiant fourni
    const user = await User.findOne({ id: createdById });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const newCommunity = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id,
    });

    const createdCommunity = await newCommunity.save();

    // Met à jour le modèle User
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error) {
    console.error("Erreur lors de la création de la communauté :", error);
    throw error;
  }
}

/**
 * Récupère les détails d'une communauté.
 * @param id - L'identifiant de la communauté.
 * @returns Les détails de la communauté.
 */
export async function fetchCommunityDetails(id: string) {
  try {
    connectToDB();

    const communityDetails = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    return communityDetails;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de la communauté :",
      error
    );
    throw error;
  }
}

/**
 * Récupère les publications d'une communauté.
 * @param id - L'identifiant de la communauté.
 * @returns Les publications de la communauté.
 */
export async function fetchCommunityPosts(id: string) {
  try {
    connectToDB();

    const communityPosts = await Community.findById(id).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "image _id",
          },
        },
      ],
    });

    return communityPosts;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des publications de la communauté :",
      error
    );
    throw error;
  }
}

/**
 * Récupère les communautés en fonction des critères de recherche et de tri.
 * @param searchString - La chaîne de recherche.
 * @param pageNumber - Le numéro de la page.
 * @param pageSize - La taille de la page.
 * @param sortBy - L'ordre de tri.
 * @returns Les communautés correspondantes et un indicateur indiquant s'il y a plus de communautés.
 */
export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calcule le nombre de communautés à ignorer en fonction du numéro de page et de la taille de la page.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Crée une expression régulière insensible à la casse pour la chaîne de recherche fournie.
    const regex = new RegExp(searchString, "i");

    // Crée un objet de requête initial pour filtrer les communautés.
    const query: FilterQuery<typeof Community> = {};

    // Si la chaîne de recherche n'est pas vide, ajoute l'opérateur $or pour correspondre aux champs username ou name.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Définit les options de tri pour les communautés récupérées en fonction du champ createdAt et de l'ordre de tri fourni.
    const sortOptions = { createdAt: sortBy };

    // Crée une requête pour récupérer les communautés en fonction des critères de recherche et de tri.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Compte le nombre total de communautés correspondant aux critères de recherche (sans pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Vérifie s'il y a plus de communautés au-delà de la page actuelle.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Erreur lors de la récupération des communautés :", error);
    throw error;
  }
}

/**
 * Ajoute un membre à une communauté.
 * @param communityId - L'identifiant de la communauté.
 * @param memberId - L'identifiant du membre.
 * @returns La communauté mise à jour.
 */
export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectToDB();

    // Trouve la communauté par son identifiant unique
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Communauté introuvable");
    }

    // Trouve l'utilisateur par son identifiant unique
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Vérifie si l'utilisateur est déjà membre de la communauté
    if (community.members.includes(user._id)) {
      throw new Error("L'utilisateur est déjà membre de la communauté");
    }

    // Ajoute l'identifiant de l'utilisateur au tableau des membres de la communauté
    community.members.push(user._id);
    await community.save();

    // Ajoute l'identifiant de la communauté au tableau des communautés de l'utilisateur
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    console.error("Erreur lors de l'ajout du membre à la communauté :", error);
    throw error;
  }
}

/**
 * Supprime un utilisateur d'une communauté.
 * @param userId - L'identifiant de l'utilisateur.
 * @param communityId - L'identifiant de la communauté.
 * @returns Un objet indiquant le succès de l'opération.
 */
export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("Utilisateur introuvable");
    }

    if (!communityIdObject) {
      throw new Error("Communauté introuvable");
    }

    // Supprime l'identifiant de l'utilisateur du tableau des membres de la communauté
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Supprime l'identifiant de la communauté du tableau des communautés de l'utilisateur
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'utilisateur de la communauté :",
      error
    );
    throw error;
  }
}

/**
 * Met à jour les informations d'une communauté.
 * @param communityId - L'identifiant de la communauté.
 * @param name - Le nom de la communauté.
 * @param username - Le nom d'utilisateur de la communauté.
 * @param image - L'image de la communauté.
 * @returns La communauté mise à jour.
 */
export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectToDB();

    // Trouve la communauté par son identifiant et met à jour les informations
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error("Communauté introuvable");
    }

    return updatedCommunity;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations de la communauté :",
      error
    );
    throw error;
  }
}

/**
 * Supprime une communauté.
 * @param communityId - L'identifiant de la communauté.
 * @returns La communauté supprimée.
 */
export async function deleteCommunity(communityId: string) {
  try {
    connectToDB();

    // Trouve la communauté par son ID et la supprime
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Communauté introuvable");
    }

    // Supprime tous les fils de discussion associés à la communauté
    await Thread.deleteMany({ community: communityId });

    // Trouve tous les utilisateurs faisant partie de la communauté
    const communityUsers = await User.find({ communities: communityId });

    // Supprime la communauté du tableau 'communities' pour chaque utilisateur
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error("Erreur lors de la suppression de la communauté :", error);
    throw error;
  }
}
